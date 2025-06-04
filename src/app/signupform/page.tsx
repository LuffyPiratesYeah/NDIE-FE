'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SignupForm() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const router = useRouter();
  
  const [year, setYear] = useState<number>(1999);
  const [month, setMonth] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let y = currentYear; y >= 1920; y--) {
      years.push(y);
    }
    return years;
  };

  const generateMonths = () => Array.from({ length: 12 }, (_, i) => i + 1);

  const updateDaysInMonth = (year: number, month: number) => {
    const lastDay = new Date(year, month, 0).getDate();
    const days = Array.from({ length: lastDay }, (_, i) => i + 1);
    setDaysInMonth(days);
  };

  useEffect(() => {
    updateDaysInMonth(year, month);
  }, [year, month]);

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <div className="flex justify-center mb-6 relative">
        <label className="cursor-pointer">
          <img
            src={profileImage || '/default-profile.png'}
            alt=""
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-[35%] bg-white rounded-full p-1 shadow">
            <img src="/fix.svg" alt="수정 아이콘" className="w-5 h-5" />
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      </div>

      <div className="space-y-4">
        <input type="email" placeholder="이메일" className="w-full border px-4 py-2" />
        <input type="password" placeholder="비밀번호" className="w-full border px-4 py-2" />
        <input type="password" placeholder="비밀번호 확인" className="w-full border px-4 py-2" />
        <input type="text" placeholder="이름을 입력해주세요" className="w-full border px-4 py-2" />

        <div>
          <div className="font-medium mb-1">성별</div>
          <label className="mr-4">
            <input type="radio" name="gender" className="mr-1" /> 남성
          </label>
          <label>
            <input type="radio" name="gender" className="mr-1" /> 여성
          </label>
        </div>

        <div>
          <div className="font-medium mb-1">생년월일</div>
          <div className="flex space-x-2">
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border px-2 py-1"
            >
              {generateYears().map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border px-2 py-1"
            >
              {generateMonths().map((m) => (
                <option key={m} value={m}>
                  {m}월
                </option>
              ))}
            </select>
            <select
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              className="border px-2 py-1"
            >
              {daysInMonth.map((d) => (
                <option key={d} value={d}>
                  {d}일
                </option>
              ))}
            </select>
          </div>
        </div>

        <input type="text" placeholder="활동지역을 입력해주세요" className="w-full border px-4 py-2" />

        <button onClick={() => router.push('/')} className="w-full bg-[#F28C28] text-white py-3 rounded mt-6">가입하기</button>
      </div>
    </div>
  );
}
