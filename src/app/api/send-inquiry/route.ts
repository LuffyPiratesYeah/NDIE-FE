// app/api/send-inquiry/route.ts

import { NextResponse } from 'next/server';
import { getCloudflareContext } from "@opennextjs/cloudflare";
import nodemailer, {TransportOptions} from 'nodemailer';

interface InquiryRequestBody {
  name: string;
  email: string;
  organization?: string;
  selectedTag: string;
  content: string;
}

// POST 함수 시그니처에서 'env:CloudflareEnv'를 제거합니다.
export async function POST(req: Request) {
  console.log('API Route: POST 요청 수신');

  try {
    const body = (await req.json()) as InquiryRequestBody;
    const { name, email, organization, selectedTag, content } = body;

    console.log('API Route: 요청 바디 파싱 완료', body);

    // ⛔️ 빌드 에러의 원인이 되는 Cloudflare Workers 환경 변수 접근 로직을 제거합니다. ⛔️
    // Cloudflare 배포 환경에서도 표준 Node.js/Next.js 방식인 process.env를 사용해야 합니다.
    const EMAIL_HOST = process.env.EMAIL_HOST; // 수정
    const EMAIL_PORT = process.env.EMAIL_PORT; // 수정
    const EMAIL_USER = await getCloudflareContext().env.EMAIL_USER.get(); // 수정
    const EMAIL_PASS = await getCloudflareContext().env.EMAIL_PASS.get(); // 수정

    // 환경 변수 검증 및 로그 (생략 가능하지만 디버깅에 유용)
    console.log('EMAIL_HOST:', EMAIL_HOST ? `설정됨 ${EMAIL_HOST}` : '설정 안됨');
    console.log('EMAIL_PORT:', EMAIL_PORT ? `설정됨 ${EMAIL_PORT}` : '설정 안됨');
    console.log('EMAIL_USER:', EMAIL_USER ? `설정됨 ${EMAIL_USER}` : '설정 안됨');
    console.log('EMAIL_PASS:', EMAIL_PASS ? '설정됨' : '설정 안됨 (보안상 값은 출력X)');

    if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
      console.error("API Route: 이메일 환경 변수가 제대로 설정되지 않았습니다.");
      return NextResponse.json({ message: 'Server configuration error: Missing environment variables.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST, // process.env를 직접 사용
      port: parseInt(EMAIL_PORT as string, 10), // process.env를 직접 사용
      secure: EMAIL_PORT === '465', // true for 465, false for other ports (587 usually needs STARTTLS)
      auth: {
        user: EMAIL_USER, // process.env를 직접 사용
        pass: EMAIL_PASS, // process.env를 직접 사용
      }
    } as TransportOptions);

    console.log('API Route: Nodemailer transporter 생성 완료');

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: EMAIL_USER,
      subject: `[문의] ${selectedTag} - ${name}님의 문의`,
      html: `
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>단체/기관명:</strong> ${organization || '없음'}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <p><strong>문의 태그:</strong> ${selectedTag}</p>
        <p><strong>문의 내용:</strong></p>
        <p>${content}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('API Route: 이메일 발송 성공');

    return NextResponse.json({ message: '문의 이메일이 성공적으로 발송되었습니다.' }, { status: 200 });
  } catch (error) {
    console.error('API Route: 이메일 발송 또는 처리 실패:', error);
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
    return NextResponse.json({ message: `이메일 발송에 실패했습니다: ${errorMessage}` }, { status: 500 });
  }
}