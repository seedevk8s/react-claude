// Home.jsx — 홈 페이지 컴포넌트
//
// [매핑] Thymeleaf: templates/home.html (@Controller 가 렌더링)
//        React    : src/pages/Home.jsx
//
// 역할: 데이터를 가지고 BookCard 에 내려주는 부모 역할
// (나중에 데이터 부분만 useEffect + Axios 로 교체)

import BookCard from '../components/BookCard.jsx'

// ✏️ 나중에 useEffect + Axios 로 GET /api/books 에서 받아올 데이터
const books = [
  { id: 1, title: '클린 코드',          author: '로버트 마틴', price: 33000, inStock: true,  isNew: false, isSale: false },
  { id: 2, title: '리팩터링 2판',        author: '마틴 파울러', price: 36000, inStock: true,  isNew: true,  isSale: false },
  { id: 3, title: '자바 ORM 표준 JPA',  author: '김영한',      price: 43000, inStock: false, isNew: false, isSale: false },
  { id: 4, title: '모던 자바스크립트',    author: '이웅모',      price: 32000, inStock: true,  isNew: true,  isSale: true  },
  { id: 5, title: '알고리즘 인터뷰',     author: '박종건',      price: 28000, inStock: false, isNew: false, isSale: true  },
  { id: 6, title: '도메인 주도 설계',    author: '에릭 에반스', price: 39000, inStock: true,  isNew: false, isSale: false },
  { id: 7, title: 'HTTP 완벽 가이드',    author: '데이빗 고울리', price: 56000, inStock: true, isNew: false, isSale: true  },
  { id: 8, title: '객체지향의 사실과 오해', author: '조영호',   price: 24000, inStock: true,  isNew: false, isSale: false },
]

function Home() {
  return (
    <div>
      <h2 className="section-title">신간 도서 목록</h2>

      <div className="book-grid">
        {/*
          ✏️ 부모(Home) → 자식(BookCard) props 전달
             각 book 객체의 필드를 BookCard 의 prop 으로 넘긴다

             Thymeleaf:
               th:each="book : ${books}"
               th:text="${book.title}"

             React:
               books.map(book => <BookCard title={book.title} ... />)

          ✏️ 전달 방식:
             문자열    → title={book.title}      또는 title="고정값"
             숫자/불리언 → price={book.price}     (중괄호 필수)
             변수      → inStock={book.inStock}
        */}
        {books.map((book) => (
          <BookCard
            key={book.id}
            title={book.title}
            author={book.author}
            price={book.price}
            inStock={book.inStock}
            isNew={book.isNew}
            isSale={book.isSale}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
