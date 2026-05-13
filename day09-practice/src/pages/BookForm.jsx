import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBook, createBook, updateBook } from '../api/bookApi'
import { mockBooks } from '../mockData'

// ✏️ Thymeleaf에서는 등록/수정 폼을 각각 별도 HTML로 만들었지만
// React에서는 useParams()로 id 여부를 판별해 하나의 컴포넌트로 두 역할 수행

export default function BookForm() {
  // ✏️ useParams: URL의 :id 파라미터 추출
  //    /books/new   → id = undefined
  //    /books/3/edit → id = '3'
  const { id } = useParams()
  const isEdit = Boolean(id)           // id 있으면 수정 모드
  const navigate = useNavigate()

  // ✏️ Thymeleaf: Model에 빈 BookDto 또는 기존 book 객체 전달
  // React: state로 폼 값 관리 (제어 컴포넌트)
  const [form, setForm] = useState({
    title: '',
    author: '',
    price: '',
    description: '',
    coverImage: '',
  })

  // ✏️ 유효성 에러 메시지 state
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEdit) // 수정 모드 초기 로딩

  // ─── 수정 모드: 기존 도서 데이터 불러오기 ─────────────
  // ✏️ Thymeleaf: th:value="${book.title}" → 서버가 HTML 생성 시 값 삽입
  // React: useEffect로 API 호출 → state 초기화 → 리렌더링
  useEffect(() => {
    if (!isEdit) return

    getBook(id)
      .then(res => setForm(res.data))
      .catch(() => {
        // Fallback: mockData
        const found = mockBooks.find(b => String(b.id) === id)
        if (found) setForm(found)
        else navigate('/')
      })
      .finally(() => setFetchLoading(false))
  }, [id])

  // ─── 입력 변경 핸들러 ──────────────────────────────────
  // ✏️ Thymeleaf: th:field 가 자동으로 바인딩
  // React: onChange로 name 속성을 키로 state 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    // 입력 시 해당 필드의 에러 즉시 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // ─── 클라이언트 유효성 검사 ────────────────────────────
  // ✏️ Thymeleaf: @Valid + BindingResult → 서버 검사
  // React: 제출 전 클라이언트 검사 (서버 검사는 별도로 추가 필요)
  const validate = () => {
    const newErrors = {}
    if (!form.title.trim())
      newErrors.title = '제목을 입력하세요'
    if (!form.author.trim())
      newErrors.author = '저자를 입력하세요'
    if (!form.price || Number(form.price) <= 0)
      newErrors.price = '올바른 가격을 입력하세요 (0 초과)'
    return newErrors
  }

  // ─── 폼 제출 ───────────────────────────────────────────
  // ✏️ Thymeleaf: <form action="/books" method="post"> → 브라우저가 제출
  // React: e.preventDefault()로 기본 제출 막고 Axios로 직접 호출
  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price), // 문자열 → 숫자 변환
      }

      if (isEdit) {
        await updateBook(id, payload)  // PUT /api/books/:id
      } else {
        await createBook(payload)      // POST /api/books
      }

      // ✏️ Thymeleaf: return "redirect:/books"
      navigate('/')
    } catch (err) {
      console.error('저장 실패:', err)
      alert('저장에 실패했습니다. 다시 시도하세요.')
    } finally {
      setLoading(false)
    }
  }

  // 수정 모드에서 기존 데이터 로딩 중
  if (fetchLoading) {
    return <div className="loading-box">도서 정보를 불러오는 중...</div>
  }

  return (
    <div className="form-page">
      {/* ✏️ 등록/수정 모드에 따라 제목 변경 */}
      <h1 className="form-title">
        {isEdit ? '✏️ 도서 수정' : '📝 도서 등록'}
      </h1>

      <form onSubmit={handleSubmit} className="book-form" noValidate>

        {/* ─── 제목 ─────────────────────────────────── */}
        <div className="form-group">
          <label htmlFor="title">
            제목 <span className="text-red-400">*</span>
          </label>
          <input
            id="title"
            name="title"                      // ✏️ handleChange의 name 키
            value={form.title}                // ✏️ Thymeleaf: th:field="*{title}"
            onChange={handleChange}
            placeholder="도서 제목을 입력하세요"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && (
            <span className="error-msg">{errors.title}</span>
          )}
        </div>

        {/* ─── 저자 ─────────────────────────────────── */}
        <div className="form-group">
          <label htmlFor="author">
            저자 <span className="text-red-400">*</span>
          </label>
          <input
            id="author"
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="저자명을 입력하세요"
            className={errors.author ? 'error' : ''}
          />
          {errors.author && (
            <span className="error-msg">{errors.author}</span>
          )}
        </div>

        {/* ─── 가격 ─────────────────────────────────── */}
        <div className="form-group">
          <label htmlFor="price">
            가격 (원) <span className="text-red-400">*</span>
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="1"
            value={form.price}
            onChange={handleChange}
            placeholder="예: 32000"
            className={errors.price ? 'error' : ''}
          />
          {errors.price && (
            <span className="error-msg">{errors.price}</span>
          )}
        </div>

        {/* ─── 설명 ─────────────────────────────────── */}
        <div className="form-group">
          <label htmlFor="description">설명</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            placeholder="도서 설명을 입력하세요 (선택)"
          />
        </div>

        {/* ─── 커버 이미지 URL ──────────────────────── */}
        <div className="form-group">
          <label htmlFor="coverImage">커버 이미지 URL</label>
          <input
            id="coverImage"
            name="coverImage"
            value={form.coverImage}
            onChange={handleChange}
            placeholder="https://example.com/cover.jpg (선택)"
          />
          {/* ✏️ 실습 ④: 이미지 미리보기 — URL 입력 시 아래에 표시 */}
          {form.coverImage && (
            <img
              src={form.coverImage}
              alt="커버 미리보기"
              className="mt-2 w-32 h-44 object-cover rounded-lg border border-gray-200"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}
        </div>

        {/* ─── 버튼 ─────────────────────────────────── */}
        <div className="form-actions">
          {/* ✏️ navigate(-1): 히스토리 스택에서 뒤로 이동 */}
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(-1)}
          >
            취소
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading
              ? '저장 중...'
              : (isEdit ? '✅ 수정 완료' : '📝 등록')
            }
          </button>
        </div>
      </form>
    </div>
  )
}
