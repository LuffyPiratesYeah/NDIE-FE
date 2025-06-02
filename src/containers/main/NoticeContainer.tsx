import React from "react";

export default function NoticeContainer() {
  const baseStyle = "w-[7.5rem] border-[#EAEAEA]";
  return (
    <div className="h-[11.25rem] w-full flex">
      <button className={`${baseStyle} border-r-1`}>왼쪽</button>
      <div className="w-full">
        공지
      </div>
      <button className={`${baseStyle} border-l-1`}>오른쪽</button>
    </div>
  )
}