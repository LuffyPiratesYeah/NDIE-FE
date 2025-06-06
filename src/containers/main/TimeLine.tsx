'use client'
import React, {useState} from "react";
type TimelineEntry = {
  date: string;
  title: string;
  description: string;
  type: "filled" | "outlined";
};

type TimelineData = {
  [year: string]: TimelineEntry[];
};
const timelineData: TimelineData = {
  "2024": [
    {
      date: "03.12",
      title: "연혁1",
      description: `연혁1 내용들 연혁1 내용들연혁1 내용들연혁1 내용들연혁1 내용들
연혁1 내용들연혁1 내용들연혁1 내용들`,
      type: "filled"
    },
    {
      date: "03.12",
      title: "연혁2",
      description: `연혁1 내용들 연혁1 내용들연혁1 내용들연혁1 내용들연혁1 내용들
연혁1 내용들연혁1 내용들연혁1 내용들`,
      type: "outlined"
    }
  ],
  "2025": [
    {
      date: "01.01",
      title: "계획1",
      description: "2025년 내용 예정입니다.",
      type: "outlined"
    }
  ]
};
export default function NDIETimeline() {
  const years = Object.keys(timelineData);
  const [selectedYear, setSelectedYear] = useState("2024");

  const entries = timelineData[selectedYear];

  return (
    <div className="text-black font-sans relative">
      {/* 제목 */}
      <h1 className="text-2xl font-bold mb-12">
        엔디(<span className="text-[#FFA037] font-bold">NDIE</span>)의{" "}
        <span className="text-[#FFA037] font-bold">연혁</span>은 다음과 같습니다
      </h1>
      <div className="flex items-center gap-6 text-xl mb-12">
        {years.map((year, index) => (
          <React.Fragment key={year}>
            <button
              className={`font-bold ${
                selectedYear === year ? "text-black" : "text-gray-400"
              }`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
            {index < years.length - 1 && (
              <div className="w-12 h-px bg-gray-300" />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="relative pl-10">
        <div className="absolute left-9 top-2 bottom-0 w-[2px] bg-gray-200 z-0" />
        <div className="absolute -left-10 top-1 text-lg font-bold bg-[#F8F8F8] px-1 z-10">
          {selectedYear}
        </div>
        {entries.map((entry, index) => (
          <div key={index} className="relative mb-14 pl-6 z-10">
            <div
              className={`absolute left-[-0.65rem] top-[0.35rem] w-3.5 h-3.5 rounded-full ${
                entry.type === "filled"
                  ? "bg-[#D1D5DB]"
                  : "border-2 border-[#D1D5DB] bg-white"
              }`}
            />
            <div className="text-[17px] font-bold mb-2">
              {entry.date} {entry.title}
            </div>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {entry.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}