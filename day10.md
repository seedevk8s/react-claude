# Day 10 — 로그인 / 인증 + Context API

> 대상: Spring Boot + Thymeleaf 경험자 취준생  
> 시나리오: BookStore 관리자 로그인 기능 + Context API로 전역 상태 관리

---

## 학습 목표

- **Context API**의 개념(createContext / Provider / useContext)을 이해한다
- `AuthContext`로 로그인 상태를 **전역**으로 관리한다
- `CartContext`로 장바구니 상태를 App.jsx에서 Context로 이동한다
- **PrivateRoute**로 인증이 필요한 페이지를 보호한다
- `useAuth` 커스텀 훅으로 Context를 편리하게 사용한다
- Spring Security + HttpSession ↔ Context API 대응 관계를 이해한다

---

## Thymeleaf / Spring Security 대응표

| Spring Boot / Spring Security | React |
|---|---|
| `HttpSession` (서버 세션) | `AuthContext` (클라이언트 상태) |
| `SecurityContextHolder` | `AuthContext.currentUser` |
| `@PreAuthorize("isAuthenticated()")` | `<PrivateRoute>` |
| `th:if="${#authorization.expression('isAuthenticated()')}"` | `{isLoggedIn && <...>}` |
| `@PostMapping("/login")` | `POST /api/auth/login` (Axios) |
| `@PostMapping("/logout")` | `POST /api/auth/logout` (Axios) |
| `UserDetails` | `user: { id, name, email, role }` |
| `@Component` / `@Service` 싱글톤 | Context Provider (전역 1개) |

---

## 1. Context API란?

### 문제: Props Drilling

```
App
├── Header (cartCount 필요)        ← props로 내려야 함
├── Home
│   └── BookCard (onAddCart 필요) ← props로 내려야 함
└── CartPage (cart 필요)           ← props로 내려야 함
```

> Day 9까지: App.jsx에서 cart state를 직접 props로 전달 → **Props Drilling**

### 해결: Context API

```
CartContext.Provider (전역 저장소)
├── Header     → useCart()로 직접 꺼내 씀
├── Home
│   └── BookCard → useCart()로 직접 꺼내 씀
└── CartPage   → useCart()로 직접 꺼내 씀
```

> **Context = 전역 상태 저장소**  
> Thymeleaf에서 `HttpSession`이나 `@SessionScope` 빈이 모든 곳에서 접근 가능한 것과 유사

---

## 2. Context API 3단계

```jsx
// ── 1단계: Context 생성 ─────────────────────────────
// ✏️ Thymeleaf: Spring이 ApplicationContext(빈 컨테이너) 생성하는 것과 비유
const AuthContext = createContext(null);

// ── 2단계: Provider로 값 제공 ────────────────────────
// ✏️ Thymeleaf: @Configuration + @Bean으로 빈을 등록하는 것과 비유
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}     {/* ← 하위 모든 컴포넌트가 value에 접근 가능 */}
    </AuthContext.Provider>
  );
}

// ── 3단계: useContext로 값 소비 ──────────────────────
// ✏️ Thymeleaf: @Autowired로 빈을 주입받는 것과 비유
function Header() {
  const { user } = useContext(AuthContext);  // 어디서든 바로 접근
  return <div>{user?.name}님 환영합니다</div>;
}
```

---

