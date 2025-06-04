type ListProps = {
    name: string;
  };
  
  export function List({ name , data}: ListProps) {
    return (
    <div className="w-[80%]">
    <p className="text-[3vh]">{name}</p>
    <hr  className="border-[#CCCCCC] border-[1] rounded-[5]"/>
    <div>
      <p>dkdkddk</p>
    </div>
    </div>
    
    );
  }
  