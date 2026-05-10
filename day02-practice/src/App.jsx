// Day 02 — JSX 문법 완전 정복
// BookStore 관리자 대시보드 페이지
//
// 이 파일에서 배우는 것:
//   1. { } 표현식 — 변수, 연산, 메서드 호출
//   2. 조건부 렌더링 — && / 삼항연산자
//   3. 리스트 렌더링 — .map() + key
//   4. 빈 배열 처리 — length > 0 ? 목록 : 안내문

// ── 데이터 ──────────────────────────────────────────────────────────
// 나중에 useEffect + Axios 로 API에서 받아올 데이터
// 지금은 직접 작성한다

// ✏️ 나중에 useEffect + Axios 로 API에서 받아올 데이터
//    Day 2 에서는 직접 작성한다
const currentUser = {
  name: "김호진",
  isAdmin: true,
  lastLogin: "2025-01-15 09:32",
}

const members = [
  { id: 1, name: "김철수", email: "kim@example.com",  isAdmin: true  },
  { id: 2, name: "이영희", email: "lee@example.com",  isAdmin: false },
  { id: 3, name: "박민준", email: "park@example.com", isAdmin: false },
]

const books = [
  { id: 1, title: "클린 코드",         author: "로버트 마틴", price: 33000, inStock: true,  isNew: false, isSale: false },
  { id: 2, title: "리팩터링 2판",       author: "마틴 파울러", price: 36000, inStock: true,  isNew: true,  isSale: false },
  { id: 3, title: "자바 ORM 표준 JPA", author: "김영한",      price: 43000, inStock: false, isNew: false, isSale: false },
  { id: 4, title: "모던 자바스크립트",   author: "이웅모",      price: 32000, inStock: true,  isNew: true,  isSale: true  },
  { id: 5, title: "알고리즘 인터뷰",    author: "박종건",      price: 28000, inStock: false, isNew: false, isSale: true  },
]

// ✏️ 빈 배열로 바꿔보면 빈 상태 UI를 확인할 수 있다
const orders = [
  { id: 101, title: "클린 코드 외 1건",   date: "2025-01-14", price: 69000 },
  { id: 102, title: "모던 자바스크립트",   date: "2025-01-10", price: 32000 },
]
// const orders = []   // ← 주석 해제하면 빈 상태 확인 가능

