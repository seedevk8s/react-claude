# 📚 BookStore — React 전환 교육 프로젝트

> Spring Boot + Thymeleaf 경험자를 위한 12일 React 전환 커리큘럼 최종 결과물

---

## 🛠 기술 스택

| 분류 | 기술 |
|------|------|
| 프론트엔드 | React 18 + Vite 5 |
| 스타일 | Tailwind CSS 3 |
| 라우팅 | React Router DOM 7 |
| HTTP | Axios 1.6 |
| 상태 관리 | Context API (AuthContext, CartContext) |
| 백엔드 | Spring Boot 3 + @RestController |
| 웹서버 | Nginx (정적 서빙 + API 프록시) |
| CI/CD | GitHub Actions |

---

## 🚀 로컬 개발 실행

```bash
# 1. 환경변수 설정
cp .env.example .env.development

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행 (Spring Boot 백엔드 별도 실행 필요)
npm run dev
# → http://localhost:5173

# 테스트 계정: admin@bookstore.com / admin123
```

---

## 📦 프로덕션 빌드

```bash
npm run build       # dist/ 폴더 생성
npm run preview     # dist/ 로컬 미리보기 (port 4173)
```

---

## 🌐 Nginx 배포 (도전 과제)

```bash
# Docker로 로컬 테스트
npm run build
docker run -p 80:80 \
  -v $(pwd)/dist:/var/www/bookstore/dist \
  -v $(pwd)/nginx/bookstore.conf:/etc/nginx/conf.d/default.conf \
  nginx:alpine
```

---

## 📁 프로젝트 구조

```
src/
├── api/
│   ├── api.js          # axios 공통 인스턴스 (환경변수 적용)
│   ├── bookApi.js      # 도서 CRUD API
│   └── authApi.js      # 로그인/로그아웃 API (Mock 포함)
├── context/
│   ├── AuthContext.jsx # 로그인 전역 상태 + useAuth 훅
│   └── CartContext.jsx # 장바구니 전역 상태 + useCart 훅
├── hooks/
│   └── useFetch.js     # API 호출 커스텀 훅
├── utils/
│   └── notify.js       # 에러 알림 유틸리티
├── components/
│   ├── Header.jsx      # 헤더 (useAuth, useCart 사용)
│   ├── Layout.jsx      # 공통 레이아웃
│   ├── BookCard.jsx    # 도서 카드 (React.memo)
│   ├── PrivateRoute.jsx# 인증 보호 라우트
│   ├── ConfirmModal.jsx# 삭제 확인 모달
│   └── ErrorBoundary.jsx# 런타임 에러 경계
└── pages/
    ├── Home.jsx        # 도서 목록 (useFetch)
    ├── BookDetail.jsx  # 도서 상세 + 삭제
    ├── BookForm.jsx    # 도서 등록/수정
    ├── CartPage.jsx    # 장바구니
    ├── LoginPage.jsx   # 로그인
    └── NotFound.jsx    # 404
```

---

## 📅 Day별 커리큘럼

| Day | 주제 |
|-----|------|
| Day 1~2 | Vite + React 세팅, JSX 심화 |
| Day 3 | 컴포넌트 분리 |
| Day 4~5 | useState + 불변성 |
| Day 6 | useEffect + 데이터 로딩 |
| Day 7 | React Router |
| Day 8 | Axios + REST API 연동 |
| Day 9 | CRUD 완성 (폼/삭제) |
| Day 10 | Context API + 인증 |
| Day 11 | 통합 점검 + 코드 리뷰 |
| Day 12 | 빌드/배포 + 최종 발표 |
