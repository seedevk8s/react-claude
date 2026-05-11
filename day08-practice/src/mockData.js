// mockData.js — Spring Boot 서버 미실행 시 Fallback 데이터
//
// ✏️ Day 8 변경:
//    이전(Day 7): Home.jsx, BookDetail.jsx 에서 직접 import해서 사용
//    이후(Day 8): Spring Boot 응답 실패 시에만 사용하는 Fallback

export const MOCK_BOOKS = [
  { id:1,  title:'클린 코드',           author:'로버트 마틴',   price:33000, category:'BOOK',     inStock:true,  isNew:false, isSale:false,
    description:'읽기 좋은 코드를 작성하는 방법. 변수명, 함수, 클래스 설계부터 리팩터링까지.' },
  { id:2,  title:'리팩터링 2판',         author:'마틴 파울러',   price:36000, category:'BOOK',     inStock:true,  isNew:true,  isSale:false,
    description:'코드를 더 좋은 설계로 개선하는 체계적인 방법론. JavaScript 예제.' },
  { id:3,  title:'자바 ORM 표준 JPA',   author:'김영한',        price:43000, category:'BOOK',     inStock:false, isNew:false, isSale:false,
    description:'Spring Boot 개발자 필수. JPA 기초부터 성능 최적화까지.' },
  { id:4,  title:'모던 자바스크립트',    author:'이웅모',        price:32000, category:'BOOK',     inStock:true,  isNew:true,  isSale:true,
    description:'ES6+ 문법부터 비동기 처리까지. React 전에 반드시 읽어야 할 책.' },
  { id:5,  title:'알고리즘 인터뷰',      author:'박종건',        price:28000, category:'BOOK',     inStock:false, isNew:false, isSale:true,
    description:'코딩 테스트 완벽 대비. 유형별 핵심 문제 100선.' },
  { id:6,  title:'도메인 주도 설계',     author:'에릭 에반스',   price:39000, category:'BOOK',     inStock:true,  isNew:false, isSale:false,
    description:'대규모 시스템 설계에 필수적인 DDD 방법론.' },
  { id:7,  title:'개발자 무선 키보드',   author:'브랜드A',       price:89000, category:'DEVICE',   inStock:true,  isNew:true,  isSale:false,
    description:'적축 기계식 87키 텐키리스. 개발자 전용.' },
  { id:8,  title:'USB-C 허브 7포트',    author:'브랜드B',       price:45000, category:'DEVICE',   inStock:false, isNew:false, isSale:true,
    description:'HDMI, USB 3.0×3, SD카드, 충전 지원.' },
  { id:9,  title:'코딩 스티커 팩',       author:'브랜드C',       price:5000,  category:'SUPPLIES', inStock:true,  isNew:false, isSale:false,
    description:'노트북용 개발 관련 스티커 50종. 방수 소재.' },
  { id:10, title:'개발자 머그컵',        author:'브랜드D',       price:12000, category:'SUPPLIES', inStock:true,  isNew:true,  isSale:false,
    description:'if(coffee) { code() } 새겨진 320ml 머그컵.' },
]
