// src/components/ErrorBoundary.jsx
// ✏️ 도전 과제 ④: 런타임 에러 처리
// 클래스 컴포넌트로만 구현 가능 (React 훅은 에러 경계 미지원)
// ✏️ Spring: @ControllerAdvice + @ExceptionHandler와 유사

import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // 자식 컴포넌트에서 에러 발생 시 호출
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  // 에러 로깅 (실무: Sentry 등으로 전송)
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <p className="text-6xl mb-4">⚠️</p>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">예상치 못한 오류가 발생했습니다</h2>
          <p className="text-gray-500 mb-6 text-sm">{this.state.error?.message}</p>
          <button
            className="btn-primary"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            다시 시도
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
