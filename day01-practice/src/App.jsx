// ✏️ JSX 규칙 ①: 함수 이름은 대문자로 시작한다 (PascalCase)
function App() {

  // ✏️ 나중에 API(useEffect + Axios)로 교체될 데이터
  //    지금은 직접 작성한다
  const books = [
    { id: 1, title: '클린 코드',         author: '로버트 마틴', price: 33000, inStock: true  },
    { id: 2, title: '리팩터링 2판',       author: '마틴 파울러', price: 36000, inStock: true  },
    { id: 3, title: '자바 ORM 표준 JPA', author: '김영한',      price: 43000, inStock: false },
    { id: 4, title: '모던 자바스크립트',   author: '이웅모',      price: 32000, inStock: true  },
  ]

  // ✏️ JSX 규칙 ②: return 안에는 반드시 최상위 태그가 하나여야 한다
  //    여러 태그를 나란히 쓰면 오류 → <div> 또는 <> 로 감싼다
  return (
    <div className="page">

      {/* ✏️ JSX 규칙 ③: HTML 주석 대신 이 형식으로 주석을 작성한다 */}

      {/* 헤더 */}
      <header className="header">
        <h1>📚 BookStore</h1>
        {/* ✏️ JSX 규칙 ④: <br> 처럼 빈 태그도 반드시 / 로 닫는다 */}
        <p>개발자를 위한 기술 도서 쇼핑몰</p>
      </header>

      <main className="main">

        <h2 className="section-title">신간 도서 목록</h2>

        <div className="book-grid">
          {/*
            ✏️ 배열을 화면에 나열할 때는 .map() 을 사용한다
               Thymeleaf: th:each="book : ${books}"
               React    : books.map(book => <div key={book.id}>)

               key 는 반드시 작성한다 (없으면 콘솔에 경고 발생)
          */}
          {books.map(book => (
            <div key={book.id} className="book-card">

              <div className="book-info">
                {/* ✏️ JSX 규칙 ⑤: JS 변수는 { } 안에 넣는다
                        Thymeleaf: th:text="${book.title}"
                        React    : {book.title}                  */}
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-price">{book.price.toLocaleString()}원</p>
              </div>

              <div className="book-footer">
                {/*
                  ✏️ 조건부 렌더링
                     Thymeleaf: th:if="${book.inStock}"
                     React    : {book.inStock && <span>...</span>}
                */}
                {book.inStock
                  ? <button className="btn-buy">구매하기</button>
                  : <button className="btn-soldout" disabled>품절</button>
                }
              </div>

            </div>
          ))}
        </div>

      </main>

      <footer className="footer">
        {/* ✏️ JSX 규칙 ⑥: JS 표현식은 { } 안에서 계산할 수 있다 */}
        <p>총 {books.length}권 &nbsp;|&nbsp; 재고 있음 {books.filter(b => b.inStock).length}권</p>
      </footer>

    </div>
  )
}

export default App
