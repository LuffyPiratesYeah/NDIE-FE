'use client'



type ListBoxProps = {
    item: { id: number; title: string; username: string; views: number; createdAt: string }[];
    datas: string; // datas가 URL 경로 일부라 가정
  };
  
  
  
  export  default function Deslist({ item , datas}: ListBoxProps) {


    return (
        <div>
            <p>{item.title}</p>
        </div>
    
    );
  }
  