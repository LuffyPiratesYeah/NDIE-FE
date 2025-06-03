import React from 'react';

export default function Modal({ isOpen, children }: {
  isOpen: boolean,
  children: React.ReactNode
}) {
  if (!isOpen) return null;

  return (
    <div className="w-screen fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
      <div className="w-[40%] min-h-[40%] bg-white p-12 rounded-xl shadow-lg relative">
        {children}
      </div>
    </div>
  );
}