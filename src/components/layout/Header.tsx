"use client";
import Link from "next/link";
import Image from "next/image";
import Logo from "@public/images/logo.svg";
import { useAuthStore } from "@/store/useAuthStore";

export const Header = () => {
  const { uid, role, isLoading, isInitialized } = useAuthStore();

  const handleLogout = async () => {
    try {
      const { signOut } = await import("firebase/auth");
      const { getFirebaseAuth } = await import("@/lib/firebase");
      const auth = await getFirebaseAuth();
      if (auth) await signOut(auth);
    } catch (e) {
      console.error("로그아웃 오류:", e);
    }
  };

  const isLoggedIn = !!uid;
  const isAdmin = role === "ADMIN";

  // 초기화 전에는 기본 헤더
  if (!isInitialized || isLoading) {
    return (
      <header className="h-[4.6875rem] sticky top-0 left-0 right-0 border-b-[#585858] border-b-[0.4px] pl-40 pr-40 flex justify-between items-center z-50 bg-white">
        <div className="flex gap-20 items-center">
          <div className="flex gap-4 items-center">
            <Image src={Logo} alt="Logo" width={40} height={40} className="object-contain -translate-y-1" />
            <p className="text-2xl">NDIE</p>
          </div>
          <Link href="/">홈</Link>
          <Link href="/act">활동</Link>
          <Link href="/qna">QnA</Link>
          <Link href="/announcement">공지사항</Link>
        </div>
        <div className="flex gap-11 items-center">
          <span className="text-gray-400">로딩중...</span>
        </div>
      </header>
    );
  }

  return (
    <header className="h-[4.6875rem] sticky top-0 left-0 right-0 border-b-[#585858] border-b-[0.4px] pl-40 pr-40 flex justify-between items-center z-50 bg-white">
      <div className="flex gap-15 items-center">
        <div className="flex gap-4 items-center">
          <Image src={Logo} alt="Logo" width={200} height={200} className="object-contain -translate-y-2" />
        </div>
        <Link href="/">홈</Link>
        <Link href="/act">활동</Link>
        <Link href="/qna">QnA</Link>
        <Link href="/announcement">공지사항</Link>
        {isLoggedIn && <Link href="/write">게시물 작성</Link>}
        {isAdmin && (
          <Link href="/admin" className="text-orange-500 font-semibold">
            관리자
          </Link>
        )}
      </div>
      <div className="flex gap-11 items-center">
        {isLoggedIn ? (
          <button onClick={handleLogout} className="text-black cursor-pointer">
            로그아웃
          </button>
        ) : (
          <>
            <Link href="/login">로그인</Link>
            <Link href="/signup">회원가입</Link>
          </>
        )}
      </div>
    </header>
  );
};
