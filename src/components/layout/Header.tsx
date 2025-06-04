import Link from "next/link";
import Image from "next/image";
import Logo from "@public/images/logo.svg";
export const Header = () => {
  return (
    <header className="h-[4.6875rem] sticky top-0 left-0 right-0 border-b-[#585858] border-b-[0.4px] pl-40 pr-40 flex justify-between items-center z-50 bg-white">
      <div className="flex gap-20 items-center">
        <div className="flex gap-4 items-center">
          <Image src={Logo} alt={"Logo"} />
          <p className="text-2xl">NDIE</p>
        </div>
        <Link href="/">홈</Link>
        <Link href="/">활동</Link>
        <Link href="/">QnA</Link>
        <Link href="/">공지사항</Link>
        <Link href="/write">게시물 작성</Link>
      </div>
      <div className="flex gap-11 items-center">
        <Link href="/">로그인</Link>
        <Link href="/signup">회원가입</Link>
      </div>
    </header>
  )
}