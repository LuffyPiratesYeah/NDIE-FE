import Image from "next/image";
import Logo from "@public/images/logoL.svg"

type ButtonProps = {
  children: React.ReactNode;
};
const Button = ({children}:ButtonProps) => {
  return (
    <button className="bg-white text-black p-[1.125rem]">
      {children}
    </button>
  )
}
export const Footer = () => {
  return (
    <footer className="h-[36.25rem] w-full bg-[#001246] pl-40 pr-40 flex justify-between text-white items-center">
      <ul className="flex gap-4 flex-col">
        <li>대표이사 및 협회장 안지혼</li>
        <li>대표이사 및 협회장 안지혼</li>
        <li>대표이사 및 협회장 안지혼</li>
        <li>대표이사 및 협회장 안지혼</li>
        <li>대표이사 및 협회장 안지혼</li>
        <li>대표이사 및 협회장 안지혼</li>
        <div className="flex gap-11 items-center">
          <Button>국세청</Button>
          <Button>국민권익위원회</Button>
          <Button>서울시교육청</Button>
        </div>
        <ul className="flex gap-4 items-center">
          <li>NDIE</li>
          <li>연구</li>
          <li>교육</li>
          <li>소통</li>
          <li>회비/후원</li>
        </ul>
        <ul className="flex gap-11 items-center">
          <li>이용약관</li>
          <li>개인정보처리방침</li>
        </ul>
        <li>NDIE 디지털과 포용성 네트워크</li>
      </ul>
      <Image src={Logo} alt={"Logo"} />
    </footer>
  )
}