## 3. AuthContext 구현

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useState } from 'react';
import { loginApi, logoutApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ✏️ Thymeleaf: HttpSession에 저장된 로그인 사용자 정보
  // React: Context state로 관리
  const [user, setUser] = useState(() => {
    // 새로고침 시 localStorage에서 복원
    const saved = localStorage.getItem('bookstore_user');
    return saved ? JSON.parse(saved) : null;
  });

  const isLoggedIn = Boolean(user);

  // ✏️ @PostMapping("/login") 대응
  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    const userData = res.data;           // { id, name, email, role }
    setUser(userData);
    localStorage.setItem('bookstore_user', JSON.stringify(userData));
    return userData;
  };

  // ✏️ @PostMapping("/logout") 대응
  const logout = async () => {
    try { await logoutApi(); } catch {}  // API 실패해도 클라이언트는 초기화
    setUser(null);
    localStorage.removeItem('bookstore_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✏️ 커스텀 훅 — useContext(AuthContext)를 매번 쓰지 않아도 됨
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 사용 가능합니다');
  return ctx;
}
```

---

## 4. CartContext 구현

```jsx
// src/context/CartContext.jsx
// ✏️ Day 9까지: App.jsx에서 props로 전달 → Context로 이동

import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (book) => {
    setCart(prev => {
      if (prev.find(item => item.id === book.id)) return prev;
      return [...prev, book];
    });
  };

  const removeFromCart = (bookId) => {
    setCart(prev => prev.filter(item => item.id !== bookId));
  };

  const cartCount = cart.length;
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart는 CartProvider 안에서만 사용 가능합니다');
  return ctx;
}
```

---

## 5. PrivateRoute — 인증 보호

```jsx
// src/components/PrivateRoute.jsx
// ✏️ Spring Security: @PreAuthorize("isAuthenticated()") 와 동일
// 미인증 상태로 보호된 페이지 접근 시 /login으로 리다이렉트

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute() {
  const { isLoggedIn } = useAuth();
  
  // ✏️ Spring Security: 미인증 → 로그인 페이지 리다이렉트
  return isLoggedIn
    ? <Outlet />                         // 인증됨 → 자식 라우트 렌더링
    : <Navigate to="/login" replace />;  // 미인증 → /login으로 이동
}
```

### App.jsx에서 PrivateRoute 적용

```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  
  {/* ✏️ 이 Route 안의 모든 페이지는 로그인 필요 */}
  <Route element={<PrivateRoute />}>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="books/:id"      element={<BookDetail />} />
      <Route path="books/new"      element={<BookForm />} />
      <Route path="books/:id/edit" element={<BookForm />} />
      <Route path="cart"           element={<CartPage />} />
    </Route>
  </Route>
</Routes>
```

---

## 6. LoginPage 구현

```jsx
// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 이미 로그인된 상태면 홈으로 이동
  // ✏️ Spring Security: 이미 인증된 사용자는 /login 접근 시 홈으로 리다이렉트
  if (isLoggedIn) return <Navigate to="/" replace />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');   // 로그인 성공 → 홈으로
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">📚 BookStore 관리자</h1>
        <p className="login-subtitle">로그인하여 도서를 관리하세요</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>이메일</label>
            <input name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="admin@bookstore.com" />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input name="password" type="password" value={form.password}
              onChange={handleChange} placeholder="••••••••" />
          </div>

          {error && <p className="error-msg text-center">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        {/* 테스트용 힌트 */}
        <p className="login-hint">테스트: admin@bookstore.com / admin123</p>
      </div>
    </div>
  );
}
```

---

## 7. authApi.js

```javascript
// src/api/authApi.js
import api from './api';

// ✏️ @PostMapping("/auth/login") 대응
export const loginApi  = (data) => api.post('/auth/login', data);

// ✏️ @PostMapping("/auth/logout") 대응
export const logoutApi = ()     => api.post('/auth/logout');

// ✏️ 새로고침 시 세션 유효성 확인
export const getMeApi  = ()     => api.get('/auth/me');
```

---

## 8. App.jsx 최종 구조

```jsx
// ✏️ Provider 중첩 순서: Auth(바깥) → Cart(안쪽)
// Auth가 없으면 Cart 사용 불가능하므로 Auth가 더 바깥

<AuthProvider>
  <CartProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index             element={<Home />} />
            <Route path="books/:id"      element={<BookDetail />} />
            <Route path="books/new"      element={<BookForm />} />
            <Route path="books/:id/edit" element={<BookForm />} />
            <Route path="cart"           element={<CartPage />} />
            <Route path="*"              element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </CartProvider>
