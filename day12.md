# Day 12 — 빌드 / 배포 + 최종 발표

> 대상: Spring Boot + Thymeleaf 경험자 취준생  
> 시나리오: BookStore를 Vite로 빌드하고 Nginx + Spring Boot와 함께 배포한다

---

## 학습 목표

- `vite build`로 프로덕션 번들을 생성하는 과정을 이해한다
- **Nginx**를 이용해 React 정적 파일을 서빙하고 API 요청을 Spring Boot로 프록시한다
- **환경변수(`.env`)** 로 개발/운영 환경을 분리한다
- GitHub Actions 기반 **CI/CD 파이프라인** 흐름을 이해한다
- 12일 프로젝트 전체를 **기술 면접 관점**으로 정리한다

---

## Thymeleaf 배포 대응표

| Spring Boot + Thymeleaf | React + Vite |
|---|---|
| `mvn package` → `app.jar` | `vite build` → `dist/` 폴더 |
| `java -jar app.jar` (내장 Tomcat) | Nginx로 `dist/` 정적 파일 서빙 |
| `/` → Thymeleaf HTML 응답 | `/` → `index.html` (SPA) |
| `application.properties` 환경 분리 | `.env.development` / `.env.production` |
| `@CrossOrigin` 또는 Nginx 프록시 | Nginx `proxy_pass` → Spring Boot |

---

## 1. Vite 빌드 이해

### 개발 vs 프로덕션 비교

| 항목 | 개발 (`vite dev`) | 프로덕션 (`vite build`) |
|------|-------------------|------------------------|
| 서버 | Vite Dev Server (Node) | Nginx (정적 서빙) |
| 번들 | 없음 (ESM 직접 로드) | minify + 트리쉐이킹 |
| 출력 | 메모리 | `dist/` 폴더 |
| 소스맵 | 있음 | 옵션 (보안상 비활성 권장) |
| 환경변수 | `.env.development` | `.env.production` |

### 빌드 실행

```bash
npm run build

# 출력 구조
dist/
├── index.html          ← SPA 진입점 (모든 라우트)
├── assets/
│   ├── index-Abc12.js  ← JS 번들 (minify)
│   └── index-Xyz34.css ← CSS 번들
└── vite.svg
```

### 빌드 미리보기

```bash
npm run preview   # dist/ 를 로컬에서 서빙 (포트 4173)
```

---

## 2. 환경변수 분리

```bash
# .env.development (개발)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=BookStore (개발)

# .env.production (운영)
VITE_API_BASE_URL=https://api.bookstore.com/api
VITE_APP_TITLE=BookStore
```

```javascript
// src/api/api.js — 환경변수 적용
const api = axios.create({
  // ✏️ Thymeleaf: application.properties의 server.port, spring.datasource.url 와 동일
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
})
```

```javascript
// vite.config.js — 개발 환경 프록시 (운영에서는 Nginx가 담당)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```

> ⚠️ `.env` 파일은 반드시 `.gitignore`에 추가  
> ⚠️ `VITE_` 접두사가 있는 변수만 클라이언트 번들에 포함됨 (보안)

---

## 3. Nginx 설정

### 역할

```
[ 브라우저 ]
    │
    ▼
[ Nginx :80 ]
    ├── /           → dist/index.html  (React SPA 서빙)
    ├── /assets/*   → dist/assets/*    (JS/CSS 정적 파일)
    └── /api/*      → http://localhost:8080/api/*  (Spring Boot 프록시)
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name bookstore.com;

    # ── React 정적 파일 서빙 ──────────────────────────────
    root /var/www/bookstore/dist;
    index index.html;

    # ✏️ SPA 핵심: 모든 경로를 index.html로 fallback
    # /books/3, /cart 등 새로고침 시 404 방지
    location / {
        try_files $uri $uri/ /index.html;
    }

    # ── 정적 자산 캐싱 ────────────────────────────────────
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # ── Spring Boot API 프록시 ────────────────────────────
    # ✏️ Thymeleaf: 없음 (같은 서버). React는 분리되므로 프록시 필요
    location /api/ {
        proxy_pass         http://localhost:8080;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

> **SPA 핵심**: `try_files $uri /index.html` — React Router가 클라이언트에서 라우팅하므로  
> 서버는 모든 경로에서 `index.html`을 반환해야 새로고침 시 404가 발생하지 않는다.

---

## 4. 배포 절차 (수동)

```bash
# 1) 프로젝트 빌드
npm run build

# 2) dist/ 를 서버로 전송
scp -r dist/ ubuntu@your-server:/var/www/bookstore/

# 3) Nginx 재시작
sudo nginx -t          # 설정 검증
sudo systemctl reload nginx

# 4) Spring Boot 백엔드 실행
java -jar bookstore-api.jar --spring.profiles.active=prod
```

---

## 5. GitHub Actions CI/CD

```yaml
# .github/workflows/deploy.yml
name: BookStore Deploy

on:
  push:
    branches: [main]   # main 브랜치 push 시 자동 실행

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      # 1) 코드 체크아웃
      - uses: actions/checkout@v4

      # 2) Node.js 설치
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      # 3) 의존성 설치 + 빌드
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}

      # 4) 서버에 dist/ 배포 (rsync)
      - name: Deploy to Server
        uses: easingthemes/ssh-deploy@v5
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
          REMOTE_HOST: ${{ secrets.SERVER_HOST }}
          REMOTE_USER: ubuntu
          SOURCE: dist/
          TARGET: /var/www/bookstore/dist/

      # 5) Nginx reload
      - name: Reload Nginx
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ubuntu
          key: ${{ secrets.SSH_KEY }}
          script: sudo systemctl reload nginx
