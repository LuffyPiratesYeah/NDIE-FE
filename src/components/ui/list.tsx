'use client'

import React, { useState ,useEffect } from 'react'; 
import Listbox from '../layout/Listbox';
import axios from "@/lib/axiosInstance";

type ListProps = {
    name: string;
    data: string;
  };

  
  
  
  export function List({ name , data}: ListProps) {

    const [item,setitem] = useState([]);

    useEffect(() => {
      axios.get(`/${data}`)
        .then((response) => {
          setitem(response.data);
        });
    
    }, [data]);
    

    return (
    <div className="w-[80%] flex flex-col gap-[3vh] mt-[3vh] h-[90vh]">
    <p className="text-[3vh] ">{name}</p>
    <hr  className="border-[#CCCCCC] border-[1] rounded-[5]"/>
    <div>
    <Listbox item={item} datas={data} name={name}/>
    </div>
    </div>
    
    );
  }
  