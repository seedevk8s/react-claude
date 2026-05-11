# Day 5 — useState 심화 + 불변성 + 폼 상태 관리

## 학습 목표
- 객체/배열 state의 불변성 원칙을 이해하고 올바르게 업데이트할 수 있다
- 여러 개의 state를 선언하고 조합하여 복잡한 UI를 구성할 수 있다
- `onChange`로 입력 필드를 state와 연결(제어 컴포넌트)할 수 있다
- 검색·필터·정렬 기능을 state만으로 구현할 수 있다
- 폼 데이터를 객체 state 하나로 관리하는 패턴을 적용할 수 있다

---

## 1. 불변성(Immutability) — 왜 직접 수정하면 안 되는가

### 1-1. React의 변경 감지 원리

React는 **참조값**을 비교해서 state가 바뀌었는지 판단한다.

```jsx
const arr = [1, 2, 3]

// ❌ 직접 수정 — 참조값이 같으므로 React가 변경 감지 못 함
arr.push(4)
setCart(arr)         // 같은 참조 → 리렌더링 안 됨

// ✅ 새 배열 생성 — 참조값이 달라져서 React가 변경 감지
setCart([...arr, 4]) // 새 참조 → 리렌더링 됨
```

### 1-2. 객체 state 불변성 패턴

```jsx
const [user, setUser] = useState({ name: "김철수", age: 28, city: "서울" })

// ❌ 직접 수정 — 화면 갱신 안 됨
user.name = "이영희"
setUser(user)

// ✅ 스프레드로 복사 후 원하는 필드만 교체
setUser({ ...user, name: "이영희" })
//       └ 나머지 필드(age, city)는 그대로 유지
```

### 1-3. 중첩 객체 패턴

```jsx
const [member, setMember] = useState({
  name: "김철수",
  address: { city: "서울", district: "강남구" }
})

// ✅ 중첩 객체도 각 레벨마다 스프레드 적용
setMember({
  ...member,
  address: { ...member.address, city: "부산" }
})
```

> 💡 **한 줄 비유**
> - 불변성 = 원본 서류를 복사한 후, 복사본에만 수정
> - 원본(이전 state)을 건드리지 않는다

---

## 2. 여러 state 조합 — 검색 + 필터 + 정렬

```jsx
function Home() {
  const [search,   setSearch]   = useState('')           // 검색어
  const [category, setCategory] = useState('ALL')        // 카테고리 필터
  const [sortBy,   setSortBy]   = useState('default')    // 정렬 기준

  // 3개 state를 조합해서 파생 데이터를 계산
  // (별도 state 불필요 — render마다 재계산)
  const filtered = books
    .filter(b => category === 'ALL' || b.category === category)
    .filter(b => b.title.includes(search) || b.author.includes(search))
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      return 0
    })

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} />
      {/* filtered 배열로 렌더링 */}
    </div>
  )
}
```

> 💡 **파생 데이터(Derived State)**
> filter, sort, count 등 기존 state에서 계산 가능한 값은
> 별도 state로 만들지 말고 렌더링 시 직접 계산한다

---

## 3. 제어 컴포넌트 — onChange + useState

### 3-1. Thymeleaf vs React 입력 처리

| 구분 | Thymeleaf | React |
|------|-----------|-------|
| 값 바인딩 | `th:value="${form.title}"` | `value={form.title}` |
| 변경 감지 | 서버 submit 시 | `onChange` 즉시 |
| 데이터 전송 | `<form method="post">` | state를 API로 직접 전송 |
| 유효성 검사 | 서버에서 BindingResult | 클라이언트 state에서 즉시 |

### 3-2. 단일 입력 필드

```jsx
// input의 value = state / onChange = state 업데이트
// → "제어 컴포넌트" (Controlled Component)

const [title, setTitle] = useState('')

<input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="도서명 검색"
/>
```

### 3-3. 폼 전체를 객체 state로 관리

```jsx
// ✅ 필드가 많을 때 — 객체 하나로 관리
const [form, setForm] = useState({
  title: '', author: '', price: '', category: 'BOOK'
})

// 범용 핸들러 — 필드명으로 자동 매핑
function handleChange(e) {
  const { name, value } = e.target
  setForm({ ...form, [name]: value })
  //               ↑ [name]은 계산된 키 (Computed Property)
  //               e.g. name='title' → { ...form, title: value }
}

<input name="title"  value={form.title}  onChange={handleChange} />
<input name="author" value={form.author} onChange={handleChange} />
<input name="price"  value={form.price}  onChange={handleChange} />
```

---

## 4. select / checkbox / radio 처리

```jsx
// select (카테고리 필터)
<select value={category} onChange={e => setCategory(e.target.value)}>
  <option value="ALL">전체</option>
  <option value="BOOK">도서</option>
  <option value="DEVICE">디바이스</option>
</select>

// checkbox
const [agreed, setAgreed] = useState(false)
<input
  type="checkbox"
  checked={agreed}
  onChange={e => setAgreed(e.target.checked)}  // e.target.value 아님!
/>

// radio
const [sortBy, setSortBy] = useState('default')
<input type="radio" value="price-asc"
  checked={sortBy === 'price-asc'}
  onChange={e => setSortBy(e.target.value)}
/>
```

---

## 5. 오후 프로젝트 실습 가이드

### Step 1. 검색창 추가 (30분)
```jsx
const [search, setSearch] = useState('')

<input
  type="text"
  value={search}
  onChange={e => setSearch(e.target.value)}
  placeholder="도서명 또는 저자 검색"
/>
```

### Step 2. 카테고리 필터 (30분)
```jsx
const [category, setCategory] = useState('ALL')

const categories = ['ALL', 'BOOK', 'DEVICE', 'SUPPLIES']

{categories.map(cat => (
  <button
    key={cat}
    onClick={() => setCategory(cat)}
    className={category === cat ? 'btn-active' : 'btn-filter'}
  >
    {cat}
  </button>
))}
```

### Step 3. 정렬 + 파생 데이터 계산 (30분)
```jsx
const [sortBy, setSortBy] = useState('default')

const displayed = books
  .filter(b => category === 'ALL' || b.category === category)
  .filter(b => b.title.includes(search) || b.author.includes(search))
  .sort((a, b) => {
    if (sortBy === 'price-asc')  return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    return 0
  })
```

### Step 4. 체크리스트
- [ ] 객체 state 수정 시 스프레드(`...`) 를 사용하는가
- [ ] input의 value를 state와 연결했는가 (제어 컴포넌트)
- [ ] 검색 결과가 0건일 때 안내 메시지가 나오는가
- [ ] 파생 데이터를 별도 state로 만들지 않고 계산했는가

---

## 오늘의 핵심 정리

| # | 핵심 내용 |
|---|-----------|
| ✅ 1 | 객체/배열 state는 **새 참조**를 만들어서 setter에 전달 |
| ✅ 2 | 객체 수정: `{ ...obj, field: newValue }` |
| ✅ 3 | 여러 state를 조합한 파생 데이터는 **별도 state 불필요** |
| ✅ 4 | `value={state} + onChange` = 제어 컴포넌트 |
| ✅ 5 | 폼 필드가 많으면 `[e.target.name]` 범용 핸들러로 통합 |
| ✅ 6 | checkbox는 `e.target.checked`, 나머지는 `e.target.value` |

---

## 참고 자료
- [state에서 객체 업데이트](https://react.dev/learn/updating-objects-in-state)
- [state에서 배열 업데이트](https://react.dev/learn/updating-arrays-in-state)
- [폼 처리](https://react.dev/learn/reacting-to-input-with-state)