```

> **Thymeleaf 비유**:  
> GitHub Actions = Jenkins Pipeline / `mvn package` + `java -jar` 자동화와 동일

---

## 6. 배포 아키텍처 전체도

```
GitHub Repository
        │ git push (main)
        ▼
GitHub Actions (CI/CD)
  ├── npm ci + vite build → dist/
  └── SSH → 서버 배포 + Nginx reload
        │
        ▼
[ 운영 서버 ]
  ├── Nginx :80
  │     ├── / → dist/ (React SPA)
  │     └── /api/* → :8080 (프록시)
  └── Spring Boot :8080
        └── /api/books, /api/auth ...
              └── MySQL / PostgreSQL
```

---

## 7. 트러블슈팅 — 자주 겪는 배포 문제

| 증상 | 원인 | 해결 |
|------|------|------|
| 새로고침 시 404 | Nginx SPA fallback 누락 | `try_files $uri /index.html` 추가 |
| API 요청 실패 (CORS) | Nginx 프록시 미설정 | `location /api/` proxy_pass 추가 |
| 환경변수 undefined | `VITE_` 접두사 누락 | `VITE_API_BASE_URL` 형식 확인 |
| 빌드 파일 캐시 | 브라우저가 구버전 캐시 | `assets/` 해시 파일명 확인, 강제 새로고침 |
| Spring Boot CORS 오류 | `@CrossOrigin` 미설정 | `@CrossOrigin(origins = "https://bookstore.com")` |

---

## 8. 12일 커리큘럼 최종 정리

| Day | 주제 | 핵심 개념 |
|-----|------|----------|
| 1 | Vite + React 세팅 | JSX, 컴포넌트, Vite Dev Server |
| 2 | JSX 심화 | 조건부 렌더링, 리스트 렌더링, key |
| 3 | 컴포넌트 분리 | Header/Footer/Layout/BookCard |
| 4 | useState + 이벤트 | 상태 관리, 장바구니 기초 |
| 5 | useState 심화 | 불변성, 검색/필터/정렬 |
| 6 | useEffect | 데이터 로딩, 로딩/에러 UI |
| 7 | React Router | 멀티페이지, useParams, Navigate |
| 8 | Axios 연동 | REST API 연동, 인터셉터 |
| 9 | CRUD 완성 | 제어 컴포넌트, 폼 검증, 삭제 모달 |
| 10 | Context API | AuthContext, PrivateRoute, useAuth |
| 11 | 통합 점검 | useFetch, React.memo, 코드 리뷰 |
| 12 | 빌드/배포 | Vite 빌드, Nginx, CI/CD |

---

## 9. 기술 면접 최종 정리

**Q. Thymeleaf → React 전환에서 가장 크게 달라진 점은?**
> - **렌더링 위치**: 서버(Thymeleaf) → 클라이언트(React)  
> - **상태 관리**: 서버 세션 → 클라이언트 state/Context  
> - **라우팅**: Spring MVC @GetMapping → React Router (클라이언트)  
> - **API 통신**: 뷰에서 직접 → Axios로 REST 호출 후 JSON 처리

**Q. React SPA의 장단점은?**
> - 장점: 페이지 전환 빠름, 사용자 경험(UX) 우수, 프론트/백 완전 분리  
> - 단점: 초기 로딩 시간(JS 번들), SEO 불리 (SSR/SSG로 해결), 클라이언트 상태 복잡성

**Q. 이 프로젝트에서 배운 React 핵심 패턴은?**
> - 제어 컴포넌트(Controlled Component) — 폼 관리  
> - Context API — 전역 상태(Auth, Cart)  
> - 커스텀 훅(useFetch, useAuth) — 로직 재사용  
> - PrivateRoute — 클라이언트 인증 보호  
> - React.memo + useCallback — 성능 최적화

---

## 10. 실습 과제

| 번호 | 과제 |
|------|------|
| ① | `vite build` 실행 후 `dist/` 폴더 구조 확인 |
| ② | `.env.development` / `.env.production` 파일 작성 후 `import.meta.env.VITE_APP_TITLE` 출력 확인 |
| ③ | `npm run preview`로 프로덕션 빌드 로컬 미리보기 |
| ④ | (도전) Nginx 설정 파일 작성 후 Docker로 로컬 테스트 |
| ⑤ | (도전) GitHub Actions `deploy.yml` 작성하여 PR 시 빌드 검증 단계 추가 |

---

## 🎉 12일 과정 마무리

```
Day 1~12: Spring Boot + Thymeleaf → React 풀스택 전환 완성

여러분이 배운 것:
  ✅ Vite + React 18 프로젝트 구성
  ✅ 컴포넌트 설계 및 분리
  ✅ 상태 관리 (useState → Context API)
  ✅ REST API 연동 (Axios + Spring Boot)
  ✅ 인증/인가 (AuthContext + PrivateRoute)
  ✅ 코드 품질 (커스텀 훅, memo, 리팩토링)
  ✅ 빌드 및 배포 (Vite + Nginx + CI/CD)

다음 단계 추천:
  → TypeScript 전환 (타입 안정성)
  → React Query (서버 상태 관리 고도화)
  → Next.js (SSR / SSG / SEO)
  → 실제 AWS EC2 배포 경험
```
