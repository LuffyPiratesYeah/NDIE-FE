"use client";
import React, { useEffect, useState } from "react";
import { getFirebaseDb } from "@/lib/firebase";

export type SiteConfig = {
  // 메인 배너
  banner: {
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    descriptionKo: string;
    descriptionEn: string;
    highlightColor: string;
    backgroundOpacity: number;
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
    backgroundColor: string;
    textColor: string;
  };
  // 푸터
  footer: {
    companyName: string;
    address: string;
    phone: string;
    email: string;
    copyright: string;
  };
  // 헤더
  header: {
    logoText: string;
    showLogo: boolean;
    menuItems: { label: string; href: string; visible: boolean }[];
  };
  // SNS 링크
  social: {
    instagram: string;
    facebook: string;
    youtube: string;
    twitter: string;
    blog: string;
  };
  // SEO 설정
  seo: {
    siteTitle: string;
    siteDescription: string;
    keywords: string;
    ogImage: string;
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
    backgroundOpacity: 50,
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
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
  },
  footer: {
    companyName: "NDIE",
    address: "",
    phone: "",
    email: "",
    copyright: "© 2024 NDIE. All rights reserved.",
  },
  header: {
    logoText: "NDIE",
    showLogo: true,
    menuItems: [
      { label: "홈", href: "/", visible: true },
      { label: "활동", href: "/act", visible: true },
      { label: "QnA", href: "/qna", visible: true },
      { label: "공지사항", href: "/announcement", visible: true },
    ],
  },
  social: {
    instagram: "",
    facebook: "",
    youtube: "",
    twitter: "",
    blog: "",
  },
  seo: {
    siteTitle: "NDIE - 디지털과포용성네트워크",
    siteDescription: "사단법인 디지털과포용성네트워크(NDIE)는 디지털 전환 속 소외된 이들을 위한 포용적 디지털 사회 구현을 목표로 합니다.",
    keywords: "디지털 포용, 디지털 리터러시, 사단법인, NDIE",
    ogImage: "",
  },
};

type SectionType = "banner" | "intro" | "theme" | "footer" | "header" | "social" | "seo";

