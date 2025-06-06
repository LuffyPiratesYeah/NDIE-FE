'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import makeDocument from "@/util/makeDocument";

export default function DetailPage() {
  const params = useParams();
  const { datas, id } = params as { datas: string; id: string };

  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (datas && id) {
      axios
        .get(`https://ndie-be-985895714915.europe-west1.run.app/${datas}/${id}`)
        .then((response) => {
          setItem(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [datas, id]);

  if (!item) return <p>Loading...</p>; 
  const name = sessionStorage.getItem('name');
  console.log(name)
  return (
    <div className=" flex flex-col gap-[3vh] items-center relative mt-[3vh] h-[90vh]">
    <div className="w-[80%] flex flex-col gap-[3vh]">
      <p className="text-[3vh]">{name}</p>
      <hr className="border-[#CCCCCC] border-[1px] rounded-[5px]" />
    </div>

    <div className='w-[140vh]'>
    {name === '활동' ? (
  // 활동용 레이아웃
  <div>
  <div className='flex flex-row gap-[10vh]'>
    
    {/* 이미지 영역 */}
    {item.image && (
      <div className='flex flex-col items-start w-[60vh]'>
        <div className="w-[50vh] h-[50vh] overflow-hidden rounded-xl">
          <img src={item.image} alt="이미지" className="w-full h-full object-cover" />
        </div>
      </div>
    )}

    {/* 텍스트 영역 */}
    <div className="flex flex-col w-[80vh]">
      <h1 className='text-2xl font-bold mb-2'>{item.title}</h1>
      <p className='text-sm text-gray-500 mb-6'>{item.createdAt}</p>

      <hr className="border-[#EBEBEB] border-[1px] rounded-[5px] mb-6" />
      <div
        className="w-full max-w-full break-all p-[10px_14px] text-base flex flex-wrap h-full overflow-y-scroll mb-5 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
      >
        {makeDocument(item.content)}
      </div>
    
    </div>
  </div>

  <hr className="border-[#EBEBEB] border-[1px] rounded-[5px] my-10 w-full" />
</div>
) : (
  // 공지사항 / QnA 레이아웃
  <div className='flex flex-col w-full'>
    <h1 className='text-2xl font-bold mb-2'>{name === 'QnA' ? 'Q. ' : ''}{item.title}</h1>
    <p className='text-sm text-gray-500 mb-4'>{item.createdAt}</p>
    <div className='flex flex-col'>
    <hr className="border-[#EBEBEB] border-[1px] rounded-[5px] mb-6" />
      <div
        className="w-full max-w-full break-all p-[10px_14px] text-base flex flex-wrap h-full overflow-y-scroll mb-5 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent"
      >
        {makeDocument(item.content)}
      </div>
    <hr className="border-[#EBEBEB] border-[1px] rounded-[5px] mt-6" />
    </div>
  </div>
)}

</div>

  <div className='flex flex-row'>
    <p>이전글 - </p>
    <p>다음글 - </p>
  </div>
      
    </div>
  );
}
