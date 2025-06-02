import React from "react";

type ContainerProps = {
  children?: React.ReactNode;
};

export default function ContentContainer({children}:ContainerProps) {
  return (
    <div className="h-[50rem] w-full overflow-hidden relative bg-[#F8F8F8]">
      {children}
    </div>
  )
}