export default function SiteEditor() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>("banner");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const db = await getFirebaseDb();
      if (!db) return;

      const { doc, getDoc } = await import("firebase/firestore");
      const docRef = doc(db, "siteConfig", "main");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setConfig({
          ...defaultConfig,
          ...data,
          banner: { ...defaultConfig.banner, ...data.banner },
          intro: { ...defaultConfig.intro, ...data.intro },
          theme: { ...defaultConfig.theme, ...data.theme },
          footer: { ...defaultConfig.footer, ...data.footer },
          header: { ...defaultConfig.header, ...data.header },
          social: { ...defaultConfig.social, ...data.social },
          seo: { ...defaultConfig.seo, ...data.seo },
        });
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
      const db = await getFirebaseDb();
      if (!db) return;

      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(doc(db, "siteConfig", "main"), config);
      alert("저장되었습니다!");
      setHasChanges(false);
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
    value: unknown
  ) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const resetToDefault = () => {
    if (confirm("모든 설정을 기본값으로 초기화하시겠습니까?")) {
      setConfig(defaultConfig);
      setHasChanges(true);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64">로딩 중...</div>;

  const sections = [
    { id: "banner" as const, label: "메인 배너", icon: "🏠" },
    { id: "intro" as const, label: "협회 소개", icon: "📝" },
    { id: "header" as const, label: "헤더/메뉴", icon: "📌" },
    { id: "theme" as const, label: "테마 색상", icon: "🎨" },
    { id: "footer" as const, label: "푸터 정보", icon: "📋" },
    { id: "social" as const, label: "SNS 링크", icon: "🔗" },
    { id: "seo" as const, label: "SEO 설정", icon: "🔍" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">사이트 디자인 편집</h2>
          {hasChanges && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              저장되지 않은 변경사항
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetToDefault}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            초기화
          </button>
          <button
            onClick={saveConfig}
            disabled={saving || !hasChanges}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
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
        {activeSection === "banner" && <BannerEditor config={config} updateConfig={updateConfig} />}
        {activeSection === "intro" && <IntroEditor config={config} updateConfig={updateConfig} />}
        {activeSection === "header" && <HeaderEditor config={config} updateConfig={updateConfig} setConfig={setConfig} setHasChanges={setHasChanges} />}
        {activeSection === "theme" && <ThemeEditor config={config} updateConfig={updateConfig} />}
        {activeSection === "footer" && <FooterEditor config={config} updateConfig={updateConfig} />}
        {activeSection === "social" && <SocialEditor config={config} updateConfig={updateConfig} />}
        {activeSection === "seo" && <SEOEditor config={config} updateConfig={updateConfig} />}
      </div>
    </div>
  );
}

// ===== 하위 에디터 컴포넌트들 =====

type EditorProps = {
  config: SiteConfig;
  updateConfig: <K extends keyof SiteConfig>(
    section: K,
    field: keyof SiteConfig[K],
    value: unknown
  ) => void;
};

type HeaderEditorProps = EditorProps & {
  setConfig: React.Dispatch<React.SetStateAction<SiteConfig>>;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
};

// 배너 에디터
function BannerEditor({ config, updateConfig }: EditorProps) {
  return (
    <div className="bg-white p-6 rounded-xl border space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">메인 배너 설정</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">타이틀 앞부분</label>
          <input
            type="text"
            value={config.banner.titlePrefix}
            onChange={(e) => updateConfig("banner", "titlePrefix", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">강조 텍스트</label>
          <input
            type="text"
            value={config.banner.titleHighlight}
            onChange={(e) => updateConfig("banner", "titleHighlight", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">타이틀 뒷부분</label>
          <input
            type="text"
            value={config.banner.titleSuffix}
            onChange={(e) => updateConfig("banner", "titleSuffix", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">설명 (한국어)</label>
        <textarea
          value={config.banner.descriptionKo}
          onChange={(e) => updateConfig("banner", "descriptionKo", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 h-24"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">설명 (영어)</label>
        <textarea
          value={config.banner.descriptionEn}
          onChange={(e) => updateConfig("banner", "descriptionEn", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 h-24"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">강조 색상</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={config.banner.highlightColor}
              onChange={(e) => updateConfig("banner", "highlightColor", e.target.value)}
              className="w-12 h-10 border rounded cursor-pointer"
            />
            <input
              type="text"
              value={config.banner.highlightColor}
              onChange={(e) => updateConfig("banner", "highlightColor", e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            배경 투명도: {config.banner.backgroundOpacity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={config.banner.backgroundOpacity}
            onChange={(e) => updateConfig("banner", "backgroundOpacity", Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* 미리보기 */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-500 mb-2">미리보기:</p>
        <p className="text-2xl font-bold">
          {config.banner.titlePrefix}
          <span style={{ color: config.banner.highlightColor }}>{config.banner.titleHighlight}</span>
          {config.banner.titleSuffix}
        </p>
      </div>
    </div>
  );
}

// 협회 소개 에디터
function IntroEditor({ config, updateConfig }: EditorProps) {
  return (
    <div className="bg-white p-6 rounded-xl border space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">협회 소개 설정</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">섹션 제목</label>
          <input
            type="text"
            value={config.intro.title}
            onChange={(e) => updateConfig("intro", "title", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">강조 단어</label>
          <input
            type="text"
            value={config.intro.highlightWord}
            onChange={(e) => updateConfig("intro", "highlightWord", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">소개 내용</label>
        <textarea
          value={config.intro.description}
          onChange={(e) => updateConfig("intro", "description", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 h-32"
        />
      </div>
    </div>
  );
}

// 헤더/메뉴 에디터
function HeaderEditor({ config, updateConfig, setConfig, setHasChanges }: HeaderEditorProps) {
  const addMenuItem = () => {
    setConfig((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        menuItems: [...prev.header.menuItems, { label: "새 메뉴", href: "/", visible: true }],
      },
    }));
    setHasChanges(true);
  };

  const updateMenuItem = (index: number, field: string, value: string | boolean) => {
    setConfig((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        menuItems: prev.header.menuItems.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ),
      },
    }));
    setHasChanges(true);
  };

  const removeMenuItem = (index: number) => {
    setConfig((prev) => ({
      ...prev,
      header: {
        ...prev.header,
        menuItems: prev.header.menuItems.filter((_, i) => i !== index),
      },
    }));
    setHasChanges(true);
  };

  return (
    <div className="bg-white p-6 rounded-xl border space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">헤더/메뉴 설정</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">로고 텍스트</label>
          <input
            type="text"
            value={config.header.logoText}
            onChange={(e) => updateConfig("header", "logoText", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showLogo"
            checked={config.header.showLogo}
            onChange={(e) => updateConfig("header", "showLogo", e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="showLogo" className="text-sm font-medium">로고 이미지 표시</label>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">메뉴 항목</label>
          <button
            onClick={addMenuItem}
            className="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600"
          >
            + 메뉴 추가
          </button>
        </div>
        <div className="space-y-2">
          {config.header.menuItems.map((item, index) => (
            <div key={index} className="flex gap-2 items-center bg-gray-50 p-2 rounded-lg">
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateMenuItem(index, "label", e.target.value)}
                placeholder="메뉴명"
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
              <input
                type="text"
                value={item.href}
                onChange={(e) => updateMenuItem(index, "href", e.target.value)}
                placeholder="링크"
                className="flex-1 border rounded px-2 py-1 text-sm"
              />
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="checkbox"
                  checked={item.visible}
                  onChange={(e) => updateMenuItem(index, "visible", e.target.checked)}
                />
                표시
              </label>
              <button
                onClick={() => removeMenuItem(index)}
                className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 테마 색상 에디터
function ThemeEditor({ config, updateConfig }: EditorProps) {
  const colorFields = [
    { key: "primaryColor" as const, label: "주요 색상" },
    { key: "secondaryColor" as const, label: "보조 색상" },
    { key: "accentColor" as const, label: "강조 색상" },
    { key: "backgroundColor" as const, label: "배경 색상" },
    { key: "textColor" as const, label: "텍스트 색상" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">테마 색상 설정</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {colorFields.map(({ key, label }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.theme[key]}
                onChange={(e) => updateConfig("theme", key, e.target.value)}
                className="w-12 h-10 border rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.theme[key]}
                onChange={(e) => updateConfig("theme", key, e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 색상 미리보기 */}
      <div className="mt-4 p-4 rounded-lg" style={{ backgroundColor: config.theme.backgroundColor }}>
        <p className="text-sm mb-2" style={{ color: config.theme.textColor }}>색상 미리보기:</p>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded" style={{ backgroundColor: config.theme.primaryColor, color: "#fff" }}>Primary</span>
          <span className="px-3 py-1 rounded" style={{ backgroundColor: config.theme.secondaryColor, color: "#fff" }}>Secondary</span>
          <span className="px-3 py-1 rounded" style={{ backgroundColor: config.theme.accentColor, color: "#fff" }}>Accent</span>
        </div>
      </div>
    </div>
  );
}

// 푸터 에디터
function FooterEditor({ config, updateConfig }: EditorProps) {
  return (
    <div className="bg-white p-6 rounded-xl border space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">푸터 정보 설정</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">회사/단체명</label>
          <input
            type="text"
            value={config.footer.companyName}
            onChange={(e) => updateConfig("footer", "companyName", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">이메일</label>
          <input
            type="email"
            value={config.footer.email}
            onChange={(e) => updateConfig("footer", "email", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">전화번호</label>
          <input
            type="tel"
            value={config.footer.phone}
            onChange={(e) => updateConfig("footer", "phone", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">저작권 문구</label>
          <input
            type="text"
            value={config.footer.copyright}
            onChange={(e) => updateConfig("footer", "copyright", e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">주소</label>
        <input
          type="text"
          value={config.footer.address}
          onChange={(e) => updateConfig("footer", "address", e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>
    </div>
  );
}

// SNS 링크 에디터
function SocialEditor({ config, updateConfig }: EditorProps) {
  const socialFields = [
    { key: "instagram" as const, label: "Instagram", icon: "📷", placeholder: "https://instagram.com/..." },
    { key: "facebook" as const, label: "Facebook", icon: "📘", placeholder: "https://facebook.com/..." },
    { key: "youtube" as const, label: "YouTube", icon: "📺", placeholder: "https://youtube.com/..." },
    { key: "twitter" as const, label: "Twitter/X", icon: "🐦", placeholder: "https://twitter.com/..." },
    { key: "blog" as const, label: "블로그", icon: "📝", placeholder: "https://blog.naver.com/..." },
  ];

  return (
    <div className="bg-white p-6 rounded-xl border space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">SNS 링크 설정</h3>
      
      <div className="space-y-3">
        {socialFields.map(({ key, label, icon, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1">
              {icon} {label}
            </label>
            <input
              type="url"
              value={config.social[key]}
              onChange={(e) => updateConfig("social", key, e.target.value)}
              placeholder={placeholder}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// SEO 설정 에디터
function SEOEditor({ config, updateConfig }: EditorProps) {
  return (
    <div className="bg-white p-6 rounded-xl border space-y-4">
      <h3 className="font-semibold text-lg border-b pb-2">SEO 설정</h3>
      
      <div>
        <label className="block text-sm font-medium mb-1">사이트 제목</label>
        <input
          type="text"
          value={config.seo.siteTitle}
          onChange={(e) => updateConfig("seo", "siteTitle", e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">브라우저 탭에 표시되는 제목입니다.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">사이트 설명</label>
        <textarea
          value={config.seo.siteDescription}
          onChange={(e) => updateConfig("seo", "siteDescription", e.target.value)}
          className="w-full border rounded-lg px-3 py-2 h-24"
        />
        <p className="text-xs text-gray-500 mt-1">검색 결과에 표시되는 설명입니다. (150자 이내 권장)</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">키워드</label>
        <input
          type="text"
          value={config.seo.keywords}
          onChange={(e) => updateConfig("seo", "keywords", e.target.value)}
          placeholder="키워드1, 키워드2, 키워드3"
          className="w-full border rounded-lg px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">쉼표로 구분하여 입력하세요.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">OG 이미지 URL</label>
        <input
          type="url"
          value={config.seo.ogImage}
          onChange={(e) => updateConfig("seo", "ogImage", e.target.value)}
          placeholder="https://example.com/og-image.jpg"
          className="w-full border rounded-lg px-3 py-2"
        />
        <p className="text-xs text-gray-500 mt-1">SNS 공유 시 표시되는 이미지입니다. (1200x630px 권장)</p>
      </div>

      {/* SEO 미리보기 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-500 mb-2">검색 결과 미리보기:</p>
        <div className="bg-white p-3 rounded border">
          <p className="text-blue-600 text-lg hover:underline cursor-pointer">{config.seo.siteTitle || "사이트 제목"}</p>
          <p className="text-green-700 text-sm">https://yoursite.com</p>
          <p className="text-gray-600 text-sm">{config.seo.siteDescription || "사이트 설명이 여기에 표시됩니다."}</p>
        </div>
      </div>
    </div>
  );
}
