// src/pages/BookForm.jsx — Day 11 리팩토링: useCallback + notify 적용
import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getBook, createBook, updateBook } from '../api/bookApi'
import { notify } from '../utils/notify'

const EMPTY_FORM = { title:'', author:'', price:'', description:'', coverImage:'' }

export default function BookForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(isEdit)

  // ✅ isEdit 변경 시 폼 명시적 초기화
  useEffect(() => {
    if (isEdit) {
      getBook(id)
        .then(res => setForm(res.data))
        .catch(() => navigate('/'))
        .finally(() => setFetchLoading(false))
    } else {
      setForm(EMPTY_FORM)
      setErrors({})
    }
  }, [id, isEdit])

  // ✅ useCallback: 참조 안정화
  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }, [])

  const validate = useCallback(() => {
    const e = {}
    if (!form.title.trim())                 e.title  = '제목을 입력하세요'
    if (!form.author.trim())                e.author = '저자를 입력하세요'
    if (!form.price || Number(form.price) <= 0) e.price = '올바른 가격을 입력하세요'
    return e
  }, [form])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return }
    setLoading(true)
    try {
      const payload = { ...form, price: Number(form.price) }
      if (isEdit) { await updateBook(id, payload); notify.success('도서가 수정되었습니다.') }
      else        { await createBook(payload);      notify.success('도서가 등록되었습니다.') }
      navigate('/')
    } catch {
      notify.error('저장에 실패했습니다. 다시 시도하세요.')
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) return <div className="loading-box">도서 정보를 불러오는 중...</div>

  return (
    <div className="form-page">
      <h1 className="form-title">{isEdit ? '✏️ 도서 수정' : '📝 도서 등록'}</h1>
      <form onSubmit={handleSubmit} className="book-form" noValidate>
        {[{id:'title',label:'제목 *'},{id:'author',label:'저자 *'}].map(f => (
          <div key={f.id} className="form-group">
            <label htmlFor={f.id}>{f.label}</label>
            <input id={f.id} name={f.id} value={form[f.id]}
              onChange={handleChange} className={errors[f.id]?'error':''} />
            {errors[f.id] && <span className="error-msg">{errors[f.id]}</span>}
          </div>
        ))}
        <div className="form-group">
          <label htmlFor="price">가격 (원) *</label>
          <input id="price" name="price" type="number" min="1"
            value={form.price} onChange={handleChange} className={errors.price?'error':''} />
          {errors.price && <span className="error-msg">{errors.price}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="description">설명</label>
          <textarea id="description" name="description" value={form.description}
            onChange={handleChange} rows={4} />
        </div>
        <div className="form-group">
          <label htmlFor="coverImage">커버 이미지 URL</label>
          <input id="coverImage" name="coverImage" value={form.coverImage} onChange={handleChange} />
          {form.coverImage && (
            <img src={form.coverImage} alt="미리보기"
              className="mt-2 w-32 h-44 object-cover rounded-lg border border-gray-200"
              onError={e => e.target.style.display='none'} />
          )}
        </div>
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate(-1)}>취소</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '저장 중...' : (isEdit ? '✅ 수정 완료' : '📝 등록')}
          </button>
        </div>
      </form>
    </div>
  )
}
