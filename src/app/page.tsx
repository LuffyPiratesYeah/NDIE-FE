import React from "react";
import Image from "next/image";
import Main from "@public/images/mainback.svg"
import ContentContainer from "@/containers/main/ContentContainer";
import NoticeContainer from "@/containers/main/NoticeContainer";

export default function Home() {
  return (
    <div>
      <ContentContainer>
        <Image src={Main} alt={"main"} className="absolute top-[-20px] z-0"/>
        <div className="absolute top-1/2 -translate-y-1/2 z-1 opacity-50 bg-white h-[40rem] left-[10rem] right-[10rem] rounded-4xl">

        </div>
      </ContentContainer>
      <NoticeContainer />
      <ContentContainer>

      </ContentContainer>
    </div>
  );
}
