'use client';

import React, {useRef, useState} from "react";
import ContentInputScreen from "@/containers/write/ContentInputScreen";
import ContentOutputScreen from "@/containers/write/ContentOutputScreen";
import WriteFooter from "@/containers/write/WriteFooter";
import WriteModalScreen from "@/containers/write/ModalScreen";
import FileInput from "@/containers/write/FileInput";

export default function Write() {
  const [title,setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className=" flex items-center justify-center h-[90.5vh] w-full font-[family-name:var(--font-geist-sans)]">
      <ContentInputScreen
        fileRef={fileRef}
        title={title}
        setTitle={setTitle}
        setContent={setContent}
        setSelectedOption={setSelectedOption}
        content={content}
        selectedOption={selectedOption}
      />
      <ContentOutputScreen title={title} content={content}  />
      <WriteFooter title={title} content={content} selectedOption={selectedOption} />
      <FileInput fileRef={fileRef} />
      <WriteModalScreen fileRef={fileRef} />


    </div>
  );
}