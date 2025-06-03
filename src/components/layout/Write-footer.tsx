'use client'
import React from "react";
import {useModalStore} from "@/store/modal";

const FooterButton = ({children, bgColor, onClick}: Readonly<{children: React.ReactNode, bgColor : string , onClick?: () => void;}>) => {
    return (
        <button
            onClick={onClick}
            style={{ backgroundColor: bgColor, fontWeight : 800, color : bgColor === "#ffffff" ? "#ED9735" : "#ffffff" }}
            className="cursor-pointer h-[2.5rem] w-[6.5rem] rounded-[0.625rem] border-2 border-[#ED9735] text-sm flex justify-center items-center"
        >
            {children}
        </button>
    )
}
export const WriteFooter = () => {
  const {toggleModal} = useModalStore();

    return (
        <footer className=" gap-4 h-[5.25rem] w-full fixed bottom-0 left-0 right-0 pl-15 pr-15 flex justify-end text-white items-center">
            <FooterButton onClick={()=>toggleModal()} bgColor={"#ED9735"}>게시하기</FooterButton>
        </footer>
    )
}


