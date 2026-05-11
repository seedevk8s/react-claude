// mockData.js — 공통 Mock 데이터
// ✏️ Day 8에서 Spring Boot REST API 로 교체될 데이터

export const MOCK_BOOKS = [
  { id:1,  title:'클린 코드',           author:'로버트 마틴',   price:33000, category:'BOOK',     inStock:true,  isNew:false, isSale:false,
    description:'읽기 좋은 코드를 작성하는 방법을 알려주는 실용적인 가이드. 변수명, 함수, 클래스 설계부터 리팩터링까지 다룬다.' },
  { id:2,  title:'리팩터링 2판',         author:'마틴 파울러',   price:36000, category:'BOOK',     inStock:true,  isNew:true,  isSale:false,
    description:'코드를 더 좋은 설계로 개선하는 체계적인 방법론. JavaScript 예제로 업데이트된 2판.' },
  { id:3,  title:'자바 ORM 표준 JPA',   author:'김영한',        price:43000, category:'BOOK',     inStock:false, isNew:false, isSale:false,
    description:'Spring Boot 개발자라면 필수. JPA 기초부터 성능 최적화까지 한 권으로 완성한다.' },
  { id:4,  title:'모던 자바스크립트',    author:'이웅모',        price:32000, category:'BOOK',     inStock:true,  isNew:true,  isSale:true,
    description:'ES6+ 문법부터 비동기 처리, 모듈까지. React를 배우기 전에 반드시 읽어야 할 책.' },
  { id:5,  title:'알고리즘 인터뷰',      author:'박종건',        price:28000, category:'BOOK',     inStock:false, isNew:false, isSale:true,
    description:'코딩 테스트 완벽 대비. 유형별 핵심 문제 100선과 풀이 전략을 담았다.' },
  { id:6,  title:'도메인 주도 설계',     author:'에릭 에반스',   price:39000, category:'BOOK',     inStock:true,  isNew:false, isSale:false,
    description:'소프트웨어 복잡성을 다루는 방법론. 대규모 시스템 설계에 필수적인 DDD를 설명한다.' },
  { id:7,  title:'개발자 무선 키보드',   author:'브랜드A',       price:89000, category:'DEVICE',   inStock:true,  isNew:true,  isSale:false,
    description:'적축 기계식 87키 텐키리스. 오래 사용해도 손목이 편안한 개발자 전용 키보드.' },
  { id:8,  title:'USB-C 허브 7포트',    author:'브랜드B',       price:45000, category:'DEVICE',   inStock:false, isNew:false, isSale:true,
    description:'HDMI, USB 3.0×3, SD카드, 충전 지원. MacBook/Windows 모두 호환.' },
  { id:9,  title:'코딩 스티커 팩',       author:'브랜드C',       price:5000,  category:'SUPPLIES', inStock:true,  isNew:false, isSale:false,
    description:'노트북을 꾸밀 수 있는 개발 관련 스티커 50종. 방수 소재로 오래 사용 가능.' },
  { id:10, title:'개발자 머그컵',        author:'브랜드D',       price:12000, category:'SUPPLIES', inStock:true,  isNew:true,  isSale:false,
    description:'if(coffee) { code() } 문구가 새겨진 320ml 도자기 머그컵.' },
]

// ✏️ Day 8에서 axios.get('/api/books') 로 교체
export async function fetchBooks(category = 'ALL') {
  await new Promise(r => setTimeout(r, 600))
  return category === 'ALL'
    ? MOCK_BOOKS
    : MOCK_BOOKS.filter(b => b.category === category)
}

// ✏️ Day 8에서 axios.get('/api/books/' + id) 로 교체
export async function fetchBook(id) {
  await new Promise(r => setTimeout(r, 400))
  const book = MOCK_BOOKS.find(b => b.id === id)
  if (!book) throw new Error(`도서(id:${id})를 찾을 수 없습니다.`)
  return book
}
