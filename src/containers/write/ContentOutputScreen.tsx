import makeDocument from "@/util/makeDocument";
import React from "react";

export default function ContentOutputScreen({title, content} : {title : string, content : string}) {
  return (
    <div className="hidden lg:flex lg:w-full h-full p-10 bg-[#FBFBFB] flex-col">
      <h1 className="text-[32px] font-semibold p-[10px_14px] w-full max-w-full break-words">
        {title}
      </h1>
      <div
        className="w-full max-w-full break-all p-[10px_14px] text-base flex flex-wrap h-full overflow-y-scroll mb-5 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
      >
        {makeDocument(content)}
      </div>
    </div>
  )
}