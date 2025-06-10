'use client';
export const runtime = 'edge';


import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Loading from '@/components/ui/loading';

type IndexType = {
  prevId: number;
  prevTitle: string;
  nextId: number;
  nextTitle: string;
};

type CommentType = {
  comment : string;
};

import makeDocument from "@/util/makeDocument";



export default function DetailPage() {
  const [commentText, setCommentText] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [comments, setcomments] = useState<CommentType | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  
    if (storedToken) {
      axios.post(
        `https://ndie-be-985895714915.europe-west1.run.app/user`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`,
          },
        }
      )
      .then((response) => {
        setRole(response.data.authorities[0].authority);
      })
      .catch((err) => {
  
      });
    }
  }, []);

  function formatDate(dateStr: string) {
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${parseInt(year)}년 ${parseInt(month)}월 ${parseInt(day)}일`;
  }
  
  


  function comment(commentText: string) {
    if (!token) {
      
      return;
    }


    axios.post(`https://ndie-be-985895714915.europe-west1.run.app/QNA/comment`,{
      titleId : id,
      content : commentText
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    }
    )
    .then((response) => {
      
      axios.get(`https://ndie-be-985895714915.europe-west1.run.app/QNA/comment/${id}`)
      .then((res) => {
        setcomments(res.data);
      })
    })
  }
  
  const params = useParams();
  const { datas, id } = params as { datas: string; id: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [item, setItem] = useState<any>(null);
  const [indexs, setIndexs] = useState<IndexType | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [click,isclick] = useState<any>(null);

  useEffect(() => {
    if (datas && id) {
      axios
        .get(`https://ndie-be-985895714915.europe-west1.run.app/${datas}/${id}`)
        .then((response) => {
          setItem(response.data);
          
        })
        .catch((error) => {
          
        });
      axios
        .post(`https://ndie-be-985895714915.europe-west1.run.app/${datas}/prev-next`,{
          titleID : id,
          type: datas
        })
        .then((response) => {
          setIndexs(response.data);
          
        })
        .catch((error) => {
          
        });

        axios.get(
          `https://ndie-be-985895714915.europe-west1.run.app/QNA/comment/${id}`,
        )
        .then((response) => {
          setcomments(response.data);
          
        })
        .catch((err) => {
          
        });

    }
  }, [datas, id]);

  if (!item) return (
    <div className="flex justify-center items-center min-h-[95vh]">
    <Loading />
  </div>

  ); 
  const name = sessionStorage.getItem('name');
  
  return (
  <div className=" flex flex-col gap-[2vh] items-center relative mt-[3vh] mb-[3vh] h-auto">
    <div className="w-[80%] flex flex-col gap-[3vh]">
      <p className="text-[3vh]"><Link href={`/${datas === "QNA" ? "qna" : datas === "activity" ? "act" : datas}`}>
  {name}
</Link>
</p>
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
        <p className='text-sm text-gray-500 mb-6'>{formatDate(item.createdAt)}</p>

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

    <div className='flex flex-col w-full'>
      <h1 className='text-2xl font-bold mb-2'>{name === 'QnA' ? 'Q. ' : ''}{item.title}</h1>
      <p className='text-sm text-gray-500 mb-4'>{formatDate(item.createdAt)}</p>
      <div className='flex flex-col gap-[20vh]'>
      <hr className="border-[#EBEBEB] border-[1px] rounded-[5px] mb-6" />
      <div className='flex flex-col gap-[40vh]'>
        <div
          className="w-full max-w-full break-all p-[10px_14px] text-base flex flex-wrap h-full"
        >
          {makeDocument(item.content)}
        </div>
        <div>
        {(name === 'QnA') && (comments?.comment || role === 'ROLE_ADMIN') && (
  <div className="border rounded-xl border-[#EAEAEA] p-4 -mt-[10vh] flex flex-col">
    {comments?.comment ? (
      <div className="p-2 flex flex-row gap-[2vh]">
        <div className='bg-[#FFD19C] w-[6vh] h-[6vh] rounded-[3vh] flex justify-center items-center '>
          <div className='bg-[#FF961F] w-[6vh] h-[6vh] rounded-[10vh] flex justify-center items-center'>
            <p className='text-[2vh] text-[#FFFFFF]'>A</p>
          </div>
        </div>
        {comments.comment}
        </div>
    ) : click ? (
      <div>
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none"
          placeholder="답변을 입력하세요."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-5 py-2 rounded-md flex items-center gap-2 transition"
            onClick={() => comment(commentText)}
          >
            댓글 올리기
          </button>
        </div>
      </div>
    ) : (
      <div className="flex justify-center">
        <button
          className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-5 py-2 rounded-md flex items-center gap-2 transition m-[5vh]"
          onClick={() => isclick(!click)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-5-9l5 5M13 7l6 6" />
          </svg>
          답변 작성
        </button>
      </div>
    )}
  </div>
)}

</div>



      <hr className="border-[#EBEBEB] border-[1px] rounded-[5px] mt-[-35vh]" />
    </div>
    
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
