"use client";
import Logo from "@public/images/logo.svg";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const API_BASE = process.env.API_BASE;

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '로그인 실패');
      }

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      alert('로그인 성공');
      router.push('/');
    } catch (error) {
      console.error('Login Error:', error);
      alert(error.message || '로그인 중 오류 발생');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center mt--80">
          <Image src={Logo} alt={"Logo"} width={90} height={90} />
        </div>

        <button className="relative flex cursor-pointer justify-center items-center w-full bg-[#FF0] text-black font-bold py-2 rounded">
          <img className="absolute left-3 w-[30px] h-[30px]" alt="Kakao Icon" src="/TALK.svg" />
          카카오톡으로 시작하기
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
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />

        <button
          onClick={handleLogin}
          className="cursor-pointer w-full bg-orange-400 text-white font-bold py-2 rounded mt-4"
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
