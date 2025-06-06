'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';


type IndexType = {
  prevId: number;
  prevTitle: string;
  nextId: number;
  nextTitle: string;
};

export default function DetailPage() {
  const params = useParams();
  const { datas, id } = params as { datas: string; id: string };

  const [item, setItem] = useState<any>(null);
  const [indexs, setIndexs] = useState<IndexType | null>(null);


  useEffect(() => {
    if (datas && id) {
      axios
        .get(`https://ndie-be-985895714915.europe-west1.run.app/${datas}/${id}`)
        .then((response) => {
          setItem(response.data);
          console.log(response.data)
        })
        .catch((error) => {
          console.error(error);
        });
      axios
        .post(`https://ndie-be-985895714915.europe-west1.run.app/${datas}/prev-next`,{
          titleID : id,
          type: datas
        })
        .then((response) => {
          setIndexs(response.data);
          console.log(response.data)
        })
        .catch((error) => {
          console.error(error);
        });

    }
  }, [datas, id]);

  if (!item) return (
    <div className="flex justify-center items-center min-h-[95vh]">
    <p className='text-[3vh]'>Loading...</p>
  </div>

  ); 
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

  <div>
  <div className='flex flex-row gap-[10vh]'>
    

    {item.image && (
      <div className='flex flex-col items-start w-[60vh]'>
        <div className="w-[50vh] h-[50vh] overflow-hidden rounded-xl">
          <img src={item.image} alt="이미지" className="w-full h-full object-cover" />
        </div>
      </div>
    )}

    <div className="flex flex-col w-[80vh]">
      <h1 className='text-2xl font-bold mb-2'>{item.title}</h1>
      <p className='text-sm text-gray-500 mb-6'>{item.createdAt}</p>

      <hr className="border-[#EBEBEB] border-[1px] rounded-[5px] mb-6" />
      <p className="whitespace-pre-wrap">{item.content}</p>
    
    </div>
  </div>

  <hr className="border-[#EBEBEB] border-[1px] rounded-[5px] my-10 w-full" />
</div>
) : (

  <div className='flex flex-col w-full'>
    <h1 className='text-2xl font-bold mb-2'>{name === 'QnA' ? 'Q. ' : ''}{item.title}</h1>
    <p className='text-sm text-gray-500 mb-4'>{item.createdAt}</p>
    <div className='flex flex-col gap-[20vh]'>
    <hr className="border-[#EBEBEB] border-[1px] rounded-[5px] mb-6" />
    <p className="whitespace-pre-wrap">{item.content}</p>
    <hr className="border-[#EBEBEB] border-[1px] rounded-[5px] mt-6" />
    </div>
  </div>
)}

</div>
<div className='flex flex-row gap-[100vh]'>
  {indexs?.prevId && (
    <Link href={`/${datas}/${indexs.prevId}`} className="mr-4">
      이전글 - {indexs.prevTitle}
    </Link>
  )}
  {indexs?.nextId && (
    <Link href={`/${datas}/${indexs.nextId}`}>
      다음글 - {indexs.nextTitle}
    </Link>
  )}
</div>
      
    </div>
  );
}
