import Image from "next/image";
import React from "react";
export default function makeDocument(text : string) {
  const tagPatterns = [
    {
      pattern: /^####(.+)$/m,
      component: (text : string) => <span className="text-[17px] font-semibold">{text}</span>
    },
    {
      pattern: /^###(.+)$/m,
      component: (text : string) => <span className="text-[20px] font-semibold">{text}</span>
    },
    {
      pattern: /^##(.+)$/m,
      component: (text : string) => <span className="text-[25px] font-semibold">{text}</span>
    },
    {
      pattern: /^#(.+)$/m,
      component: (text : string) => <span className="text-[27px] font-bold">{text}</span>
    },
    {
      pattern: /\*\*(.*?)\*\*/,
      component: (text : string) => <strong>{text}</strong>
    },
    {
      pattern: /__(.*?)__/,
      component: (text : string) => <span className="underline">{text}</span>
    },
    {
      pattern:  /\*(.*?)\*/,
      component: (text : string) => <i>{text}</i>,
    },
    {
      pattern:  /~~(.*?)~~/,
      component: (text : string) => <span className="line-through">{text}</span>,
    },
    {
      pattern:/---(.*?)/,
      component: () => <div className="w-full h-[2px] bg-gray-500 my-1"></div>
    },
    {
      pattern:/<이미지 src="(.*?)"><\/이미지>/,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component : (src : any) => {
        if(!src) return null;
        // src[1]가 src 주소임 (match 결과는 [전체, 첫번째 캡처 그룹])

main
        return <div className="relative w-full h-[300px]"> {/* 원하는 높이 설정 */}
          <Image
            className="object-cover block mx-auto"
            src={src[0]?.props?.children}
            alt="추가된이미지"
            fill
          />
        </div>
      }
    }
  ];

  function parseText(inputText : string) : React.ReactNode {
    if (!inputText) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let earliestMatch: any | null = null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let matchComponent:any= null;

    tagPatterns.forEach(({ pattern, component }) => {
      const match = inputText.match(pattern);
      if (match && (!earliestMatch || (match.index ?? 0) < (earliestMatch.index ?? Infinity))) {
        earliestMatch = match;
        matchComponent = component;
      }
    });

    if (!earliestMatch){
      return inputText.split("\n").map((line, index) => (
        <span key={index} className="w-full break-words flex min-h-max items-center flex-wrap my-[5px]">{line}</span>
      ));
    }

    const fullMatch = earliestMatch[0];
    const innerText = earliestMatch[1];
    const prefixText = inputText.slice(0, earliestMatch.index);
    const suffixText = inputText.slice(earliestMatch.index + fullMatch.length);

    if(!matchComponent) return <span className="w-full break-words flex min-h-max items-center flex-wrap my-[5px]">{innerText}</span>
    return (
      <>
        {prefixText && parseText(prefixText)}
        {matchComponent(parseText(innerText))}
        {suffixText && parseText(suffixText)}
      </>
    );
  }

  return <div className="flex-1 w-full flex flex-col flex-wrap">{parseText(text)}</div>;
}