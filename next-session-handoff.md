# 📋 다음 세션 전달 메모 — React 전환 교육 커리큘럼

## 프로젝트 개요
- **대상**: Spring Boot + Thymeleaf 경험자 취준생 6명
- **기간**: 12일 (오전 4시간 교육 + 오후 4시간 프로젝트)
- **실전 시나리오**: BookStore 도서 쇼핑몰을 Day별로 기능 확장
- **강의 방식**: 모든 개념을 Thymeleaf와 매핑해서 설명
- **백엔드**: Spring Boot + @RestController + JSON 응답

---

## ✅ 완료된 작업 (Day 1~8)

| Day | 주제 | 산출물 |
|-----|------|--------|
| Day 1 | Vite + React 초기 세팅 | md / pptx / drawio / practice.zip |
| Day 2 | JSX 심화, 조건부·리스트 렌더링 | md / pptx / drawio / practice.zip |
| Day 3 | 컴포넌트 분리 (Header/Footer/Layout/BookCard) | md / pptx / drawio / practice.zip |
| Day 4 | useState + 이벤트 처리, 장바구니 | md / pptx / drawio / practice.zip |
| Day 5 | useState 심화 + 불변성 + 검색·필터·정렬 | md / pptx / drawio / practice.zip |
| Day 6 | useEffect + 데이터 로딩 + 로딩/에러 UI | md / pptx / drawio / practice.zip |
| Day 7 | React Router + 멀티페이지 | md / pptx / drawio / practice.zip |
| Day 8 | Axios + Spring Boot REST API 연동 | md / pptx / drawio / practice.zip |

모든 파일 위치: /mnt/user-data/outputs/
형식: dayXX.md, dayXX.pptx, dayXX.drawio, dayXX-practice.zip

---

## 🔜 남은 일정

| Day | 주제 |
|-----|------|
| Day 9  | CRUD 완성 (도서 등록/수정/삭제) |
| Day 10 | 로그인/인증 + Context API |
| Day 11 | 통합 점검 + 코드 리뷰 |
| Day 12 | 빌드/배포 + 최종 발표 |

---

## Day 8 실습 프로젝트 구조 (Day 9 기반)

```
day08-practice/src/
├── api/
│   ├── api.js         axios 공통 인스턴스 (baseURL: '/api', 인터셉터)
│   └── bookApi.js     getBooks / getBook / createBook / updateBook / deleteBook
├── components/
│   ├── Header.jsx     Link 사용
│   ├── Layout.jsx     Outlet 사용
│   ├── Footer.jsx
│   └── BookCard.jsx
├── pages/
│   ├── Home.jsx       useEffect + axios
│   ├── BookDetail.jsx useParams + axios
│   ├── CartPage.jsx
│   └── NotFound.jsx
├── mockData.js        Fallback용 Mock 데이터
└── App.jsx            BrowserRouter + cart state
```

---

## 핵심 설계 결정사항 (반드시 유지)

1. Tailwind CSS: @layer components { .class { @apply ... } } 패턴
   - JSX는 의미있는 클래스명만, 스타일은 index.css에서 관리

2. 데이터 흐름: mockData.js Fallback 유지
   - // ✏️ 주석 스타일 유지 (Thymeleaf 매핑 포함)

3. drawio 생성 규칙 (중요!):
   - 반드시 mxfile 루트 태그 사용
   - mxfile > diagram > mxGraphModel > root 구조
   - make_page() 함수로 탭 생성 시 id=0, id=1 기본 셀 필수
   - Python xml.etree.ElementTree 사용
   - 생성 후 반드시 검증 출력 (루트태그 + vertex/edge 수)

4. pptx: shadow 객체 재사용 금지 (파일 손상 원인)

5. zip 패키징: --exclude "*/node_modules/*" 반드시 포함

---

## Day 9 계획 — CRUD 완성

핵심 내용:
- 도서 등록 폼 (POST /api/books)
- 도서 수정 페이지 (PUT /api/books/:id)
- 도서 삭제 (DELETE /api/books/:id)
- 폼 유효성 검사 (클라이언트 side)

Day 8 → Day 9 변경점:
- src/pages/BookForm.jsx 신규 (등록/수정 통합 폼)
- bookApi.js의 createBook / updateBook / deleteBook 실제 호출
- Route 추가: /books/new, /books/:id/edit
- 삭제 확인 모달

---

## 기술 스택
- React 18 + Vite 5
- Tailwind CSS 3
- React Router DOM 7
- Axios 1.6
- Spring Boot 3 (@RestController + @CrossOrigin)

## 응답 규칙
- 항상 호진님께 정중하고 격식 있는 한국어(존댓말)로 응답
- 각 Day마다 md / pptx / drawio / practice.zip 4종 생성
- drawio 생성 후 반드시 검증 실행
- zip에 node_modules 제외 확인
