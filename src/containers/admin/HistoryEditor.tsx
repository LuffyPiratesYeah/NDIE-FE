"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

type TimelineEntry = {
  date: string;
  title: string;
  description: string;
  type: "filled" | "outlined";
};

type TimelineData = {
  [year: string]: TimelineEntry[];
};

const defaultData: TimelineData = {
  "2024": [
    { date: "03.12", title: "연혁1", description: "연혁1 내용", type: "filled" },
  ],
};

export default function HistoryEditor() {
  const [data, setData] = useState<TimelineData>(defaultData);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const docRef = doc(db, "history", "timeline");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data() as TimelineData);
        const years = Object.keys(docSnap.data());
        if (years.length > 0) setSelectedYear(years[0]);
      }
    } catch (e) {
      console.error("연혁 로드 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "history", "timeline"), data);
      alert("저장되었습니다!");
    } catch (e) {
      console.error("저장 실패:", e);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const addYear = () => {
    const newYear = prompt("추가할 연도를 입력하세요 (예: 2025)");
    if (newYear && !data[newYear]) {
      setData({ ...data, [newYear]: [] });
      setSelectedYear(newYear);
    }
  };

  const deleteYear = (year: string) => {
    if (!confirm(`${year}년 연혁을 삭제하시겠습니까?`)) return;
    const newData = { ...data };
    delete newData[year];
    setData(newData);
    const years = Object.keys(newData);
    if (years.length > 0) setSelectedYear(years[0]);
  };

  const addEntry = () => {
    const entries = data[selectedYear] || [];
    setData({
      ...data,
      [selectedYear]: [...entries, { date: "", title: "", description: "", type: "outlined" }],
    });
  };

  const updateEntry = (index: number, field: keyof TimelineEntry, value: string) => {
    const entries = [...(data[selectedYear] || [])];
    entries[index] = { ...entries[index], [field]: value };
    setData({ ...data, [selectedYear]: entries });
  };

  const deleteEntry = (index: number) => {
    const entries = [...(data[selectedYear] || [])];
    entries.splice(index, 1);
    setData({ ...data, [selectedYear]: entries });
  };

  if (loading) return <div>로딩 중...</div>;

  const years = Object.keys(data).sort();
  const entries = data[selectedYear] || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">연혁 관리</h2>
        <button
          onClick={saveData}
          disabled={saving}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>

      {/* 연도 선택 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {years.map((year) => (
          <div key={year} className="flex items-center">
            <button
              onClick={() => setSelectedYear(year)}
              className={`px-4 py-2 rounded-l-lg ${
                selectedYear === year ? "bg-orange-500 text-white" : "bg-gray-200"
              }`}
            >
              {year}
            </button>
            <button
              onClick={() => deleteYear(year)}
              className="px-2 py-2 bg-red-500 text-white rounded-r-lg hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ))}
        <button onClick={addYear} className="px-4 py-2 bg-green-500 text-white rounded-lg">
          + 연도 추가
        </button>
      </div>

      {/* 연혁 항목 */}
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50">
            <div className="flex gap-4 mb-2">
              <input
                type="text"
                placeholder="날짜 (예: 03.12)"
                value={entry.date}
                onChange={(e) => updateEntry(index, "date", e.target.value)}
                className="px-3 py-2 border rounded w-32"
              />
              <input
                type="text"
                placeholder="제목"
                value={entry.title}
                onChange={(e) => updateEntry(index, "title", e.target.value)}
                className="px-3 py-2 border rounded flex-1"
              />
              <select
                value={entry.type}
                onChange={(e) => updateEntry(index, "type", e.target.value)}
                className="px-3 py-2 border rounded"
              >
                <option value="filled">채움</option>
                <option value="outlined">테두리</option>
              </select>
              <button
                onClick={() => deleteEntry(index)}
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                삭제
              </button>
            </div>
            <textarea
              placeholder="설명"
              value={entry.description}
              onChange={(e) => updateEntry(index, "description", e.target.value)}
              className="w-full px-3 py-2 border rounded"
              rows={3}
            />
          </div>
        ))}
        <button
          onClick={addEntry}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-orange-500 hover:text-orange-500"
        >
          + 연혁 항목 추가
        </button>
      </div>
    </div>
  );
}
