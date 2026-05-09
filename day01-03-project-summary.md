# 📦 생성 완료 — 파일 구조 요약

---

## Day 01 — Vite + React 초기 세팅 (6파일)

```
day01-project/
├── index.html          ← SPA 진입점
├── package.json        ← 의존성 (pom.xml 역할)
├── vite.config.js      ← 설정 (application.properties 역할)
└── src/
    ├── main.jsx        ← 앱 시작점 (main() 메서드 역할)
    ├── App.jsx         ← Thymeleaf↔React 비교표, 폴더구조, 학습주제 렌더링
    └── index.css
```

---

## Day 02 — JSX 실습 (8파일)

```
day02-project/src/
├── App.jsx
└── components/
    ├── ConditionalSection.jsx   ← 조건부 렌더링 4패턴 (&&, 삼항, 함수, 동적 style)
    ├── ListSection.jsx          ← 리스트 4패턴 (단순/카드/테이블/filter+sort+map)
    └── JsxRulesSection.jsx      ← JSX 문법 규칙 7가지 (틀린코드↔올바른코드 비교)
```

---

## Day 03 — 컴포넌트 분리 (9파일)

```
day03-project/src/
├── App.jsx                  ← 데이터 보유 + Layout 조립
└── components/
    ├── Layout.jsx           ← children 슬롯 (th:fragment="content" 대응)
    ├── Header.jsx           ← 네비게이션 + 히어로 배너 (props: siteName, cartCount)
    ├── Footer.jsx           ← 링크 그룹 + 저작권
    └── ProductCard.jsx      ← 상품 카드 (props: product, onAddToCart / 뱃지·별점·할인율)
```

---

## 🚀 실행 방법 (각 Day 동일)

```bash
cd day01-project   # 또는 day02, day03
npm install
npm run dev        # http://localhost:3000 자동 실행
```
