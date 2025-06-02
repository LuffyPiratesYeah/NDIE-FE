import React from "react";
import Image from "next/image";
import Main from "@public/images/mainback.svg"
import ContentContainer from "@/containers/main/ContentContainer";
import NoticeContainer from "@/containers/main/NoticeContainer";
import HomeBanner from "@/containers/main/HomeBanner";

export default function Home() {
  return (
    <div>
      <ContentContainer>
        <Image src={Main} alt={"main"} className="absolute top-[-20px] z-0"/>
        <HomeBanner />
      </ContentContainer>
      <NoticeContainer />
      <ContentContainer>
        <h1></h1>
      </ContentContainer>
    </div>
  );
}
