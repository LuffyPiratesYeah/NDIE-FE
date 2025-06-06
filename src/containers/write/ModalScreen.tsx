import Modal from "@/components/layout/Modal";
import Image from "next/image";
import Plus from "@/assets/write/plus.svg";
import React, {useRef} from "react";
import {useModalStore} from "@/store/modal";
import {CreateActivity, uploadImg} from "@/app/api/activity";
import {useLoadingStore} from "@/store/loading";
import {useRouter} from "next/navigation";

export default function WriteModalScreen({
  title,
  content
}: {
  title : string,
  content : string
}) {
  const {isModalOpen, toggleModal} = useModalStore();
  const [img, setImg] = React.useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const {setIsLoading} = useLoadingStore();
  const changeFile = async (event) => {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedImageTypes.includes(event.target.files[0].type)) {
      alert("이미지 파일만 업로드할 수 있습니다. (jpg, png, jpeg)");
      return;
    }
    const file = event.target.files[0]
    event.target.value = "";
    const data = new FormData();
    data.append("file", file);
    const upload = async () => {
      const res = await uploadImg(data);
      if(res){
        setImg(res.url);
        setIsLoading()
      }
    }
    setIsLoading()
    await upload()
  };

  const router = useRouter();
  const handleSubmit = async () => {
    setIsLoading();
    const status = await CreateActivity({title, content, image: img});
    if(status === 200){
      toggleModal();
      setIsLoading();
      router.push("/activity");
    }
  };
  return(
    <Modal toggleModal={toggleModal} isOpen={isModalOpen}>
      <div
        onClick={() => {
          if (fileRef.current) {
            fileRef.current.click();
          }
        }}
        className={"cursor-pointer w-full h-[50vh] bg-[#F2F2F2] flex justify-center flex-col gap-4 text-[#8E8E8E] text-xl font-semibold items-center"}>
        {img ?
          <img className={"w-[100%] h-[100%] object-cover"} src={img} alt={"thumbnail"} />
          :
          <>
            <Image src={Plus} alt={"plusIcon"} />
            대표 이미지 추가
          </>
        }
      </div>
      <div className={"flex gap-4 justify-center align-center mt-4"}>
        <button
          onClick={()=> toggleModal()}
          className="cursor-pointer font-bold h-[2.5rem] w-[6.5rem] rounded-[0.625rem] border-2 border-[#8c8c8c] text-sm flex justify-center items-center"
        >
          취소
        </button>
        <button
          onClick={()=>handleSubmit()}
          className={" bg-[#ED9735] text-white font-bold cursor-pointer h-[2.5rem] w-[6.5rem] rounded-[0.625rem] border-2 border-[#ED9735] text-sm flex justify-center items-center"}
        >
          등록하기
        </button>
      </div>
      <input ref={fileRef} type={"file"} onChange={(event)=>changeFile(event)} style={{display: "none"}} />
    </Modal>
  )
}