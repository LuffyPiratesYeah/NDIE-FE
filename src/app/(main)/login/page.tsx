"use client";
import Logo from "@public/images/logo.svg";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const isProcessing = useRef(false);

  const applyUserSession = async (user: any) => {
    if (isProcessing.current) {
      console.log("[로그인] 이미 처리 중");
      return;
    }
    isProcessing.current = true;

    try {
      console.log("[로그인] 사용자 세션 적용 시작:", user.email);
      const token = await user.getIdToken();
      console.log("[로그인] JWT 토큰 발급 완료");

      const { doc, getDoc, setDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      // localStorage에 저장
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        console.log("[로그인] localStorage에 토큰 저장 완료");
      }

      // zustand에 저장 (임시 토큰 저장)
      setToken(token);

      let userRole: 'ADMIN' | 'USER' = 'USER';

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          console.log("[로그인] 새 사용자 - Firestore에 데이터 생성");
          // 이메일이 특정 관리자 이메일이면 ADMIN 부여 (예시)
          const isAdmin = user.email === "heodongun08@gmail.com";
          userRole = isAdmin ? 'ADMIN' : 'USER';

          await setDoc(userRef, {
            name: user.displayName || "Google 사용자",
            email: user.email || "",
            role: userRole,
            createdAt: new Date().toISOString(),
          });
        } else {
          console.log("[로그인] 기존 사용자 - Firestore 데이터 확인");
          const data = snap.data();
          userRole = data.role || 'USER';
        }
      } catch (dbError) {
        console.error("[로그인 경고] Firestore 사용자 정보 저장/확인 실패 (기본값 USER 사용):", dbError);
      }

      // 최종적으로 토큰과 역할을 함께 저장
      useAuthStore.getState().setUser(token, userRole);

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("role", userRole); // role도 로컬스토리지에 백업
      }

      console.log(`[로그인] 로그인 완료. 등급: ${userRole}. 홈페이지로 이동합니다.`);

      // 약간의 지연 후 이동 (상태 업데이트 반영 보장)
      setTimeout(() => {
        window.location.href = "/";
      }, 100);

    } catch (error) {
      console.error("[로그인 오류] 세션 적용 중 오류:", error);
      isProcessing.current = false;
    }
  };

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    if (isProcessing.current) return;

    const checkAuth = async () => {
      try {
        const { auth } = await import("@/lib/firebase");
        const { onAuthStateChanged } = await import("firebase/auth");

        // 인증 상태 변경 감지
        unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            console.log("[로그인 페이지] Firebase 인증 상태 감지:", user.email);
            // 이미 처리 중이 아니고 유저가 있으면 세션 적용
            if (!isProcessing.current) {
              await applyUserSession(user);
            }
          } else {
            console.log("[로그인 페이지] 현재 로그인된 사용자 없음");
          }
        });
      } catch (error) {
        console.error("[로그인 페이지] 인증 초기화 오류:", error);
      }
    };

    checkAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleLogin = async () => {
    try {
      if (isProcessing.current) return;
      console.log("[구글 로그인] 로그인 프로세스 시작 (Popup)");
      const { GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");

      await setPersistence(auth, browserLocalPersistence);
      console.log("[구글 로그인] Firebase persistence 설정 완료");

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      console.log("[구글 로그인] Google Popup 실행");
      const result = await signInWithPopup(auth, provider);

      console.log("[구글 로그인] Popup 로그인 성공 (onAuthStateChanged에서 처리됨):", result.user.email);
      // applyUserSession은 onAuthStateChanged에서 호출되므로 여기서 호출하지 않음

    } catch (error: any) {
      console.error("[구글 로그인 오류]", error);
      let message = error?.message || "구글 로그인 중 오류가 발생했습니다.";
      if (error?.code === "auth/configuration-not-found") {
        message = "Firebase Authentication 설정을 확인해주세요.";
      } else if (error?.code === "auth/popup-blocked") {
        message = "팝업이 차단되었습니다. 팝업 허용 후 다시 시도해주세요.";
      } else if (error?.code === "auth/popup-closed-by-user") {
        message = "로그인 팝업이 닫혔습니다. 다시 시도해주세요.";
      } else if (error?.code === "auth/account-exists-with-different-credential") {
        message = "이미 다른 방법으로 가입된 이메일입니다. 기존 로그인 방법을 사용해주세요.";
      } else if (error?.code === "auth/cancelled-popup-request") {
        message = "요청이 취소되었습니다. 다시 시도해주세요.";
      }
      alert(message);
      isProcessing.current = false;
    }
  };
  const handleLogin = async () => {
    if (isProcessing.current) return;

    try {
      console.log("[이메일 로그인] 로그인 시도:", email);
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const { auth } = await import("@/lib/firebase");

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("[이메일 로그인] 로그인 성공:", userCredential.user.email);
      await applyUserSession(userCredential.user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("[이메일 로그인 오류]", error);
      let message = error?.message || '로그인 중 오류 발생';
      if (error?.code === 'auth/configuration-not-found') {
        message = '이메일/비밀번호 로그인이 아직 설정되지 않았습니다. Firebase Authentication 설정을 확인해주세요.';
      } else if (error?.code === 'auth/invalid-credential' || error?.code === 'auth/wrong-password' || error?.code === 'auth/user-not-found') {
        message = '이메일 또는 비밀번호를 다시 확인해주세요.';
      }
      alert(message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center mt--80">
          <Image src={Logo} alt={"Logo"} width={90} height={90} />
        </div>

        <button
          className="relative flex cursor-pointer justify-center items-center w-full bg-white border border-gray-300 text-black font-bold py-2 rounded shadow-sm hover:bg-gray-50"
          onClick={handleGoogleLogin}
        >
          <span className="absolute left-3 w-[30px] h-[30px] flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#4285F4] font-black text-lg">G</span>
          Google로 시작하기
        </button>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-gray-500 text-sm">또는</span>
          <div className="flex-grow border-t border-gray-300" />
        </div>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-2"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        <button
          onClick={handleLogin}
          className="hover:bg-[#f78000] cursor-pointer w-full bg-orange-400 text-white font-bold py-2 rounded mt-4"
        >
          로그인
        </button>

        <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
          <label className="flex items-center">
            <input type="checkbox" className="cursor-pointer mr-2" />
            로그인 상태 유지
          </label>
          <div className="space-x-3">
            <button className="hover:underline cursor-pointer">비밀번호 재설정</button>
            <button onClick={() => router.push('/signup')} className="hover:underline cursor-pointer">
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
