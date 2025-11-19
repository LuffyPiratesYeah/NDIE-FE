// app/api/send-inquiry/route.ts
// 파일 상단에 import { NextResponse } from 'next/server'; 가 있는지 확인

import { NextResponse } from 'next/server'; // 필수
import nodemailer, {TransportOptions} from 'nodemailer';

export default {
  async fetch(request: Request, env: Cloudflare.Env) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    try {
      const body = await request.json();
      const { name, email, organization, selectedTag, content } = body;

      // vars 접근
      const emailHost = env['1'].value;
      const emailPort = parseInt(env['2'].value, 10);

      // 시크릿 접근
      const emailUser = env.EMAIL_USER; // SecretsStoreSecret
      const emailPass = env.EMAIL_PASS; // SecretsStoreSecret

      if (!emailHost || !emailPort || !emailUser || !emailPass) {
        console.error("API Route: 이메일 환경 변수가 제대로 설정되지 않았습니다.");
        return NextResponse.json({ message: 'Server configuration error: Missing environment variables.' }, { status: 500 });
      }

      const transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: emailPort === 465,
        auth: {
          user: emailUser,
          pass: emailPass,
        },
        tls: {
          rejectUnauthorized: false,
        },
      } as TransportOptions);

      const mailOptions = {
        from: `"${name}" <${email}>`,
        to: 'ndie4change@gmail.com',
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

      return new Response(
        JSON.stringify({ message: '문의 이메일이 성공적으로 발송되었습니다.' }),
        { headers: { 'Content-Type': 'application/json' }, status: 200 }
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      return new Response(
        JSON.stringify({ message: `이메일 발송에 실패했습니다: ${errorMessage}` }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  },
};
