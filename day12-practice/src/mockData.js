// ✏️ Thymeleaf: @GetMapping("/books") → List<Book> 응답 대신
// 백엔드 연결 전 Fallback용 Mock 데이터
export const mockBooks = [
  {
    id: 1,
    title: '클린 코드',
    author: '로버트 C. 마틴',
    price: 32000,
    description: '좋은 코드를 작성하는 방법과 나쁜 코드를 개선하는 기술을 다루는 필독서입니다.',
    coverImage: 'https://via.placeholder.com/200x280/4338CA/FFFFFF?text=Clean+Code',
  },
  {
    id: 2,
    title: '리팩터링 2판',
    author: '마틴 파울러',
    price: 38000,
    description: '코드 구조를 개선하여 소프트웨어 설계를 향상시키는 방법을 설명합니다.',
    coverImage: 'https://via.placeholder.com/200x280/059669/FFFFFF?text=Refactoring',
  },
  {
    id: 3,
    title: '자바스크립트 완벽 가이드',
    author: '데이비드 플래너건',
    price: 55000,
    description: 'JavaScript 언어의 모든 것을 상세히 다루는 완벽한 레퍼런스입니다.',
    coverImage: 'https://via.placeholder.com/200x280/D97706/FFFFFF?text=JS+Guide',
  },
  {
    id: 4,
    title: '스프링 부트 3 백엔드 개발',
    author: '신선영',
    price: 28000,
    description: 'Spring Boot 3를 활용한 RESTful API 백엔드 개발 실습서입니다.',
    coverImage: 'https://via.placeholder.com/200x280/DC2626/FFFFFF?text=Spring+Boot',
  },
  {
    id: 5,
    title: '리액트를 다루는 기술',
    author: '김민준',
    price: 42000,
    description: 'React 생태계 전반을 실습 중심으로 학습할 수 있는 국내 대표 React 입문서입니다.',
    coverImage: 'https://via.placeholder.com/200x280/0D9488/FFFFFF?text=React',
  },
  {
    id: 6,
    title: 'HTTP 완벽 가이드',
    author: '데이빗 고울리',
    price: 48000,
    description: 'HTTP 프로토콜의 모든 내용을 다루는 웹 개발자 필독서입니다.',
    coverImage: 'https://via.placeholder.com/200x280/7C3AED/FFFFFF?text=HTTP',
  },
]
