"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type SiteConfig = {
  // 메인 배너
  banner: {
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    descriptionKo: string;
    descriptionEn: string;
    highlightColor: string;
  };
  // 협회 소개
  intro: {
    title: string;
    highlightWord: string;
    description: string;
  };
  // 테마 색상
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  // 푸터
  footer: {
    companyName: string;
    address: string;
    phone: string;
    email: string;
  };
};

const defaultConfig: SiteConfig = {
  banner: {
    titlePrefix: "우리는",
    titleHighlight: "포용",
    titleSuffix: "해야합니다",
    descriptionKo: "대한민국은 여러 불평등 문제로 점점 갈라져가고 있습니다.\n우리 모두가 서로가 다름을 인정하고 더욱 따뜻한 마음으로 서로를 보듬어줘야합니다.",
    descriptionEn: "South Korea is becoming increasingly divided due to various inequalities.\nWe all need to acknowledge each other's differences and embrace each other with warmer hearts.",
    highlightColor: "#FF961F",
  },
  intro: {
    title: "협회",
    highlightWord: "협회",
    description: "사단법인 디지털과포용성네트워크는\n모든 사회 구성원이 디지털 환경 속에서 소외되지 않고 함께 성장할 수 있는 포용적 디지털 사회를 지향합니다.",
  },
  theme: {
    primaryColor: "#FF961F",
    secondaryColor: "#ED9735",
    accentColor: "#FFA037",
  },
  footer: {
    companyName: "NDIE",
    address: "",
    phone: "",
    email: "",
  },
};

