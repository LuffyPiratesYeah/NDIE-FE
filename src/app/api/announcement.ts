import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

export const CreateAnnouncement = async (data: { title: string, content: string }) => {
  console.log('[CreateAnnouncement] 시작:', data);

  try {
    // Firestore 연결 확인
    if (!db || typeof db.type === 'undefined') {
      console.error('[CreateAnnouncement] Firestore 초기화 안됨');
      return {
        status: 500 as const,
        message: 'Firebase가 초기화되지 않았습니다. 페이지를 새로고침해주세요.'
      };
    }

    // Firebase Auth 상태 확인
    const currentUser = auth?.currentUser;
    console.log('[CreateAnnouncement] Firebase Auth 상태:', currentUser ? `로그인됨 (${currentUser.email})` : '로그인 안됨');
    
    if (!currentUser) {
      return {
        status: 401 as const,
        message: '로그인이 필요합니다. 다시 로그인해주세요.'
      };
    }

    console.log('[CreateAnnouncement] Firestore 연결 확인 완료');

    const docData = {
      ...data,
      uid: currentUser.uid,
      createdAt: new Date().toISOString()
    };

    console.log('[CreateAnnouncement] addDoc 호출 시작...');
    const docRef = await addDoc(collection(db, "announcement"), docData);
    
    console.log('[CreateAnnouncement] 문서 생성 성공:', docRef.id);
    return { status: 200 as const };
  } catch (e) {
    console.error('[CreateAnnouncement] 오류:', e);

    // 상세한 에러 메시지
    let message = '공지사항 작성에 실패했습니다.';
    if (e instanceof Error) {
      message = e.message;

      // Firebase 에러 코드별 메시지
      if ('code' in e) {
        const firebaseError = e as any;
        switch (firebaseError.code) {
          case 'permission-denied':
            message = '권한이 없습니다. 관리자 권한을 확인해주세요.';
            break;
          case 'unavailable':
            message = 'Firebase 서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.';
            break;
          case 'unauthenticated':
            message = '인증되지 않았습니다. 다시 로그인해주세요.';
            break;
        }
      }
    }

    return { status: 500 as const, message };
  }
};
