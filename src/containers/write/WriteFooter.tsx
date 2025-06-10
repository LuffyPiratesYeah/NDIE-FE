import React from "react";
import {useModalStore} from "@/store/modal";
import {CreateQA} from "@/app/api/q&a";
import {CreateAnnouncement} from "@/app/api/announcement";
import {useRouter} from "next/navigation";
import {useLoadingStore} from "@/store/loading";

export default function WriteFooter({
  title,
  content,
  selectedOption,
}: {
  title : string,
  content : string,
  selectedOption : string,
}) {
  const { toggleModal} = useModalStore();
  const router = useRouter();
  const {setIsLoadingTrue, setIsLoadingFalse} = useLoadingStore();
  const createDocument = async ()=>{
    if(!title) return alert("제목을 입력해주세요")
    if(!content) return alert("내용을 입력해주세요")
    if(selectedOption === "") return alert("카테고리를 선택해주세요")
    if(selectedOption === "활동") toggleModal();
    else if(selectedOption === "공지사항"){
      setIsLoadingTrue();
      const status = await CreateAnnouncement({title, content});
      
      if(status === 200){
        setIsLoadingFalse();
        router.push("/announcement");
      }
    }
    else if(selectedOption === "Q&A") {
      setIsLoadingTrue();
      const status = await CreateQA({title, content});
      if(status === 200){
        setIsLoadingFalse();
        router.push("/qna");
      }
    }
  }
  return (
    <footer className=" gap-4 h-[5.25rem] w-full fixed bottom-0 left-0 right-0 pl-15 pr-15 flex justify-end text-white items-center">
    <button
      onClick={()=>createDocument()}
  className={" bg-[#ED9735] text-white font-bold cursor-pointer h-[2.5rem] w-[6.5rem] rounded-[0.625rem] border-2 border-[#ED9735] text-sm flex justify-center items-center"}
    >
    등록하기
    </button>
    </footer>
  )
}