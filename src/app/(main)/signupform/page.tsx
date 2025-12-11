'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuthStore } from "@/store/useAuthStore";

export default function SignupForm() {
  // const [profileImage, setProfileImage] = useState<string | null>(null);
  const [year, setYear] = useState<number>(1999);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');

  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     setProfileImage(URL.createObjectURL(file));
  //   }
  // };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1919 }, (_, i) => currentYear - i);
  };

  const generateMonths = () => Array.from({ length: 12 }, (_, i) => i + 1);

  const updateDaysInMonth = (year: number, month: number) => {
    const lastDay = new Date(year, month, 0).getDate();
    setDaysInMonth(Array.from({ length: lastDay }, (_, i) => i + 1));
  };

  useEffect(() => {
    updateDaysInMonth(year, month);
  }, [year, month]);

  const handleSubmit = async () => {
    if (password !== repassword) return alert('비밀번호가 일치하지 않습니다.');

    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
      const { doc, setDoc } = await import("firebase/firestore");
      const { auth, db } = await import("@/lib/firebase");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name
      });

      const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        gender,
        birthDate,
        activityArea: location,
        role: "USER",
        createdAt: new Date().toISOString()
      });

      // 회원가입 후 자동 로그인 처리
      const token = await user.getIdToken();
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      setToken(token);

      alert('회원가입 성공!');
      router.replace('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      let message = err?.message || '회원가입 중 오류가 발생했습니다.';
      if (err?.code === 'auth/configuration-not-found') {
        message = '이메일/비밀번호 회원가입이 아직 설정되지 않았습니다. Firebase Authentication 설정을 확인해주세요.';
      } else if (err?.code === 'auth/email-already-in-use') {
        message = '이미 가입된 이메일입니다. 로그인 화면으로 이동합니다.';
        alert(message);
        router.push('/login');
        return;
      } else if (err?.code === 'auth/weak-password') {
        message = '비밀번호가 너무 약합니다. 6자 이상으로 설정해주세요.';
      }
      alert(message);
    }
  };
  return (

    <div className="max-w-md mx-auto py-10 px-4">


      <div className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="이름을 입력해주세요" className="w-full border px-4 py-2" />

        <div className="flex">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-4 py-2"
            disabled={false}
          />
        </div>

        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="비밀번호" className="w-full border px-4 py-2" />
        <input value={repassword} onChange={(e) => setRePassword(e.target.value)} type="password" placeholder="비밀번호 확인" className="w-full border px-4 py-2" />

        <div>
          <div className="font-medium mb-1">성별</div>
          <label className="mr-4">
            <input type="radio" name="gender" className="mr-1" value="남성" onChange={(e) => setGender(e.target.value)} /> 남성
          </label>
          <label>
            <input type="radio" name="gender" className="mr-1" value="여성" onChange={(e) => setGender(e.target.value)} /> 여성
          </label>
        </div>

        <div>
          <div className="font-medium mb-1">생년월일</div>
          <div className="flex space-x-2">
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="border px-2 py-1">
              {generateYears().map((y) => (
                <option key={y} value={y}>{y}년</option>
              ))}
            </select>
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="border px-2 py-1">
              {generateMonths().map((m) => (
                <option key={m} value={m}>{m}월</option>
              ))}
            </select>
            <select value={day} onChange={(e) => setDay(Number(e.target.value))} className="border px-2 py-1">
              {daysInMonth.map((d) => (
                <option key={d} value={d}>{d}일</option>
              ))}
            </select>
          </div>
        </div>

        <input value={location} onChange={(e) => setLocation(e.target.value)} type="text" placeholder="활동지역을 입력해주세요" className="w-full border px-4 py-2" />

        <button
          onClick={handleSubmit}
          className="hover:bg-[#f78000] cursor-pointer w-full bg-[#F28C28] text-white py-3 rounded mt-6"
        >
          가입하기
        </button>
      </div>
    </div>
  );
}
