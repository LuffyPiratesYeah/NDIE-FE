'use client'

import React, { useState, useEffect } from 'react';
import Listbox from '../layout/Listbox';


type ListProps = {
  name: string;
  data: string;
};




export function List({ name, data }: ListProps) {

  const [item, setitem] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { collection, getDocs } = await import("firebase/firestore");
        const { db } = await import("@/lib/firebase");

        const querySnapshot = await getDocs(collection(db, data));
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setitem(items as any);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data]);


  return (
    <div className="w-[80%] flex flex-col gap-[3vh] mt-[3vh] h-[90vh]">
      <p className="text-[3vh] ">{name}</p>
      <hr className="border-[#CCCCCC] border-[1] rounded-[5]" />
      <div>
        <Listbox item={item} datas={data} name={name} />
      </div>
    </div>

  );
}
