// src/pages/Home.jsx — Day 11 리팩토링: useFetch 훅 적용
import React from 'react'
import { useFetch } from '../hooks/useFetch'
import { getBooks } from '../api/bookApi'
import { mockBooks } from '../mockData'
import BookCard from '../components/BookCard'

export default function Home() {
  // ✅ Before: useState 3개 + useEffect → After: useFetch 한 줄
  const { data, loading, error } = useFetch(getBooks)

  // API 실패 시 mockData fallback
  const books = data ?? mockBooks

  if (loading) return <div className="loading-box">도서 목록을 불러오는 중...</div>
  if (error)   return <div className="error-box">서버 연결 실패 — Mock 데이터를 표시합니다</div>

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title mb-0">📚 전체 도서 목록</h1>
        <span className="text-sm text-gray-400">총 {books.length}권</span>
      </div>
      {books.length === 0
        ? <div className="empty-box"><p className="text-4xl mb-3">📭</p><p>등록된 도서가 없습니다.</p></div>
        : <div className="books-grid">{books.map(b => <BookCard key={b.id} book={b} />)}</div>
      }
    </div>
  )
}
