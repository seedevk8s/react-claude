// src/utils/notify.js
// ✏️ Day 11 리팩토링: 에러 처리 일관성
// ✏️ Spring: @ControllerAdvice 전역 에러 처리와 유사한 목적

/**
 * notify - 사용자 알림 유틸리티
 *
 * 현재: console 출력 (개발 환경)
 * 실무 전환: react-hot-toast, react-toastify 등 라이브러리로 교체
 *
 * 교체 예:
 *   npm install react-hot-toast
 *   import toast from 'react-hot-toast'
 *   success: (msg) => toast.success(msg)
 *   error:   (msg) => toast.error(msg)
 */
export const notify = {
  success: (msg) => {
    console.log('✅', msg)
    // toast.success(msg)  ← 실무에서 활성화
  },
  error: (msg) => {
    console.error('❌', msg)
    // toast.error(msg)    ← 실무에서 활성화
  },
  info: (msg) => {
    console.info('ℹ️', msg)
    // toast(msg)          ← 실무에서 활성화
  },
}
