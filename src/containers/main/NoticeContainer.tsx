'use client'

import React, { useEffect, useState } from "react";
import { getAnnouncement } from "@/service/announcement";

type Notice = {
  title: string;
  createdAt: string;
  content: string;
};

export default function NoticeContainer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notices, setNotices] = useState<Notice[]>([]);
  const currentNotice = notices[currentIndex];
  const baseStyle = "w-[7.5rem] flex items-center justify-center text-gray-500";

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev < notices.length - 1 ? prev + 1 : 0
    );
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const data = await getAnnouncement();
        setNotices(data);
      } catch (error) {
        console.error("공지사항 불러오기 실패:", error);
      }
    };
    fetchNotices();
  }, [getAnnouncement, setNotices]);

  // 5초마다 자동 슬라이드
  useEffect(() => {
    if (notices.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex < notices.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval); // 언마운트 시 정리
  }, [notices]);

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
            {currentNotice?.title}
          </h3>
          <span className="text-xs text-gray-400">
            {currentNotice?.createdAt.slice(0, 10).replaceAll("-", ".")}
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {currentNotice?.content}
        </p>
      </div>
      <button
        className={`${baseStyle} border-l border-[#EAEAEA] text-2xl disabled:text-gray-300`}
        onClick={handleNext}
        disabled={currentIndex === notices.length - 1}
      >
        ▶
      </button>
    </div>
  );
}