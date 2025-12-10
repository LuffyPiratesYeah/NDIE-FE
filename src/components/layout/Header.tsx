"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "@public/images/logo.svg";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";

export const Header = () => {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const setToken = useAuthStore((state) => state.setToken);
  const [hydrated, setHydrated] = useState(false);
  const [localToken, setLocalToken] = useState<string | null>(null);
  const [localRole, setLocalRole] = useState<string | null>(null);

  useEffect(() => {
    // zustand hydration 완료 대기
    setHydrated(true);

    // localStorage에서 직접 토큰 읽기 (hydration 전에도 작동)
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    setLocalToken(storedToken);
    setLocalRole(storedRole);
    console.log("[Header] 초기화 - localStorage 토큰:", storedToken ? "있음" : "없음");
    console.log("[Header] 초기화 - zustand 토큰:", token ? "있음" : "없음");
  }, []);

  // zustand 토큰/role 변경 감지
  useEffect(() => {
    if (hydrated) {
      console.log("[Header] zustand 토큰 변경:", token ? "있음" : "없음");
      setLocalToken(token);
      setLocalRole(role);
    }
  }, [token, role, hydrated]);

  const handleLogout = async () => {
    console.log("[Header] 로그아웃 시작");
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
    }
    setToken(null);
    setLocalToken(null);
    try {
      const { signOut } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");
      await signOut(auth);
      console.log("[Header] 로그아웃 완료");
    } catch (e) {
      console.error("[Header 오류] 로그아웃 중 오류:", e);
    }
  };

  if (!hydrated) {
    console.log("[Header] hydration 대기 중");
    return null;
  }

  // zustand와 localStorage 둘 중 하나라도 토큰이 있으면 로그인 상태
  const isLoggedIn = !!(token || localToken);
  const isAdmin = (role || localRole) === "ADMIN";
  console.log("[Header] 렌더링 - 로그인 상태:", isLoggedIn, "관리자:", isAdmin);

  return (
    <header className="h-[4.6875rem] sticky top-0 left-0 right-0 border-b-[#585858] border-b-[0.4px] pl-40 pr-40 flex justify-between items-center z-50 bg-white">
      <div className="flex gap-20 items-center">
        <div className="flex gap-4 items-center">
          <Image src={Logo} alt={"Logo"} />
          <p className="text-2xl">NDIE</p>
        </div>
        <Link href="/">홈</Link>
        <Link href="/act">활동</Link>
        <Link href="/qna">QnA</Link>
        <Link href="/announcement">공지사항</Link>
        {isLoggedIn && <Link href="/write">게시물 작성</Link>}
        {isAdmin && <Link href="/admin" className="text-orange-500 font-semibold">관리자</Link>}
      </div>
      <div className="flex gap-11 items-center">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-black">로그아웃</button>
        ) : (
          <>
            <Link href="/login">로그인</Link>
            <Link href="/signup">회원가입</Link>
          </>
        )}
      </div>
    </header>
  )
}