// ── 컴포넌트 ─────────────────────────────────────────────────────────
function App() {

  // ✏️ { } 표현식: JS 연산도 바로 사용 가능
  const today = new Date().toLocaleDateString("ko-KR")
  const totalBooks    = books.length
  const inStockCount  = books.filter(b => b.inStock).length
  const outStockCount = books.filter(b => !b.inStock).length

  return (
    <div className="page">

      {/* ── 헤더 ────────────────────────────────────────────────── */}
      <header className="header">
        <div>
          <h1 className="header-title">📚 BookStore 관리자</h1>
          {/*
            ✏️ { } 표현식: 변수를 그대로 출력
               Thymeleaf: th:text="${currentUser.name}"
               React    : {currentUser.name}
          */}
          <p className="header-sub">안녕하세요, {currentUser.name}님</p>
        </div>
        <div className="header-info">
          {/*
            ✏️ 조건부 렌더링 — && 패턴
               "isAdmin 이 true 일 때만" 뱃지를 보여준다
               Thymeleaf: th:if="${currentUser.isAdmin}"
               React    : {currentUser.isAdmin && <span>...</span>}
          */}
          {currentUser.isAdmin && (
            <span className="badge-admin">관리자 계정</span>
          )}
          {/* ✏️ { } 안에서 변수 + 문자열 결합도 가능 */}
          <p className="mt-1">마지막 로그인: {currentUser.lastLogin}</p>
          <p>오늘: {today}</p>
        </div>
      </header>

      <main className="main">

        {/* ── 섹션 1: 요약 카드 ─────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">📊 현황 요약</h2>
          <div className="member-grid">

            {/*
              ✏️ { } 표현식: 계산식도 바로 출력
                 Thymeleaf: th:text="${books.size()}"
                 React    : {totalBooks}
            */}
            <div className="member-card">
              <div className="member-avatar">📚</div>
              <div>
                <p className="member-name">전체 도서</p>
                <p className="text-2xl font-bold text-blue-600">{totalBooks}권</p>
              </div>
            </div>

            <div className="member-card">
              <div className="member-avatar">✅</div>
              <div>
                <p className="member-name">재고 있음</p>
                <p className="text-2xl font-bold text-green-600">{inStockCount}권</p>
              </div>
            </div>

            <div className="member-card">
              <div className="member-avatar">❌</div>
              <div>
                <p className="member-name">품절</p>
                <p className="text-2xl font-bold text-red-500">{outStockCount}권</p>
              </div>
            </div>

          </div>
        </section>

        {/* ── 섹션 2: 회원 목록 ─────────────────────────────────── */}
        <section className="section">
          <h2 className="section-title">👥 회원 목록</h2>
          <div className="member-grid">
            {/*
              ✏️ 리스트 렌더링 — .map()
                 Thymeleaf: th:each="member : ${members}"
                 React    : members.map((member) => ...)
                 key      : 반드시 고유한 값 (DB의 id 사용)
            */}
            {members.map((member) => (
              <div key={member.id} className="member-card">
                {/* ✏️ { } 표현식: 이름 첫 글자를 아바타로 활용 */}
                <div className="member-avatar">{member.name[0]}</div>
                <div>
                  <p className="member-name">{member.name}</p>
                  <p className="member-email">{member.email}</p>
                  {/*
                    ✏️ 조건부 렌더링 — 삼항연산자
                       A이거나 B이거나 → 삼항연산자
                       Thymeleaf: th:if="${m.isAdmin}" / th:unless="${m.isAdmin}"
                       React    : {member.isAdmin ? <A> : <B>}
                  */}
                  {member.isAdmin
                    ? <span className="badge-admin">관리자</span>
                    : <span className="badge-user">일반회원</span>
                  }
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 섹션 3: 도서 목록 테이블 ─────────────────────────── */}
        <section className="section">
          <h2 className="section-title">📖 도서 목록</h2>
          <table className="book-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>저자</th>
                <th>가격</th>
                <th>상태</th>
                <th>구매</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>
                    {book.title}
                    {/* ✏️ && 패턴: isNew 가 true 일 때만 NEW 뱃지 출력 */}
                    {book.isNew  && <span className="badge-new ml-2">NEW</span>}
                    {book.isSale && <span className="badge-sale ml-1">SALE</span>}
                  </td>
                  <td>{book.author}</td>
                  {/*
                    ✏️ { } 표현식: 메서드 호출
                       Thymeleaf: th:text="${#numbers.formatInteger(book.price, 3, 'COMMA')}"
                       React    : {book.price.toLocaleString()}
                  */}
                  <td>{book.price.toLocaleString()}원</td>
                  {/*
                    ✏️ 삼항연산자: 텍스트만 바뀔 때도 사용
                  */}
                  <td>
                    {book.inStock
                      ? <span className="stock-ok">재고 있음</span>
                      : <span className="stock-out">품절</span>
                    }
                  </td>
                  <td>
                    {book.inStock
                      ? <button className="btn-buy">구매하기</button>
                      : <button className="btn-soldout" disabled>품절</button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ── 섹션 4: 최근 주문 (빈 배열 처리) ─────────────────── */}
        <section className="section">
          <h2 className="section-title">🛒 최근 주문</h2>

          {/*
            ✏️ 빈 배열 처리 패턴
               Thymeleaf: th:if="${#lists.isEmpty(orders)}"
               React    : {orders.length > 0 ? 목록 : 안내문}

               ⚠️ 주의: {orders.length && <List />} 는 length 가 0 이면
                        숫자 0 이 화면에 출력된다! → length > 0 으로 비교할 것
          */}
          {orders.length > 0 ? (
            <div className="order-list">
              {orders.map((order) => (
                <div key={order.id} className="order-item">
                  <div>
                    <p className="order-title">{order.title}</p>
                    <p className="order-date">{order.date}</p>
                  </div>
                  <p className="order-price">{order.price.toLocaleString()}원</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-box">
              <p className="text-4xl mb-3">📭</p>
              <p>최근 주문 내역이 없습니다.</p>
            </div>
          )}
        </section>

      </main>

      {/* ── 푸터 ────────────────────────────────────────────────── */}
      <footer className="footer">
        {/* ✏️ { } 표현식: 복합 계산도 인라인으로 가능 */}
        총 {books.length}권 &nbsp;|&nbsp;
        재고 {books.filter(b => b.inStock).length}권 &nbsp;|&nbsp;
        회원 {members.length}명
      </footer>

    </div>
  )
}

export default App
