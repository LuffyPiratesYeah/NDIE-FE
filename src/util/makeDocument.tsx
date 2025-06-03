import Image from "next/image";
import React, {JSX} from "react";
export default function makeDocument(text : string) {
  const tagPatterns = [
    {
      pattern:  /<제목1>\n?([\s\S]*?)\n?<\/제목1>/,
      component: (text : string) => <span className="text-[27px] font-bold">{text}</span>
    },
    {
      pattern:  /<제목2>\n?([\s\S]*?)\n?<\/제목2>/,
      component: (text : string) => <span className="text-[25px] font-semibold">{text}</span>
    },
    {
      pattern:  /<제목3>\n?([\s\S]*?)\n?<\/제목3>/,
      component: (text : string) => <span className="text-[20px] font-semibold">{text}</span>
    },
    {
      pattern:  /<제목4>\n?([\s\S]*?)\n?<\/제목4>/,
      component: (text : string) => <span className="text-[17px] font-semibold">{text}</span>
    },
    {
      pattern: /<강조>\n?([\s\S]*?)\n?<\/강조>/,
      component: (text : string) => <strong>{text}</strong>
    },
    {
      pattern: /<밑줄>(.*?)<\/밑줄>/,
      component: (text : string) => <span className="underline">{text}</span>
    },
    {
      pattern:  /<기울임>\n?([\s\S]*?)\n?<\/기울임>/,
      component: (text : string) => <i>{text}</i>,
    },
    {
      pattern:  /<취소선>\n?([\s\S]*?)\n?<\/취소선>/,
      component: (text : string) => <span className="line-through">{text}</span>,
    },
    {
      pattern:/<줄>(.*?)<\/줄>/,
      component: () => <div className="w-full h-[2px] bg-gray-500 my-1"></div>
    },
    {
      pattern:/<이미지 src="(.*?)"><\/이미지>/,
      component : (src  : string) => {
        if(!src) return null;
        // src[1]가 src 주소임 (match 결과는 [전체, 첫번째 캡처 그룹])
        return <Image className="w-full object-cover block mx-auto" src={src[1]} alt="추가된이미지" />
      }
    }
  ];

  function parseText(inputText : string) : React.ReactNode {
    if (!inputText) return null;

    let earliestMatch: RegExpMatchArray | null = null;
    let matchComponent: ((children: React.ReactNode) => JSX.Element) | null = null;

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