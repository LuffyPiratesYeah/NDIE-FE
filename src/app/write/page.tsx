'use client';

import Image from "next/image";
import ArrowBottom from "@/assets/write/arrow-bottom.svg"
import UnderLine from '@/assets/write/underline.svg';
import CancelLine from '@/assets/write/cancelline.svg';
import Bold from '@/assets/write/bold.svg';
import Italic from '@/assets/write/italic.svg';
import Img from '@/assets/write/img.svg';
import UnderlineGray from '@/assets/write/underlineGray.svg';
import BoldGray from '@/assets/write/boldGray.svg';
import ItalicGray from '@/assets/write/italicGray.svg';
import ImgGray from '@/assets/write/imgGraymini.svg';
import CancelLineGray from '@/assets/write/cancellineGray.svg';
import Plus from '@/assets/write/plus.svg';
import React, {useRef, useState} from "react";
import makeDocument from "@/util/makeDocument";
import Modal from "@/components/layout/Modal";
import {useModalStore} from "@/store/modal";

export default function Write() {
  const [title,setTitle] = useState("");
  const [content, setContent] = useState("");

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleDown = (e : React.KeyboardEvent)=>{
    if(e.key === 'Tab'){
      e.preventDefault();
      const textarea = contentRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // 현재 커서 위치에 Tab(4칸 공백) 삽입
      const value = textarea.value;
      textarea.value = value.substring(0, start) + "    " + value.substring(end);

      // 커서를 Tab이 삽입된 위치 뒤로 이동
      textarea.setSelectionRange(start + 4, start + 4);
    }
  }
  const handleInput = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!contentRef.current) return;
    setContent(e.target.value)
    smart(e);
  }
  const smart = (event : React.ChangeEvent<HTMLTextAreaElement>) => {
    const {value, selectionStart} = event.target;
    let updatedValue = value;

    const match = /<([\w가-힣]+)>$/.exec(value.slice(0, selectionStart));
    if (match) {
      const tagName = match[1];
      const closeTag = `</${tagName}>`;

      const hasCloseTag = value.slice(selectionStart).includes(closeTag);

      if (!hasCloseTag) {
        updatedValue = `${value.slice(0, selectionStart)}${closeTag}${value.slice(selectionStart)}`;
        setTimeout(() => {
          event.target.selectionStart = event.target.selectionEnd = selectionStart;
        }, 0);
      }

    }
    setContent(updatedValue);
  }
  const addText = (num: string, position : number)=>{
    if(content.length > 0) setContent((prevText) =>prevText + "\n" + num);
    else setContent((prevText) =>prevText + num);
    setTimeout(()=>{
      if(content.length){
        contentRef.current?.focus();
        contentRef.current?.setSelectionRange(position, position);
      }
      else{
        contentRef.current?.focus();
        contentRef.current?.setSelectionRange(position-1, position-1);
      }
    }, 0)
  }

  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(true);
  const [under, setUnder] = useState(true);
  const [cancel, setCancel] = useState(true);
  const [img, setImg] = useState(true);


  const fileRef = useRef<HTMLInputElement | null>(null);
  const addImgText = async (img : File) =>{
    if(!fileRef.current) return;
    fileRef.current.value = "";
    if(!img) {
      alert("이미지 파일만 업로드할 수 있습니다. (jpg, png, jpeg)");
      return ;
    }
    const data = new FormData();
    data.append('file', img);
    console.log(data)
    // const src = await uploadImg(data);
    // if(src){
    //   addText(`<이미지 src="${src.url}"></이미지>`, content.length);
    // }else{
    //   alert("img 등록에 실패")
    // }
  }

  const {isModalOpen, toggleModal} = useModalStore();

  const [selectedOption, setSelectedOption] = useState("");
  return (
    <div className=" flex items-center justify-center h-[90.5vh] w-full font-[family-name:var(--font-geist-sans)]">
      <div className="w-full h-full gap-4 bg-[#ffffff] flex justify-center flex-col pl-15 pr-15 pt-10 pb-10 items-center">
        <section className={"w-full flex items-center justify-start"}>
          <div className={"relative w-32 border border-[#5A5A5A] rounded-[0.325rem]"}>
            <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} className={"text-[#5A5A5A] appearance-none w-full pl-4 py-1  outline-none"}>
              <option disabled hidden value={""}>카테고리</option>
              <option value={"공지사항"}>공지사항</option>
              <option value={"Q&A"}>Q&A</option>
              <option value={"활동"}>활동</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2">
              <Image src={ArrowBottom} alt={"ArrowBottom"} />
            </div>
          </div>
        </section>
        <input
          className={"w-full h-12 text-3xl font-semibold mb-4 outline-none"}
          placeholder={"제목을 입력해주세요"}
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          spellCheck="false"
        />
        <div className="w-full flex justify-center border-y-[1.5px] border-[#838383]  select-none">
          <div className="flex">
            <div
              className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[50px] hover:bg-[#f3f3f3] hover:text-black hover:cursor-pointer"
              onClick={() => addText("# ", content.length + 6)}
            >
              h1
            </div>
            <div
              className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[50px] hover:bg-[#f3f3f3] hover:text-black hover:cursor-pointer"
              onClick={() => addText("## ", content.length + 6)}
            >
              h2
            </div>
            <div
              className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[50px] hover:bg-[#f3f3f3] hover:text-black hover:cursor-pointer"
              onClick={() => addText("### ", content.length + 6)}
            >
              h3
            </div>
            <div
              className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[50px] hover:bg-[#f3f3f3] hover:text-black hover:cursor-pointer"
              onClick={() => addText("#### ", content.length + 6)}
            >
              h4
            </div>
          </div>

          <div className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[40px]">|</div>

          <div className="flex">
            <div
              className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[50px] hover:bg-[#f3f3f3] hover:text-black hover:cursor-pointer"
              onClick={() => addText("****", content.length + 3)}
              onMouseEnter={() => setBold(false)}
              onMouseLeave={() => setBold(true)}
            >
              <Image src={bold ? BoldGray : Bold} alt="Bold" className="w-full" />
            </div>

            <div
              className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[50px] hover:bg-[#f3f3f3] hover:text-black hover:cursor-pointer"
              onClick={() => addText("**", content.length + 2)}
              onMouseEnter={() => setItalic(false)}
              onMouseLeave={() => setItalic(true)}
            >
              <Image src={italic ? ItalicGray : Italic} alt="Italic" className="w-full" />
            </div>

            <div
              className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[50px] hover:bg-[#f3f3f3] hover:text-black hover:cursor-pointer"
              onClick={() => addText("~~~~", content.length + 3)}
              onMouseEnter={() => setCancel(false)}
              onMouseLeave={() => setCancel(true)}
            >
              <Image src={cancel ? CancelLineGray : CancelLine} alt="Cancel" className="w-full" />
            </div>

            <div
              className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[50px] hover:bg-[#f3f3f3] hover:text-black hover:cursor-pointer"
              onClick={() => addText("____", content.length + 3)}
              onMouseEnter={() => setUnder(false)}
              onMouseLeave={() => setUnder(true)}
            >
              <Image src={under ? UnderlineGray : UnderLine} alt="Under" className="w-full" />
            </div>
          </div>

          <div className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[40px]">|</div>

          <div className="flex gap-2">
            <div
              className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[50px] hover:bg-[#f3f3f3] hover:text-black hover:cursor-pointer"
              onClick={() => {
                if (fileRef.current) {
                  fileRef.current.click();
                }
              }}
              onMouseEnter={() => setImg(false)}
              onMouseLeave={() => setImg(true)}
            >
              <Image src={img ? ImgGray : Img} alt="img" className="w-full" />
            </div>

            <div
              className="p-2 text-[18px] text-[#838383] flex justify-center items-center w-[50px] hover:bg-[#f3f3f3] hover:text-black hover:cursor-pointer"
              onClick={() => addText("---", content.length)}
            >
              hr
            </div>
          </div>
        </div>
        <textarea
          className={"w-full h-full resize-none outline-none"}
          onKeyDown={(e)=>handleDown(e)}
          placeholder={"내용을 입력해주세요"}
          value={content}
          ref={contentRef}
          onChange={(e)=>{
            handleInput(e)
          }}
          spellCheck="false"
        />
      </div>





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

      <footer className=" gap-4 h-[5.25rem] w-full fixed bottom-0 left-0 right-0 pl-15 pr-15 flex justify-end text-white items-center">
        <button
          onClick={()=>{
            if(!title) return alert("제목을 입력해주세요")
            if(!content) return alert("내용을 입력해주세요")
            if(selectedOption === "") return alert("카테고리를 선택해주세요")
            if(selectedOption === "활동") toggleModal();
            else alert("게시함")
          }}
          className={" bg-[#ED9735] text-white font-bold cursor-pointer h-[2.5rem] w-[6.5rem] rounded-[0.625rem] border-2 border-[#ED9735] text-sm flex justify-center items-center"}
        >
          등록하기
        </button>
      </footer>



      <input ref={fileRef} type={"file"} style={{display: "none"}} onChange={(e)=> {
        if(!e.target.files) return
        addImgText(e.target.files[0])
      }} />



      <Modal toggleModal={toggleModal} isOpen={isModalOpen}>
        <div
          onClick={() => {
            if (fileRef.current) {
              fileRef.current.click();
            }
          }}
        className={"cursor-pointer w-full h-[50vh] bg-[#F2F2F2] flex justify-center flex-col gap-4 text-[#8E8E8E] text-xl font-semibold items-center"}>
          <Image src={Plus} alt={"plusIcon"} />
          대표 이미지 추가
        </div>
        <div className={"flex gap-4 justify-center align-center mt-4"}>
          <button
            onClick={()=> toggleModal()}
            className="cursor-pointer font-bold h-[2.5rem] w-[6.5rem] rounded-[0.625rem] border-2 border-[#8c8c8c] text-sm flex justify-center items-center"
          >
            취소
          </button>
          <button
            className={" bg-[#ED9735] text-white font-bold cursor-pointer h-[2.5rem] w-[6.5rem] rounded-[0.625rem] border-2 border-[#ED9735] text-sm flex justify-center items-center"}
          >
            등록하기
          </button>
        </div>
      </Modal>
    </div>
  );
}