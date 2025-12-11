"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import HistoryEditor from "@/containers/admin/HistoryEditor";
import OrgChartEditor from "@/containers/admin/OrgChartEditor";
import SiteEditor from "@/containers/admin/SiteEditor";

export default function AdminPage() {
  const router = useRouter();
  const { uid, role, isLoading, isInitialized } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"site" | "history" | "org">("site");

  useEffect(() => {
    // 초기화 완료 후 권한 체크
    if (isInitialized && !isLoading) {
      if (!uid || role !== "ADMIN") {
        alert("관리자 권한이 필요합니다.");
        router.replace("/");
      }
    }
  }, [isInitialized, isLoading, uid, role, router]);

  // 로딩 중
  if (!isInitialized || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4" />
          <p>권한 확인 중...</p>
        </div>
      </div>
    );
  }

  // 권한 없음
  if (!uid || role !== "ADMIN") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>접근 권한이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">관리자 페이지</h1>

        {/* 탭 메뉴 */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("site")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "site"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            🎨 사이트 디자인
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "history"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            📅 연혁 관리
          </button>
          <button
            onClick={() => setActiveTab("org")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "org"
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            🏢 조직도 관리
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === "site" && <SiteEditor />}
          {activeTab === "history" && <HistoryEditor />}
          {activeTab === "org" && <OrgChartEditor />}
        </div>
      </div>
    </div>
  );
}
