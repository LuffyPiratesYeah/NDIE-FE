import Modal from "@/components/layout/Modal";
import Image from "next/image";
import Plus from "@/assets/write/plus.svg";
import React from "react";
import {useModalStore} from "@/store/modal";
import {CreateActivity} from "@/app/api/activity";

export default function WriteModalScreen({
  fileRef,
  title,
  content
}: {
  fileRef: React.RefObject<HTMLInputElement | null>;
  title : string,
  content : string
                                         }) {
  const {isModalOpen, toggleModal} = useModalStore();
  return(
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
          onClick={()=>CreateActivity({title : title, content : content, image : ""})}
          className={" bg-[#ED9735] text-white font-bold cursor-pointer h-[2.5rem] w-[6.5rem] rounded-[0.625rem] border-2 border-[#ED9735] text-sm flex justify-center items-center"}
        >
          등록하기
        </button>
      </div>
    </Modal>
  )
}