export default function SiteEditor() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<"banner" | "intro" | "theme" | "footer">("banner");

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const docRef = doc(db, "siteConfig", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setConfig({ ...defaultConfig, ...docSnap.data() } as SiteConfig);
      }
    } catch (e) {
      console.error("사이트 설정 로드 실패:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveConfig = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "siteConfig", "main"), config);
      alert("저장되었습니다!");
    } catch (e) {
      console.error("저장 실패:", e);
      alert("저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const updateConfig = <K extends keyof SiteConfig>(
    section: K,
    field: keyof SiteConfig[K],
    value: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (loading) return <div className="flex justify-center items-center h-64">로딩 중...</div>;

  const sections = [
    { id: "banner" as const, label: "메인 배너", icon: "🏠" },
    { id: "intro" as const, label: "협회 소개", icon: "📝" },
    { id: "theme" as const, label: "테마 색상", icon: "🎨" },
    { id: "footer" as const, label: "푸터 정보", icon: "📋" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">사이트 디자인 편집</h2>
        <button
          onClick={saveConfig}
          disabled={saving}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>

      {/* 섹션 탭 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              activeSection === section.id
                ? "bg-orange-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <span>{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* 편집 영역 */}
      <div className="space-y-6">
        {activeSection === "banner" && (
          <BannerEditor config={config} updateConfig={updateConfig} />
        )}
        {activeSection === "intro" && (
          <IntroEditor config={config} updateConfig={updateConfig} />
        )}
        {activeSection === "theme" && (
          <ThemeEditor config={config} updateConfig={updateConfig} />
        )}
        {activeSection === "footer" && (
          <FooterEditor config={config} updateConfig={updateConfig} />
        )}
      </div>
    </div>
  );
}


// 배너 편집기
function BannerEditor({
  config,
  updateConfig,
}: {
  config: SiteConfig;
  updateConfig: <K extends keyof SiteConfig>(section: K, field: keyof SiteConfig[K], value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-4">미리보기</h3>
        <div className="bg-white/80 p-6 rounded-xl text-center">
          <h1 className="text-2xl font-semibold flex items-end justify-center gap-2">
            <span>{config.banner.titlePrefix}</span>
            <span
              className="text-5xl font-extrabold"
              style={{ color: config.banner.highlightColor }}
            >
              {config.banner.titleHighlight}
            </span>
            <span>{config.banner.titleSuffix}</span>
          </h1>
          <p className="text-gray-700 mt-4 whitespace-pre-line text-sm">
            {config.banner.descriptionKo}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">제목 앞부분</label>
          <input
            type="text"
            value={config.banner.titlePrefix}
            onChange={(e) => updateConfig("banner", "titlePrefix", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">강조 단어</label>
          <input
            type="text"
            value={config.banner.titleHighlight}
            onChange={(e) => updateConfig("banner", "titleHighlight", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">제목 뒷부분</label>
          <input
            type="text"
            value={config.banner.titleSuffix}
            onChange={(e) => updateConfig("banner", "titleSuffix", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">강조 색상</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={config.banner.highlightColor}
            onChange={(e) => updateConfig("banner", "highlightColor", e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={config.banner.highlightColor}
            onChange={(e) => updateConfig("banner", "highlightColor", e.target.value)}
            className="px-3 py-2 border rounded-lg w-32"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">설명 (한국어)</label>
        <textarea
          value={config.banner.descriptionKo}
          onChange={(e) => updateConfig("banner", "descriptionKo", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">설명 (영어)</label>
        <textarea
          value={config.banner.descriptionEn}
          onChange={(e) => updateConfig("banner", "descriptionEn", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={3}
        />
      </div>
    </div>
  );
}


// 협회 소개 편집기
function IntroEditor({
  config,
  updateConfig,
}: {
  config: SiteConfig;
  updateConfig: <K extends keyof SiteConfig>(section: K, field: keyof SiteConfig[K], value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-4">미리보기</h3>
        <div className="bg-white p-6 rounded-xl">
          <p className="text-2xl font-extrabold mb-4">
            <span style={{ color: config.theme.primaryColor }}>{config.intro.highlightWord}</span> 소개
          </p>
          <p className="text-center font-semibold whitespace-pre-line">
            {config.intro.description}
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">강조 단어</label>
        <input
          type="text"
          value={config.intro.highlightWord}
          onChange={(e) => updateConfig("intro", "highlightWord", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">소개 내용</label>
        <textarea
          value={config.intro.description}
          onChange={(e) => updateConfig("intro", "description", e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={5}
        />
      </div>
    </div>
  );
}

// 테마 색상 편집기
function ThemeEditor({
  config,
  updateConfig,
}: {
  config: SiteConfig;
  updateConfig: <K extends keyof SiteConfig>(section: K, field: keyof SiteConfig[K], value: string) => void;
}) {
  const colors = [
    { key: "primaryColor" as const, label: "메인 색상", desc: "버튼, 강조 텍스트" },
    { key: "secondaryColor" as const, label: "보조 색상", desc: "호버 효과, 배경" },
    { key: "accentColor" as const, label: "포인트 색상", desc: "아이콘, 장식" },
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-4">색상 미리보기</h3>
        <div className="flex gap-4">
          {colors.map((color) => (
            <div key={color.key} className="flex-1 text-center">
              <div
                className="h-20 rounded-lg mb-2"
                style={{ backgroundColor: config.theme[color.key] }}
              />
              <p className="text-sm font-medium">{color.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {colors.map((color) => (
          <div key={color.key}>
            <label className="block text-sm font-medium mb-1">{color.label}</label>
            <p className="text-xs text-gray-500 mb-2">{color.desc}</p>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={config.theme[color.key]}
                onChange={(e) => updateConfig("theme", color.key, e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.theme[color.key]}
                onChange={(e) => updateConfig("theme", color.key, e.target.value)}
                className="px-3 py-2 border rounded-lg flex-1"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 프리셋 색상 */}
      <div>
        <h4 className="font-medium mb-2">빠른 테마 선택</h4>
        <div className="flex gap-2 flex-wrap">
          {[
            { name: "오렌지", primary: "#FF961F", secondary: "#ED9735", accent: "#FFA037" },
            { name: "블루", primary: "#3B82F6", secondary: "#2563EB", accent: "#60A5FA" },
            { name: "그린", primary: "#22C55E", secondary: "#16A34A", accent: "#4ADE80" },
            { name: "퍼플", primary: "#8B5CF6", secondary: "#7C3AED", accent: "#A78BFA" },
            { name: "핑크", primary: "#EC4899", secondary: "#DB2777", accent: "#F472B6" },
          ].map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                updateConfig("theme", "primaryColor", preset.primary);
                updateConfig("theme", "secondaryColor", preset.secondary);
                updateConfig("theme", "accentColor", preset.accent);
              }}
              className="px-3 py-2 rounded-lg border hover:shadow-md transition flex items-center gap-2"
            >
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


// 푸터 편집기
function FooterEditor({
  config,
  updateConfig,
}: {
  config: SiteConfig;
  updateConfig: <K extends keyof SiteConfig>(section: K, field: keyof SiteConfig[K], value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-800 text-white rounded-lg">
        <h3 className="font-semibold mb-4 text-gray-300">푸터 미리보기</h3>
        <div className="text-center">
          <p className="font-bold text-lg">{config.footer.companyName}</p>
          {config.footer.address && <p className="text-sm text-gray-400">{config.footer.address}</p>}
          <div className="flex justify-center gap-4 mt-2 text-sm text-gray-400">
            {config.footer.phone && <span>📞 {config.footer.phone}</span>}
            {config.footer.email && <span>✉️ {config.footer.email}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">회사/단체명</label>
          <input
            type="text"
            value={config.footer.companyName}
            onChange={(e) => updateConfig("footer", "companyName", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">이메일</label>
          <input
            type="email"
            value={config.footer.email}
            onChange={(e) => updateConfig("footer", "email", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">전화번호</label>
          <input
            type="tel"
            value={config.footer.phone}
            onChange={(e) => updateConfig("footer", "phone", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">주소</label>
          <input
            type="text"
            value={config.footer.address}
            onChange={(e) => updateConfig("footer", "address", e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
