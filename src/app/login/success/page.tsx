'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      router.replace('/login');
      return;
    }

    const verifyLogin = async () => {
      try {
        const res = await fetch(
          `https://ndie-be-985895714915.europe-west1.run.app/codeLogin`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', 
            body: JSON.stringify({ code }),
          }
        );

        const authHeader = res.headers.get('Authorization');
    const text = await res.text(); 
    let data;

    try { 
      data = JSON.parse(text); 
    } catch {
      data = null; 
    }

    if (!res.ok) {
      const errorMessage = data?.message || '로그인 실패';
      throw new Error(errorMessage);
    }

    if (authHeader) {
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader; //쿠키 로컬스토리지에 저장
      localStorage.setItem('token', token);
      setToken(token);
    } else if (data?.token) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
    }

    router.push('/');
  } catch (error) {
    alert(error.message || '로그인 중 오류 발생');
  }
}
verifyLogin()
});

  return <p>카카오 로그인 처리 중...</p>;
}
