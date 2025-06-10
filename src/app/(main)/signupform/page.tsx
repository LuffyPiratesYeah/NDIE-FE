'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SignupForm() {
  // const [profileImage, setProfileImage] = useState<string | null>(null);
  const [year, setYear] = useState<number>(1999);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  // const NEXT_PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE;
  const NEXT_PUBLIC_API_BASE = "https://ndie-be-985895714915.europe-west1.run.app";

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [code, setCode] = useState('');
  // const [isEmailVerified, setIsEmailVerified] = useState(false);

  const router = useRouter();

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

  const handleSendVerificationEmail = async () => {
    try {
      
      const res = await fetch(`${NEXT_PUBLIC_API_BASE}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }); 
      
      if (!res.ok) throw new Error('인증 요청 실패');
      alert('인증 메일이 전송되었습니다.');
      setIsEmailSent(true);
    } catch (err) {
      alert(err);
    }
  };

  const handleSubmit = async () => {
    if (password !== repassword) return alert('비밀번호가 일치하지 않습니다.');

    try {
      const birthDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const res = await axios.post(`${NEXT_PUBLIC_API_BASE}/signup`, {
        name,
        email,
        code,
        password,
        rePassword: repassword,
        gender,
        birthDate,
        activityArea: location,
      });

      if(res.status !== 200) {
        alert('회원가입 성공!');
        router.push('/');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {

      }
      
      alert('회원가입 중 오류가 발생했습니다.');
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
            className="flex-1 border px-4 py-2 rounded-l"
            disabled={false}
          />
          <button
            onClick={handleSendVerificationEmail}
            disabled={isEmailSent || !email}
            className="hover-pointer bg-[#F28C28] text-white px-4 rounded-r"
          >
            {isEmailSent ? '전송됨' : '인증 요청'}
          </button>
        </div>

        {/*{isEmailSent && !isEmailVerified && (*/}
        {isEmailSent && (
          <div className="flex space-x-2 mt-2">
            <input
              type="text"
              placeholder="인증번호 입력"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 border px-4 py-2"
            />
          </div>
        )}

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
