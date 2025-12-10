"use client";
import React, { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

type OrgNode = {
  name: string;
  level: number;
  child?: OrgNode[];
};

const defaultData: OrgNode = {
  name: "root",
  level: 0,
  child: [],
};

export default function OrgChartEditor() {
  const [data, setData] = useState<OrgNode>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedPath, setSelectedPath] = useState<number[] | null>(null);
  const [draggedPath, setDraggedPath] = useState<number[] | null>(null);
  const [dropTarget, setDropTarget] = useState<{ path: number[]; position: "left" | "right" | "child" } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const docRef = doc(db, "organization", "chart");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data() as OrgNode);
      }
    } catch (e) {
      console.error("조직도 로드 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "organization", "chart"), data);
      alert("저장되었습니다!");
    } catch (e) {
      console.error("저장 실패:", e);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // 노드 가져오기
  const getNode = (path: number[]): OrgNode | null => {
    let node = data;
    for (const idx of path) {
      if (!node.child || !node.child[idx]) return null;
      node = node.child[idx];
    }
    return node;
  };

  // 노드 업데이트
  const updateNode = (path: number[], field: "name", value: string) => {
    const newData = JSON.parse(JSON.stringify(data));
    let node = newData;
    for (const idx of path) {
      node = node.child![idx];
    }
    node[field] = value;
    setData(newData);
  };

  // 레벨 재계산
  const recalculateLevels = (node: OrgNode, level: number): OrgNode => {
    node.level = level;
    if (node.child) {
      node.child = node.child.map(child => recalculateLevels(child, level + 1));
    }
    return node;
  };

  // 하위 노드 추가
  const addChild = (path: number[]) => {
    const newData = JSON.parse(JSON.stringify(data));
    let node = newData;
    for (const idx of path) {
      node = node.child![idx];
    }
    if (!node.child) node.child = [];
    node.child.push({ name: "새 항목", level: node.level + 1 });
    setData(newData);
  };

  // 노드 삭제
  const deleteNode = (path: number[]) => {
    if (path.length === 0) return;
    const newData = JSON.parse(JSON.stringify(data));
    let parent = newData;
    for (let i = 0; i < path.length - 1; i++) {
      parent = parent.child![path[i]];
    }
    parent.child!.splice(path[path.length - 1], 1);
    setData(newData);
  };

  // 왼쪽에 형제 노드 추가
  const addSiblingLeft = (path: number[]) => {
    if (path.length === 0) return;
    const newData = JSON.parse(JSON.stringify(data));
    let parent = newData;
    for (let i = 0; i < path.length - 1; i++) {
      parent = parent.child![path[i]];
    }
    const currentIndex = path[path.length - 1];
    const currentLevel = parent.child![currentIndex].level;
    parent.child!.splice(currentIndex, 0, { name: "새 항목", level: currentLevel });
    setData(newData);
  };

  // 오른쪽에 형제 노드 추가
  const addSiblingRight = (path: number[]) => {
    if (path.length === 0) return;
    const newData = JSON.parse(JSON.stringify(data));
    let parent = newData;
    for (let i = 0; i < path.length - 1; i++) {
      parent = parent.child![path[i]];
    }
    const currentIndex = path[path.length - 1];
    const currentLevel = parent.child![currentIndex].level;
    parent.child!.splice(currentIndex + 1, 0, { name: "새 항목", level: currentLevel });
    setData(newData);
  };

  // 노드 이동
  const moveNode = (fromPath: number[], toPath: number[], position: "left" | "right" | "child") => {
    if (fromPath.length === 0) return; // 루트는 이동 불가
    
    // 자기 자신이나 자식으로 이동 방지
    const fromStr = fromPath.join("-");
    const toStr = toPath.join("-");
    if (toStr.startsWith(fromStr)) return;

    const newData = JSON.parse(JSON.stringify(data));
    
    // 이동할 노드 가져오기
    let fromParent = newData;
    for (let i = 0; i < fromPath.length - 1; i++) {
      fromParent = fromParent.child![fromPath[i]];
    }
    const fromIndex = fromPath[fromPath.length - 1];
    const movedNode = fromParent.child!.splice(fromIndex, 1)[0];

    // 목표 위치에 삽입
    let toParent = newData;
    if (position === "child") {
      // 자식으로 추가
      for (const idx of toPath) {
        toParent = toParent.child![idx];
      }
      if (!toParent.child) toParent.child = [];
      toParent.child.push(recalculateLevels(movedNode, toParent.level + 1));
    } else {
      // 형제로 추가
      for (let i = 0; i < toPath.length - 1; i++) {
        toParent = toParent.child![toPath[i]];
      }
      const toIndex = toPath[toPath.length - 1];
      const insertIndex = position === "left" ? toIndex : toIndex + 1;
      const newLevel = toParent.child![toIndex]?.level || toParent.level + 1;
      toParent.child!.splice(insertIndex, 0, recalculateLevels(movedNode, newLevel));
    }

    setData(newData);
    setDraggedPath(null);
    setDropTarget(null);
  };

  // 드래그 시작
  const handleDragStart = (e: React.DragEvent, path: number[]) => {
    if (path.length === 0) {
      e.preventDefault();
      return;
    }
    setDraggedPath(path);
    e.dataTransfer.effectAllowed = "move";
  };

  // 드래그 오버
  const handleDragOver = (e: React.DragEvent, path: number[], position: "left" | "right" | "child") => {
    e.preventDefault();
    if (!draggedPath) return;
    
    // 자기 자신이나 자식으로 드롭 방지
    const draggedStr = draggedPath.join("-");
    const targetStr = path.join("-");
    if (targetStr.startsWith(draggedStr) || draggedStr === targetStr) return;

    setDropTarget({ path, position });
  };

  // 드롭
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedPath && dropTarget) {
      moveNode(draggedPath, dropTarget.path, dropTarget.position);
    }
  };

  // 드래그 종료
  const handleDragEnd = () => {
    setDraggedPath(null);
    setDropTarget(null);
  };

  const renderNode = (node: OrgNode, path: number[] = []) => {
    const levelColors = [
      "bg-orange-500 border-orange-600 text-white",
      "bg-orange-400 border-orange-500 text-white",
      "bg-orange-300 border-orange-400",
      "bg-white border-orange-300",
    ];
    const colorClass = levelColors[Math.min(node.level, 3)];
    const isSelected = selectedPath?.join("-") === path.join("-");
    const isRoot = path.length === 0;
    const isDragging = draggedPath?.join("-") === path.join("-");
    const isDropLeft = dropTarget?.path.join("-") === path.join("-") && dropTarget?.position === "left";
    const isDropRight = dropTarget?.path.join("-") === path.join("-") && dropTarget?.position === "right";
    const isDropChild = dropTarget?.path.join("-") === path.join("-") && dropTarget?.position === "child";

    return (
      <div key={path.join("-")} className="flex flex-col items-center relative">
        <div className="flex items-center">
          {/* 왼쪽 드롭 영역 */}
          {!isRoot && (
            <div
              onDragOver={(e) => handleDragOver(e, path, "left")}
              onDrop={handleDrop}
              className={`w-4 h-12 rounded-l transition-all ${
                isDropLeft ? "bg-blue-400 w-8" : "hover:bg-blue-200"
              }`}
            />
          )}

          {/* 노드 카드 */}
          <div
            draggable={!isRoot}
            onDragStart={(e) => handleDragStart(e, path)}
            onDragEnd={handleDragEnd}
            onClick={() => setSelectedPath(isSelected ? null : path)}
            className={`relative cursor-pointer transition-all duration-200 ${
              isDragging ? "opacity-50 scale-95" : ""
            } ${isSelected ? "scale-105 shadow-lg" : "hover:scale-102"}`}
          >
            <div
              onDragOver={(e) => handleDragOver(e, path, "child")}
              onDrop={handleDrop}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 ${colorClass} ${
                isSelected ? "ring-2 ring-blue-400 ring-offset-2" : ""
              } ${isDropChild ? "ring-2 ring-green-400 ring-offset-2" : ""}`}
            >
              <input
                type="text"
                value={node.name}
                onChange={(e) => updateNode(path, "name", e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onDragStart={(e) => e.stopPropagation()}
                draggable={false}
                className="bg-transparent text-center font-semibold w-28 outline-none cursor-text"
              />
            </div>

            {/* 선택된 노드의 액션 버튼들 */}
            {isSelected && !isDragging && (
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded-lg shadow-lg p-1 z-20">
                {!isRoot && (
                  <button
                    onClick={(e) => { e.stopPropagation(); addSiblingLeft(path); }}
                    className="w-8 h-8 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center justify-center"
                    title="왼쪽에 추가"
                  >
                    ←
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); addChild(path); }}
                  className="w-8 h-8 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 flex items-center justify-center"
                  title="하위 추가"
                >
                  ↓
                </button>
                {!isRoot && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); addSiblingRight(path); }}
                      className="w-8 h-8 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 flex items-center justify-center"
                      title="오른쪽에 추가"
                    >
                      →
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNode(path); setSelectedPath(null); }}
                      className="w-8 h-8 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center justify-center"
                      title="삭제"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* 오른쪽 드롭 영역 */}
          {!isRoot && (
            <div
              onDragOver={(e) => handleDragOver(e, path, "right")}
              onDrop={handleDrop}
              className={`w-4 h-12 rounded-r transition-all ${
                isDropRight ? "bg-blue-400 w-8" : "hover:bg-blue-200"
              }`}
            />
          )}
        </div>

        {/* 연결선 및 자식 노드 */}
        {node.child && node.child.length > 0 && (
          <>
            <div className="w-0.5 h-6 bg-gray-300 mt-2" />
            <div className={`flex ${node.level >= 2 ? "flex-col items-center" : "flex-row justify-center"} gap-6`}>
              {node.child.map((child, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  {node.level < 2 && <div className="w-0.5 h-4 bg-gray-300" />}
                  {renderNode(child, [...path, idx])}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) return <div className="flex justify-center items-center h-64">로딩 중...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">조직도 관리</h2>
        <button
          onClick={saveData}
          disabled={saving}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>

      <div className="flex justify-center py-8 overflow-auto min-h-[400px]">
        {renderNode(data)}
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600 space-y-1">
        <p>• 노드를 <strong>드래그</strong>하여 다른 위치로 이동할 수 있습니다</p>
        <p>• 노드를 클릭하면 편집 버튼이 나타납니다</p>
        <p>• ← → : 좌우에 같은 레벨 항목 추가 | ↓ : 하위 항목 추가 | × : 삭제</p>
      </div>
    </div>
  );
}