</AuthProvider>
```

---

## 9. Header에서 Context 활용

```jsx
// ✏️ Day 9: props로 cartCount 받음 → Day 10: useCart/useAuth로 직접 접근
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <header className="header">
      <Link to="/" className="header-logo">📚 BookStore</Link>
      <nav className="header-nav">
        {/* ✏️ th:if="${#authorization.expression('isAuthenticated()')}" */}
        {isLoggedIn && (
          <>
            <span className="text-sm text-indigo-200">{user.name}님</span>
            <Link to="/books/new" className="header-link">+ 도서 등록</Link>
            <Link to="/cart" className="header-link">
              🛒 장바구니
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <button onClick={logout} className="header-link">로그아웃</button>
          </>
        )}
      </nav>
    </header>
  );
}
```

---

## 10. Mock 로그인 (백엔드 없을 때)

```javascript
// src/api/authApi.js — Mock 모드

// ✏️ 백엔드 없이 테스트할 수 있는 목 로그인 함수
export const loginApi = async ({ email, password }) => {
  await new Promise(r => setTimeout(r, 600)); // 네트워크 딜레이 시뮬레이션
  if (email === 'admin@bookstore.com' && password === 'admin123') {
    return {
      data: { id: 1, name: '관리자', email, role: 'ADMIN' }
    };
  }
  // 실패 시 Axios처럼 에러 throw
  throw { response: { status: 401, data: { message: '인증 실패' } } };
};

export const logoutApi = async () => {
  await new Promise(r => setTimeout(r, 200));
  return { data: { message: 'ok' } };
};
```

---

## 11. Day 9 → Day 10 변경사항

```
Day 10 신규/변경 파일:
├── src/context/
│   ├── AuthContext.jsx        ← 🆕 로그인 전역 상태 + useAuth 훅
│   └── CartContext.jsx        ← 🆕 장바구니 전역 상태 + useCart 훅
├── src/api/
│   └── authApi.js             ← 🆕 로그인/로그아웃 API (Mock 포함)
├── src/pages/
│   └── LoginPage.jsx          ← 🆕 로그인 페이지
├── src/components/
│   ├── PrivateRoute.jsx       ← 🆕 인증 보호 라우트
│   └── Header.jsx             ← ✏️ props 제거 → useAuth/useCart 사용
└── src/App.jsx                ← ✏️ Provider 중첩 + PrivateRoute 적용
```

---

## 12. 실습 과제

| 번호 | 과제 |
|------|------|
| ① | 로그인 성공 후 Header에 사용자 이름 표시 확인 |
| ② | 미로그인 상태에서 `/books/new` 접근 시 `/login` 리다이렉트 확인 |
| ③ | 로그아웃 후 다시 미로그인 상태로 돌아오는지 확인 |
| ④ | (도전) 로그인 후 이전에 접근하려던 페이지로 자동 이동 (`location.state` 활용) |
| ⑤ | (도전) ADMIN 역할일 때만 도서 등록/수정/삭제 버튼 표시 (`user.role === 'ADMIN'`) |

---

## 오늘의 핵심 정리

| 개념 | 설명 |
|------|------|
| createContext | Context 객체 생성. Spring의 ApplicationContext와 비유 |
| Provider | 값을 하위 컴포넌트에 제공. Spring의 @Bean 등록과 비유 |
| useContext | Provider 값을 소비. Spring의 @Autowired와 비유 |
| 커스텀 훅 | `useAuth()`, `useCart()` — useContext 래핑으로 사용 편의성 향상 |
| PrivateRoute | Outlet으로 자식 라우트 보호. Spring Security @PreAuthorize와 대응 |
| localStorage | 새로고침 시 로그인 유지. 실무에서는 HttpOnly 쿠키 권장 |
