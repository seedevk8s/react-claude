// src/hooks/useFetch.js
// ✏️ Day 11 리팩토링: 반복 loading/error 패턴을 커스텀 훅으로 추출
// ✏️ Spring: @Service로 공통 로직을 분리하는 것과 동일한 목적

import { useState, useEffect, useCallback } from 'react'

/**
 * useFetch - API 호출 + 로딩/에러 상태 관리 커스텀 훅
 *
 * @param {Function} fetchFn - axios 호출 함수 (예: getBooks, () => getBook(id))
 * @param {Array}    deps    - useEffect 의존성 배열 (기본값: [])
 * @returns {{ data, loading, error, refetch }}
 *
 * 사용 예:
 *   const { data: books = [], loading, error } = useFetch(getBooks)
 *   const { data: book, loading } = useFetch(() => getBook(id), [id])
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // ✏️ useCallback: refetch 함수 참조 안정화
  const execute = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchFn()
      .then(res => setData(res.data))
      .catch(err => {
        console.error('[useFetch] 오류:', err)
        setError(err)
      })
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    execute()
  }, [execute])

  // refetch: 수동으로 재호출 (예: 삭제 후 목록 갱신)
  return { data, loading, error, refetch: execute }
}
