'use client'
import React, { useState } from "react";

type Notice = {
  title: string;
  date: string;
  content: string;
};

const dummyNotices: Notice[] = [
  {
    title: "엔디엔디엔디엔디",
    date: "25.05.07",
    content: "엔디엔디엔디엔디엔디엔디엔디엔디엔디엔디엔디엔디엔디엔디엔디엔디엔디엔디엔디엔디",
  },
  {
    title: "두번째 공지입니다",
    date: "25.05.08",
    content: "두번째 공지 내용이 여기에 들어갑니다. 길어질 수도 있어요. 테스트 테스트 테스트",
  },
  {
    title: "세 번째 공지!",
    date: "25.05.09",
    content: "이건 세 번째 공지입니다. 간단하지만 중요한 내용을 담고 있습니다.",
  },
];

export default function NoticeContainer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentNotice = dummyNotices[currentIndex];

  const baseStyle = "w-[7.5rem] flex items-center justify-center text-gray-500";

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < dummyNotices.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="h-[11.25rem] w-full flex border-t border-b border-[#EAEAEA] bg-white">
      <button
        className={`${baseStyle} border-r border-[#EAEAEA] text-2xl disabled:text-gray-300`}
        onClick={handlePrev}
        disabled={currentIndex === 0}
      >
        ◀
      </button>
      <div className="flex-1 p-6 overflow-hidden">
        <p className="text-sm text-gray-400 mb-1">공지사항</p>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-black truncate max-w-[80%]">
            {currentNotice.title}
          </h3>
          <span className="text-xs text-gray-400">{currentNotice.date}</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {currentNotice.content}
        </p>
      </div>
      <button
        className={`${baseStyle} border-l border-[#EAEAEA] text-2xl disabled:text-gray-300`}
        onClick={handleNext}
        disabled={currentIndex === dummyNotices.length - 1}
      >
        ▶
      </button>
    </div>
  );
}