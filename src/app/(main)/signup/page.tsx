"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function Signup() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const isProcessing = useRef(false);

  const next = () => {
    router.push("/signupagree");
  }

  const applyUserSession = async (user: any) => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      const token = await user.getIdToken();
      const { doc, getDoc, setDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      setToken(token);

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, {
          name: user.displayName || "Google 사용자",
          email: user.email || "",
          role: "USER",
          createdAt: new Date().toISOString(),
        });
      }

      router.replace("/");
    } catch (error) {
      console.error("세션 적용 중 오류:", error);
      isProcessing.current = false;
    }
  };

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { auth } = await import("@/lib/firebase");
        const { getRedirectResult } = await import("firebase/auth");

        // 이미 로그인되어 있으면 홈으로
        if (auth.currentUser) {
          await applyUserSession(auth.currentUser);
          return;
        }

        // Google redirect 로그인 처리
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult?.user) {
          await applyUserSession(redirectResult.user);
        }
      } catch (error: any) {
        console.error("인증 확인 중 오류:", error);
        if (error?.code === "auth/invalid-credential") {
          const { auth } = await import("@/lib/firebase");
          const { signOut } = await import("firebase/auth");
          await signOut(auth);
          alert("구글 인증 정보를 확인할 수 없습니다. 브라우저 쿠키/팝업 허용 후 다시 구글 로그인 버튼을 눌러주세요.");
        }
        isProcessing.current = false;
      }
    };
    checkAuthAndRedirect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { GoogleAuthProvider, signInWithRedirect, setPersistence, browserLocalPersistence } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");

      await setPersistence(auth, browserLocalPersistence);

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      await signInWithRedirect(auth, provider);
      // Redirect 이후 결과는 useEffect에서 처리
    } catch (error: any) {
      console.error(error);
      let message = error?.message || "구글 로그인 중 오류가 발생했습니다.";
      if (error?.code === "auth/configuration-not-found") {
        message = "Firebase Authentication 설정을 확인해주세요.";
      } else if (error?.code === "auth/popup-blocked") {
        message = "팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.";
      } else if (error?.code === "auth/popup-closed-by-user") {
        message = "로그인 팝업이 닫혔습니다. 다시 시도해주세요.";
      } else if (error?.code === "auth/account-exists-with-different-credential") {
        message = "이미 다른 방법으로 가입된 이메일입니다. 기존 로그인 방법을 사용해주세요.";
      } else if (error?.code === "auth/invalid-credential") {
        message = "구글 인증 정보를 확인할 수 없습니다. 브라우저 쿠키/팝업 허용 후 다시 시도하거나 다른 브라우저에서 시도해 주세요. 계속되면 캐시를 비우고 다시 시도하세요.";
      }
      alert(message);
    }
  };
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 space-y-6 px-4">
      <button
        onClick={handleGoogleLogin}
        className="cursor-pointer relative flex w-full max-w-[980px] py-[19px] px-0 justify-center items-center bg-white border border-gray-300 text-black rounded shadow-md hover:bg-gray-50"
      >
        <span className="absolute left-4 w-[36px] h-[36px] flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#4285F4] font-black text-lg">
          G
        </span>
        Google로 시작하기
      </button>
      <div className="flex items-center justify-center space-x-4 w-full max-w-[1300px]">
        <div className="w-[333px] h-[2px] bg-[#E2E1E1]" />
        <button onClick={()=>{
          window.location.href ="https://observant-agreement-17f.notion.site/20abd5ffe3fa805ca553d136e71891a3?source=copy_link"
        }} className="cursor-pointer text-[18px] font-normal text-[#335CFF] font-['Inter'] whitespace-nowrap">
          회원가입하는 방법 3초만에 알아보기
        </button>
        <div className="w-[333px] h-[2px] bg-[#E2E1E1]" />
      </div>

      <button onClick={next} className="hover:bg-[#ededed] cursor-pointer  relative flex w-full max-w-[980px] py-[19px] px-0 justify-center items-center bg-white text-black rounded shadow-md">
        ID/PW 회원가입
      </button>
      
    </div>
  );
}
