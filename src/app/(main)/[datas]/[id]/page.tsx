'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Loading from '@/components/ui/loading';
import makeDocument from "@/util/makeDocument";

type IndexType = {
  prevId: string | null;
  prevTitle: string | null;
  nextId: string | null;
  nextTitle: string | null;
};

type CommentType = {
  comment: string;
};

export default function DetailPage() {
  const [commentText, setCommentText] = useState('');
  const [role, setRole] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [item, setItem] = useState<any>(null);
  const [indexs, setIndexs] = useState<IndexType | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [click, isclick] = useState<any>(null);
  const [comments, setComments] = useState<CommentType | null>(null);

  const params = useParams();
  const { datas, id } = params as { datas: string; id: string };

  const [name, setName] = useState('');

  useEffect(() => {
    setName(sessionStorage.getItem('name') || '');
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { auth, db } = await import("@/lib/firebase");
      const { onAuthStateChanged } = await import("firebase/auth");
      const { doc, getDoc } = await import("firebase/firestore");

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setRole(userData.role || 'USER'); // Assuming role is stored in user doc
          }
        } else {
          setRole(null);
        }
      });
    };
    fetchUser();
  }, []);

  // URL 경로를 Firestore 컬렉션 이름으로 매핑
  const getCollectionName = (path: string) => {
    const mapping: Record<string, string> = {
      'qna': 'QNA',
      'act': 'activity',
      'announcement': 'announcement',
    };
    return mapping[path] || path;
  };

  useEffect(() => {
    if (!datas || !id) return;

    const fetchData = async () => {
      try {
        const { doc, getDoc, collection, query, orderBy, limit, getDocs, startAfter } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const collectionName = getCollectionName(datas);

        // Fetch Item
        const docRef = doc(db, collectionName, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setItem({ id: docSnap.id, ...data });

          // Fetch Comments (Answer)
          if (data.answer) {
            // Assuming answer field exists in the doc directly or in 'comment' field
            // Based on legacy logic, it updates 'comment' field.
          }
          if (data.comment) {
            setComments({ comment: data.comment });
          }

          // Fetch Prev/Next
          if (data.createdAt) {
            const colRef = collection(db, collectionName);
            // Prev (Newer)
            const prevQuery = query(colRef, orderBy("createdAt", "asc"), startAfter(data.createdAt), limit(1));
            const prevSnap = await getDocs(prevQuery);
            const prevdoc = prevSnap.empty ? null : prevSnap.docs[0];

            // Next (Older)
            const nextQuery = query(colRef, orderBy("createdAt", "desc"), startAfter(data.createdAt), limit(1));
            const nextSnap = await getDocs(nextQuery);
            const nextdoc = nextSnap.empty ? null : nextSnap.docs[0];

            setIndexs({
              prevId: prevdoc ? prevdoc.id : null,
              prevTitle: prevdoc ? prevdoc.data().title : null,
              nextId: nextdoc ? nextdoc.id : null,
              nextTitle: nextdoc ? nextdoc.data().title : null
            });
          }

        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [datas, id]);

  function formatDate(dateStr: string) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('T')[0].split('-');
    return `${parseInt(year)}년 ${parseInt(month)}월 ${parseInt(day)}일`;
  }

  async function comment(text: string) {
    if (!text) return;
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const { db } = await import("@/lib/firebase");

      const collectionName = getCollectionName(datas);
      await updateDoc(doc(db, collectionName, id), {
        comment: text
      });
      setComments({ comment: text });
      setCommentText("");
      isclick(false);
    } catch (e) {
      console.error(e);
      alert("댓글 작성 실패");
    }
  }

  if (!item) return (
    <div className="flex justify-center items-center min-h-[95vh]">
      <Loading />
    </div>
  );

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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                  {(name === 'QnA' || datas === 'QNA') && (comments?.comment || role === 'ROLE_ADMIN' || role === 'ADMIN') && (
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
