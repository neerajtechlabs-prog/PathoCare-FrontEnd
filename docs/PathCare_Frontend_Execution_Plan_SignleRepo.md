# PathCare Labs — Frontend Execution Plan
### Senior Architect Edition | Solo Dev | 15–20 hrs/week | 20-Week Realistic Timeline

---

## 🏛️ ARCHITECT'S DECISIONS (Locked)

| # | Decision | Choice | Reason |
|---|---|---|---|
| 1 | Framework | **Next.js 14 — Pages Router** | Form-heavy, keyboard UX, SSR minimal. App Router = overkill. |
| 2 | UI Library | **shadcn/ui** | Copy-paste, zero lock-in, Tailwind native, Zod-native. Ant Design: heavy bundle, override hell. |
| 3 | Forms | **React Hook Form + Zod** | Uncontrolled = zero re-renders. Zod mirrors backend DTOs. |
| 4 | Server State | **TanStack Query v5** | Cache, refetch, Socket.io invalidation. |
| 5 | Client State | **Zustand + persist** | Auth only. NOT for server data. |
| 6 | API Client | **Axios** | Interceptors: X-Tenant-Slug header + JWT refresh in one place. |
| 7 | Real-time | **Socket.io Client** | JWT auth on handshake. Tenant room join. |
| 8 | Styling | **Tailwind CSS + CSS Variables** | Design tokens in `design-tokens.css`. |
| 9 | Types | **openapi-typescript codegen** | `src/generated/api-types.ts` — never write manually. CI enforces freshness. |
| 10 | E2E Testing | **Playwright** | Week 15 only. No unit tests on UI — solo dev time waste. |

---

## ⚠️ REALISTIC TIMELINE

> Master plan: 16 weeks total (backend + frontend parallel, multiple devs implied).
> You: Solo, 15-20 hrs/week, frontend only.
> **Adjusted: 20 weeks with 4-week buffer.**

**Average: 17 hrs/week × 20 weeks = 340 hrs total**

---

## 📚 PRE-WORK: Study Before Week 1
*(2-3 days per topic. Do alongside backend setup.)*

### Must Know (In This Order)

**1. TanStack Query v5** — Read these sections only:
- Quick Start → understand `useQuery`, `queryKey`, `queryFn`
- Mutations → understand `useMutation`, `onSuccess`, `invalidateQueries`
- `enabled` option → conditional queries
- `useQueryClient` → imperative cache access

**2. React Hook Form + Zod** — Read these sections:
- Get Started → `useForm`, `register`, `handleSubmit`, `formState.errors`
- Schema Validation → `zodResolver`, Zod basics
- `useWatch` → reacting to field changes (critical for booking auto-calc)
- `useFieldArray` → dynamic parameter fields in test form

**3. Zustand** — Read only:
- README Quick Start (15 min) → `create`, `useStore`
- `persist` middleware → survive page refresh

**4. shadcn/ui** — Run init, understand:
- Components copy into YOUR codebase (not from node_modules)
- `cn()` utility from `lib/utils.ts`
- How to add components: `npx shadcn@latest add [name]`

**5. Socket.io Client** — Read:
- Client API Initialization → `io()`, `auth` option (critical — JWT goes here)
- Events → `socket.on()`, `socket.off()` (cleanup in useEffect return)

---

## 🗓️ MONTH 1 — Foundation & Infrastructure (Weeks 1–4)
*Goal: Repo running, types generated, auth working, layout done*

---

### WEEK 1 — Project Setup + Tooling 🔴 BLOCKER
**15–18 hrs | Output: CI green, local dev running, skeleton structure**

#### Day 1 (3 hrs) — Repo + Framework Init
```bash
npx create-next-app@latest pathcare-web \
  --typescript --tailwind --eslint \
  --no-app --src-dir --import-alias "@/*"
cd pathcare-web
git init && git remote add origin <your-repo>
```

`tsconfig.json` paths — verify these exist:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

`.env.example` (commit this, never `.env.local`):
```bash
NEXT_PUBLIC_API_URL=http://api.pathcare.local:3001
NEXT_PUBLIC_SOCKET_URL=http://api.pathcare.local:3001
NEXT_PUBLIC_APP_DOMAIN=pathcare.local
NEXT_PUBLIC_DEV_TENANT=demo
```

Husky + lint-staged:
```bash
npm install -D husky lint-staged
npx husky init
```
`.husky/pre-commit`:
```bash
npx lint-staged
```
`package.json`:
```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "tsc-files --noEmit"]
}
```

#### Day 2 (3.5 hrs) — shadcn/ui + Design Tokens

```bash
npx shadcn@latest init
# Prompts: TypeScript=yes, Style=Default, Base color=Slate, CSS variables=yes
```

Install ALL components needed upfront (do this once, not week by week):
```bash
npx shadcn@latest add button input label card table badge dialog sheet \
  select dropdown-menu toast sonner command popover calendar separator \
  skeleton avatar tabs alert progress
```

`src/styles/design-tokens.css`:
```css
:root {
  /* Brand */
  --color-primary: #0f766e;         /* Teal-700 — clinical, trustworthy */
  --color-primary-hover: #0d6560;
  --color-primary-light: #ccfbf1;   /* Teal-100 — hover backgrounds */

  /* Status */
  --color-danger: #dc2626;          /* Red-600 — abnormal, critical */
  --color-warning: #d97706;         /* Amber-600 — TAT breach warning */
  --color-success: #16a34a;         /* Green-600 — delivered, normal */
  --color-info: #2563eb;            /* Blue-600 — info badges */

  /* Surface */
  --color-surface: #f8fafc;         /* Slate-50 — page background */
  --color-surface-raised: #ffffff;  /* Card/panel background */
  --color-border: #e2e8f0;          /* Slate-200 */
  --color-border-focus: #0f766e;    /* Primary for focused inputs */

  /* Typography */
  --color-text-primary: #0f172a;    /* Slate-900 */
  --color-text-secondary: #64748b;  /* Slate-500 */
  --color-text-muted: #94a3b8;      /* Slate-400 */

  /* Layout */
  --sidebar-width: 240px;
  --topbar-height: 56px;
  --spacing-page: 1.5rem;
  --radius-card: 0.5rem;
}
```

Import in `src/styles/globals.css`:
```css
@import './design-tokens.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Day 3 (3 hrs) — Exact Folder Structure

Create every folder and a placeholder `index.tsx` in each page:
```
src/
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── login.tsx
│   ├── dashboard/
│   │   ├── index.tsx               ← Owner summary
│   │   ├── booking/
│   │   │   ├── index.tsx           ← Booking list (date filter)
│   │   │   └── new.tsx             ← BookingForm (F1 shortcut)
│   │   ├── results/
│   │   │   ├── index.tsx           ← Workload dashboard (Socket.io live)
│   │   │   └── [bookingId].tsx     ← Result entry form (F2 → this)
│   │   ├── patients/
│   │   │   ├── index.tsx           ← Patient list
│   │   │   └── [id].tsx            ← Patient history
│   │   ├── masters/
│   │   │   ├── tests/
│   │   │   │   └── index.tsx
│   │   │   ├── doctors/
│   │   │   │   └── index.tsx
│   │   │   ├── departments/
│   │   │   │   └── index.tsx
│   │   │   └── sample-types/
│   │   │       └── index.tsx
│   │   ├── billing/
│   │   │   └── receipts.tsx        ← Balance receipt (F3 shortcut)
│   │   ├── mis/
│   │   │   ├── day-collection.tsx
│   │   │   └── day-register.tsx
│   │   └── settings/
│   │       ├── lab-profile.tsx
│   │       └── users.tsx
│   └── verify/
│       └── [code].tsx              ← PUBLIC: QR scan report page
├── components/
│   ├── ui/                         ← shadcn components (auto-generated here)
│   ├── layout/
│   │   ├── DashboardLayout.tsx
│   │   ├── Sidebar.tsx
│   │   └── KeyboardShortcuts.tsx
│   ├── booking/
│   │   ├── BookingForm.tsx         ← Most complex component
│   │   ├── TestSelector.tsx        ← Multi-select combobox
│   │   └── PatientAutocomplete.tsx ← Debounced search
│   ├── results/
│   │   ├── WorkloadTable.tsx
│   │   └── ResultEntryForm.tsx     ← Per-parameter inputs, abnormal highlight
│   ├── reports/
│   │   └── ReportPreview.tsx
│   └── common/
│       ├── DataTable.tsx           ← Reusable: sort, paginate, filter
│       ├── PageHeader.tsx          ← Title + breadcrumb + action slot
│       └── AbnormalBadge.tsx       ← Red/amber badge for result values
├── lib/
│   ├── api/
│   │   └── axios.ts
│   ├── tenant/
│   │   └── index.ts
│   ├── auth/
│   │   └── withAuth.tsx
│   └── socket/
│       └── socket.ts
├── store/
│   └── authStore.ts
├── hooks/
│   ├── useWorkload.ts
│   ├── useBookings.ts
│   ├── usePatients.ts
│   └── useTests.ts
├── generated/
│   └── api-types.ts               ← AUTO-GENERATED — commit to git, never edit
└── styles/
    ├── globals.css
    └── design-tokens.css
```

Placeholder content for every new page:
```tsx
// Paste this in every dashboard/*.tsx until you build it
export default function PlaceholderPage() {
  return <div className="p-8 text-gray-400">TODO: Build this page</div>;
}
```

#### Day 4 (3 hrs) — CI + Vercel

`.github/workflows/ci.yml`:
```yaml
name: Frontend CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      # API contract check — becomes active from Week 2
      # - name: Check API contract drift
      #   run: npm run gen:types:staging && git diff --exit-code src/generated/
      - run: npm run build
```

- [ ] Vercel account → connect `pathcare-web` repo
- [ ] Deploy to `pathcare-web.vercel.app` — verify green build (even Hello World)
- [ ] Set Vercel env vars: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`

#### Day 5 (3 hrs) — Tenant Resolution + Axios Skeleton

**`src/lib/tenant/index.ts`** — exact match to master plan:
```typescript
export function getTenantSlug(): string {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname;

  // Production: metropolis.pathcare.com → 'metropolis'
  // Staging: metropolis.pathcare.local → 'metropolis'
  // Local (single tenant): localhost → 'demo'
  if (hostname === 'localhost') {
    return process.env.NEXT_PUBLIC_DEV_TENANT ?? 'demo';
  }
  const parts = hostname.split('.');
  return parts[0]; // first segment is always the tenant slug
}
```

**`src/lib/api/axios.ts`** — skeleton only (401 retry completed Week 3):
```typescript
import axios from 'axios';
import { getTenantSlug } from '@/lib/tenant';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // send httpOnly cookies
});

api.interceptors.request.use((config) => {
  config.headers['X-Tenant-Slug'] = getTenantSlug();
  return config;
});

export default api;
```

**`/etc/hosts`** — add these lines:
```
127.0.0.1  metropolis.pathcare.local
127.0.0.1  api.pathcare.local
127.0.0.1  demo.pathcare.local
```
> ⚠️ **Do NOT use `localhost`** for development — cross-domain cookie behavior will break auth in Week 3. Use `.pathcare.local` from Day 1.

**✅ Week 1 Done Criteria:**
- [ ] `npm run dev` → Next.js runs on 3000
- [ ] `metropolis.pathcare.local:3000` → app loads (not localhost)
- [ ] GitHub Actions CI → green
- [ ] Vercel deploy → green
- [ ] All placeholder pages render without errors

---

### WEEK 2 — OpenAPI Codegen + TanStack Query Setup 🔴 BLOCKER
**15–17 hrs | Output: Types generated from real backend, first API call working**

> **Coordinate with backend:** Need `GET /api-docs-json` endpoint ready.
> If not ready, ask for an `openapi-spec.json` file to run codegen against.

#### Day 1 (3 hrs) — openapi-typescript

```bash
npm install -D openapi-typescript
```

`package.json` scripts:
```json
"scripts": {
  "gen:types": "openapi-typescript http://api.pathcare.local:3001/api-docs-json -o src/generated/api-types.ts",
  "gen:types:staging": "openapi-typescript https://api-staging.pathcare.com/api-docs-json -o src/generated/api-types.ts",
  "gen:types:file": "openapi-typescript ./openapi-spec.json -o src/generated/api-types.ts"
}
```

Run it:
```bash
npm run gen:types        # against local backend
# OR
npm run gen:types:file   # against spec file if backend not ready
```

- [ ] `src/generated/api-types.ts` created and committed to git
- [ ] **Never** add `src/generated/` to `.gitignore` — it must be in repo so builds work without backend

**Activate CI contract check** — uncomment in `ci.yml`:
```yaml
- name: Check API contract drift
  run: |
    npm run gen:types:staging
    git diff --exit-code src/generated/ || \
    (echo "❌ API drift detected — run gen:types and commit" && exit 1)
  env:
    SKIP_CONTRACT_CHECK: ${{ vars.SKIP_CONTRACT_CHECK }}
```
This is a **hard merge blocker** from now on. Never disable it.

#### Day 2 (3 hrs) — TanStack Query Setup

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools @tanstack/react-table
```

**`src/pages/_app.tsx`**:
```typescript
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '@/styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,       // 2 min default
      retry: 1,
      refetchOnWindowFocus: false,     // Lab app — don't surprise users
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

#### Day 3 (3 hrs) — Zustand Auth Store

```bash
npm install zustand
```

**`src/store/authStore.ts`**:
```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type UserRole =
  | 'SuperAdmin'
  | 'LabAdmin'
  | 'Receptionist'
  | 'LabTechnician'
  | 'Doctor';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  tenantSlug: string;
}

interface AuthStore {
  user: User | null;
  tenantSlug: string;
  isAuth: boolean;
  accessToken: string | null;       // In-memory only — for Socket.io auth
  setAuth: (user: User, tenantSlug: string, token?: string) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      tenantSlug: '',
      isAuth: false,
      accessToken: null,
      setAuth: (user, tenantSlug, token) =>
        set({ user, tenantSlug, isAuth: true, accessToken: token ?? null }),
      setToken: (token) => set({ accessToken: token }),
      clearAuth: () =>
        set({ user: null, tenantSlug: '', isAuth: false, accessToken: null }),
    }),
    {
      name: 'pathcare-auth',
      storage: createJSONStorage(() => sessionStorage),
      // sessionStorage: clears on tab close — more secure than localStorage
    }
  )
);

// Non-hook accessor for use outside React (axios interceptor, socket.ts)
export const getAccessToken = () => useAuthStore.getState().accessToken;
```

> **Note on `accessToken`:** The httpOnly cookie handles API auth automatically.
> We store token in Zustand ONLY for Socket.io handshake auth (not accessible via cookie from JS).

#### Day 4 (3 hrs) — Axios 401 Interceptor (skeleton — complete in Week 3)

```typescript
// src/lib/api/axios.ts — full version
import axios, { AxiosRequestConfig } from 'axios';
import { getTenantSlug } from '@/lib/tenant';

// Extend config type for _retry flag
interface RetryableRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request: add tenant slug header
api.interceptors.request.use((config) => {
  config.headers['X-Tenant-Slug'] = getTenantSlug();
  return config;
});

// Response: handle 401 with silent refresh + retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequestConfig;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;  // prevent infinite loop
      try {
        // refresh token is in httpOnly cookie — just call the endpoint
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return api(originalRequest); // retry with new cookie
      } catch {
        // Refresh also failed — force logout
        const { clearAuth } = await import('@/store/authStore')
          .then(m => m.useAuthStore.getState());
        clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Day 5 (3 hrs) — First Real API Call Verification

Write a test page to verify everything works:
```typescript
// src/pages/dashboard/index.tsx (temporary test)
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: () => api.get('/health').then(r => r.data),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: check console</div>;
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

- [ ] Open `metropolis.pathcare.local:3000/dashboard`
- [ ] Verify API call goes with `X-Tenant-Slug: metropolis` header (DevTools → Network)
- [ ] Verify response cached in React Query DevTools

**✅ Week 2 Done Criteria:**
- [ ] `src/generated/api-types.ts` exists and has real types from backend
- [ ] CI contract check runs and passes
- [ ] TanStack Query DevTools visible in browser
- [ ] Zustand auth store initialized (verify in React DevTools)
- [ ] API call with `X-Tenant-Slug` header works (check Network tab)

---

### WEEK 3 — Authentication System 🔴 CRITICAL
**15–17 hrs | Output: Login → cookie → dashboard working, RBAC enforced**

#### Day 1 (3 hrs) — Login Page

```bash
npm install @hookform/resolvers zod
```

**`src/pages/login.tsx`**:
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import api from '@/lib/api/axios';
import { useAuthStore } from '@/store/authStore';
import { getTenantSlug } from '@/lib/tenant';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Minimum 8 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: (data: LoginForm) =>
      api.post('/auth/login', data).then(r => r.data),
    onSuccess: (data) => {
      setAuth(data.user, getTenantSlug(), data.accessToken);
      router.replace('/dashboard');
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message ?? 'Login failed';
      toast.error(msg);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[--color-surface]">
      <div className="w-full max-w-sm p-8 bg-white rounded-[--radius-card] shadow-sm border border-[--color-border]">
        <h1 className="text-2xl font-semibold text-[--color-text-primary] mb-6">
          PathCare Labs
        </h1>
        <form onSubmit={handleSubmit((d) => login(d))} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && (
              <p className="text-sm text-[--color-danger] mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <p className="text-sm text-[--color-danger] mt-1">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

#### Day 2 (2.5 hrs) — withAuth HOC

**`src/lib/auth/withAuth.tsx`**:
```typescript
import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore, UserRole } from '@/store/authStore';

export function withAuth<P extends object>(
  Component: ComponentType<P>,
  allowedRoles?: UserRole[]
) {
  return function AuthenticatedPage(props: P) {
    const { isAuth, user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
      if (!isAuth) {
        router.replace('/login');
        return;
      }
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Wrong role — redirect to dashboard (not 403 page)
        router.replace('/dashboard');
      }
    }, [isAuth, user, router]);

    // Prevent flash of protected content
    if (!isAuth) return null;
    if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;

    return <Component {...props} />;
  };
}
```

Usage pattern (use this on EVERY dashboard page):
```typescript
// At bottom of every page file:
export default withAuth(PageComponent, ['LabAdmin', 'Receptionist']);
// Or for all authenticated users:
export default withAuth(PageComponent);
```

#### Day 3 (3 hrs) — Sidebar + Role-Based Navigation

**`src/components/layout/Sidebar.tsx`** — shortcut badges match `KeyboardShortcuts.tsx` exactly: Dashboard has no shortcut; Workload shows F2; Patients shows F5.
```typescript
import { useRouter } from 'next/router';
import { useAuthStore, UserRole } from '@/store/authStore';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  shortcut?: string;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' }, // no dedicated shortcut
  {
    label: 'New Booking',
    href: '/dashboard/booking/new',
    shortcut: 'F1',
    roles: ['Receptionist', 'LabAdmin', 'SuperAdmin'],
  },
  {
    label: 'Bookings',
    href: '/dashboard/booking',
    roles: ['Receptionist', 'LabAdmin', 'SuperAdmin'],
  },
  {
    label: 'Workload',
    href: '/dashboard/results',
    shortcut: 'F2', // F4 is a silent duplicate handled in KeyboardShortcuts, not shown here
    roles: ['LabTechnician', 'LabAdmin', 'SuperAdmin'],
  },
  {
    label: 'Patients',
    href: '/dashboard/patients',
    shortcut: 'F5',
    roles: ['Receptionist', 'LabAdmin', 'SuperAdmin'],
  },
  // Masters section — LabAdmin only
  { label: 'Tests', href: '/dashboard/masters/tests', roles: ['LabAdmin', 'SuperAdmin'] },
  { label: 'Doctors', href: '/dashboard/masters/doctors', roles: ['LabAdmin', 'SuperAdmin'] },
  { label: 'Departments', href: '/dashboard/masters/departments', roles: ['LabAdmin', 'SuperAdmin'] },
  { label: 'Sample Types', href: '/dashboard/masters/sample-types', roles: ['LabAdmin', 'SuperAdmin'] },
  // Billing
  {
    label: 'Balance Receipts',
    href: '/dashboard/billing/receipts',
    shortcut: 'F3',
    roles: ['Receptionist', 'LabAdmin', 'SuperAdmin'],
  },
  // MIS
  { label: 'Day Collection', href: '/dashboard/mis/day-collection', roles: ['LabAdmin', 'SuperAdmin'] },
  { label: 'Day Register', href: '/dashboard/mis/day-register', roles: ['LabAdmin', 'SuperAdmin'] },
  // Settings
  { label: 'Lab Profile', href: '/dashboard/settings/lab-profile', roles: ['LabAdmin', 'SuperAdmin'] },
  { label: 'Users', href: '/dashboard/settings/users', roles: ['LabAdmin', 'SuperAdmin'] },
];
```

#### Day 4 (3 hrs) — DashboardLayout

**`src/components/layout/DashboardLayout.tsx`**:
```typescript
import { Sidebar } from './Sidebar';
import { KeyboardShortcuts } from './KeyboardShortcuts';
import { useAuthStore } from '@/store/authStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, clearAuth } = useAuthStore();
  const qc = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      clearAuth();
      qc.clear(); // clear ALL cached data on logout
      window.location.href = '/login';
    },
  });

  return (
    <div className="flex h-screen bg-[--color-surface]">
      <KeyboardShortcuts />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[--topbar-height] bg-white border-b border-[--color-border]
                           flex items-center justify-between px-6">
          <h1 className="font-semibold text-[--color-text-primary]">
            {title ?? 'PathCare Labs'}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[--color-text-secondary]">
              {user?.firstName} — {user?.role}
            </span>
            <button
              onClick={() => logout()}
              className="text-sm text-[--color-text-secondary] hover:text-[--color-danger]"
            >
              Logout
            </button>
          </div>
        </header>
        {/* Page content */}
        <main className="flex-1 overflow-auto p-[--spacing-page]">
          {children}
        </main>
      </div>
    </div>
  );
}
```

#### Day 5 (3 hrs) — Apply withAuth + Test All Auth Scenarios

- [ ] Apply `withAuth` to `/dashboard/index.tsx`
- [ ] Test: unauthenticated → `/dashboard` → redirects to `/login` ✓
- [ ] Test: login with wrong password → toast error ✓
- [ ] Test: login success → redirected to `/dashboard` ✓
- [ ] Test: Receptionist tries `/dashboard/masters/tests` → redirected to `/dashboard` ✓
- [ ] Test: logout → store cleared → `/login` ✓

**✅ Week 3 Done Criteria:**
- [ ] Login → cookie → dashboard flow works end-to-end
- [ ] Role-based sidebar shows correct items per role
- [ ] withAuth redirects unauthorized users correctly
- [ ] Logout clears Zustand + TanStack Query cache

---

### WEEK 4 — Keyboard Shortcuts + Socket.io + Common Components
**14–16 hrs | Output: F1-F5 working, Socket.io connected, DataTable ready**

#### Day 1 (3 hrs) — KeyboardShortcuts (exact per master plan)

**`src/components/layout/KeyboardShortcuts.tsx`** — matches master plan exactly, and is the single source of truth the Sidebar now mirrors:
```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Block shortcuts when typing in form fields
      if (e.target instanceof HTMLInputElement) return;
      if (e.target instanceof HTMLTextAreaElement) return;
      if (e.target instanceof HTMLSelectElement) return;

      const shortcuts: Record<string, string> = {
        'F1': '/dashboard/booking/new',    // New Booking
        'F2': '/dashboard/results',         // Workload Dashboard
        'F3': '/dashboard/billing/receipts',// Balance Receipt
        'F4': '/dashboard/results',         // Workload (same as F2 per plan)
        'F5': '/dashboard/patients',        // Patients
      };

      if (shortcuts[e.key]) {
        e.preventDefault();
        router.push(shortcuts[e.key]);
        return;
      }

      // Ctrl+S — save current form
      // Forms listen for 'form:save' on window (not document, not custom)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('form:save'));
      }

      // Esc — go back (only outside form fields — already handled above)
      if (e.key === 'Escape') {
        router.back();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router]);

  return null; // No UI — just event listeners
}
```

In forms that support Ctrl+S:
```typescript
// Add this useEffect to any form component:
useEffect(() => {
  const handler = () => handleSubmit(onSubmit)();
  window.addEventListener('form:save', handler);
  return () => window.removeEventListener('form:save', handler);
}, [handleSubmit, onSubmit]);
```

#### Day 2 (2.5 hrs) — Socket.io Client (corrected)

```bash
npm install socket.io-client
```

**`src/lib/socket/socket.ts`** — corrected: JWT goes in `auth.token`, not `withCredentials` alone:
```typescript
import { io, Socket } from 'socket.io-client';
import { getAccessToken } from '@/store/authStore';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: {
        // Backend validates this JWT on WebSocket handshake
        token: getAccessToken(),
      },
      withCredentials: true,
      transports: ['websocket', 'polling'], // websocket first, polling fallback
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });
  }
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  s.on('connect', () => {
    console.log('[Socket] Connected:', s.id);
  });
  return s;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
```

Connect in `_app.tsx` after login (add to login mutation `onSuccess`):
```typescript
// In login.tsx onSuccess:
import { connectSocket } from '@/lib/socket/socket';
// ...
onSuccess: (data) => {
  setAuth(data.user, getTenantSlug(), data.accessToken);
  connectSocket(); // connects with token from store
  router.replace('/dashboard');
},
```

Disconnect on logout:
```typescript
// In DashboardLayout logout mutation onSuccess:
import { disconnectSocket } from '@/lib/socket/socket';
onSuccess: () => {
  disconnectSocket();
  clearAuth();
  qc.clear();
  window.location.href = '/login';
},
```

#### Day 3 (3 hrs) — DataTable Common Component

```typescript
// src/components/common/DataTable.tsx
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { Skeleton } from '@/components/ui/skeleton';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, any>[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  isLoading,
  emptyMessage = 'No records found.',
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="text-center py-16 text-[--color-text-muted]">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="border border-[--color-border] rounded-[--radius-card] overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-[--color-surface] border-b border-[--color-border]">
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(h => (
                <th key={h.id} className="px-4 py-3 text-left font-medium text-[--color-text-secondary]">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-[--color-border]">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-[--color-surface] transition-colors">
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="px-4 py-3 text-[--color-text-primary]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### Day 4 (2.5 hrs) — PageHeader + AbnormalBadge

```typescript
// src/components/common/PageHeader.tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void; };
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-semibold text-[--color-text-primary]">{title}</h2>
        {subtitle && <p className="text-sm text-[--color-text-secondary] mt-0.5">{subtitle}</p>}
      </div>
      {action && (
        <Button onClick={action.onClick}>{action.label}</Button>
      )}
    </div>
  );
}
```

```typescript
// src/components/common/AbnormalBadge.tsx
interface AbnormalBadgeProps {
  value: string;
  isAbnormal: boolean;
  isCritical: boolean;
}

export function AbnormalBadge({ value, isAbnormal, isCritical }: AbnormalBadgeProps) {
  if (isCritical) {
    return (
      <span className="inline-flex items-center gap-1 font-bold text-[--color-danger]">
        {value}
        <span className="text-xs bg-[--color-danger] text-white px-1 rounded">CRITICAL</span>
      </span>
    );
  }
  if (isAbnormal) {
    return <span className="font-semibold text-[--color-warning]">{value}</span>;
  }
  return <span>{value}</span>;
}
```

#### Day 5 (3 hrs) — Verify Socket + End-to-End Test

- [ ] Open browser → login → check DevTools → Network → WS tab
- [ ] Verify WebSocket connection established
- [ ] Verify tenant room joined (backend logs should show: `Client joined tenant:metropolis`)
- [ ] Apply `withAuth` to all dashboard pages created so far
- [ ] Verify F1 → navigates to `/dashboard/booking/new`
- [ ] Verify Ctrl+S dispatches `form:save` event (check in console with temp listener)

**✅ Week 4 Done Criteria:**
- [ ] F1 → New Booking page ✓
- [ ] F2 → Workload page ✓
- [ ] F3 → Receipts page ✓
- [ ] Ctrl+S → `form:save` event in console ✓
- [ ] Socket.io WS connection visible in DevTools ✓
- [ ] DataTable renders with mock data ✓

---

## 🗓️ MONTH 2 — Core Masters + Booking (Weeks 5–8)

---

### WEEK 5 — Test Catalog Module 🔴 BLOCKER for Booking
**16–18 hrs | Output: Tests CRUD + search + CSV import**

**Custom Hook Pattern** (use for every module from here on):
```typescript
// src/hooks/useTests.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';

// Query keys — centralized, prevents typos
export const TEST_KEYS = {
  all: ['tests'] as const,
  list: (params: Record<string, any>) => ['tests', 'list', params] as const,
  search: (q: string) => ['tests', 'search', q] as const,
};

export function useTests(params: { page?: number; search?: string; limit?: number }) {
  return useQuery({
    queryKey: TEST_KEYS.list(params),
    queryFn: () => api.get('/tests', { params }).then(r => r.data),
  });
}

export function useTestSearch(query: string) {
  return useQuery({
    queryKey: TEST_KEYS.search(query),
    queryFn: () =>
      api.get('/tests/search', { params: { q: query } }).then(r => r.data),
    enabled: query.length >= 2,     // min 2 chars to search
    staleTime: 1000 * 60 * 60,     // 1hr — matches backend Redis TTL
  });
}

export function useCreateTest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.post('/tests', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TEST_KEYS.all });
    },
  });
}

export function useUpdateTest(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => api.put(`/tests/${id}`, data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: TEST_KEYS.all });
    },
  });
}
```

**Test Zod Schema** — with gender-specific ranges (from DB schema):
```typescript
const parameterSchema = z.object({
  name: z.string().min(1, 'Parameter name required'),
  unit: z.string().optional(),
  sortOrder: z.number().default(0),
  // Gender-specific ranges — all optional
  normalRangeMaleMin: z.number().nullable().optional(),
  normalRangeMaleMax: z.number().nullable().optional(),
  normalRangeFemaleMin: z.number().nullable().optional(),
  normalRangeFemaleMax: z.number().nullable().optional(),
  normalRangeChildMin: z.number().nullable().optional(),
  normalRangeChildMax: z.number().nullable().optional(),
  normalRangeText: z.string().nullable().optional(), // "Negative", "Not Detected"
  isCriticalCheck: z.boolean().default(false),
  criticalLow: z.number().nullable().optional(),
  criticalHigh: z.number().nullable().optional(),
});

const testSchema = z.object({
  name: z.string().min(1, 'Test name required'),
  code: z.string().min(1, 'Test code required'),
  departmentId: z.string().uuid('Select a department'),
  sampleTypeId: z.string().uuid('Select a sample type'),
  tatHours: z.number().min(1, 'TAT must be at least 1 hour').default(24),
  rate: z.number().min(0, 'Rate cannot be negative'),
  parameters: z.array(parameterSchema).min(1, 'At least one parameter required'),
});
```

**Days 1-2:** Test list page + DataTable (columns: Name, Code, Dept, Sample, TAT, Rate, Params, Status, Actions)

**Days 3-4:** Create/Edit Drawer with nested parameters using `useFieldArray`:
```typescript
const { fields, append, remove, move } = useFieldArray({
  control,
  name: 'parameters',
});
// "Add Parameter" → append({ name: '', unit: '', ... })
// "Remove" → remove(index)
```

**Day 5:** CSV Import Modal:
```typescript
// Flow: File picker → preview 5 rows → POST /tests/bulk-import → result summary
// Show: "150 imported, 3 errors" with error row details
```

**✅ Week 5 Done:** Tests CRUD working, search returns results in 2+ chars, CSV import works

---

### WEEK 6 — Doctor Master + Patient Registration 🔴 BLOCKER
**16–18 hrs**

**Patient schema** — exact match to DB:
```typescript
const patientSchema = z.object({
  firstName: z.string().min(1, 'First name required'),
  lastName: z.string().optional(),
  phone: z.string().length(10, 'Must be 10 digits'),
  alternatePhone: z.string().length(10).optional().or(z.literal('')),
  dob: z.date().optional(),
  // age: computed from dob, not a separate field in DB
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Select gender' }),
  address: z.string().optional(),
  city: z.string().optional(),
  pincode: z.string().max(10).optional(),
  // ⚠️ Security: ONLY last 4 digits — max 4 char input, no full Aadhaar
  aadhaarLast4: z.string().max(4).optional(),
});
```

**DOB ↔ Age auto-calculation:**
```typescript
const dob = useWatch({ control, name: 'dob' });
// When DOB changes → compute approximate age to display (not stored)
const displayAge = dob
  ? Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000))
  : null;
```

**Patient Search Autocomplete** — debounced, used in BookingForm:
```typescript
// src/components/booking/PatientAutocomplete.tsx
// Uses shadcn Command + Popover
// Shows: [UID] Name — Phone on each option
// Debounced 300ms, min 3 chars
// TanStack Query staleTime: 30s
```

**Doctor schema:**
```typescript
const doctorSchema = z.object({
  name: z.string().min(1),
  specialization: z.string().optional(),
  phone: z.string().length(10).optional().or(z.literal('')),
  email: z.string().email().optional().or(z.literal('')),
  commissionPercent: z.number().min(0).max(100).default(0),
  isActive: z.boolean().default(true),
});
```

**✅ Week 6 Done:** Patient UID generated (PC-2025-0001), search autocomplete works, Doctor CRUD works

---

### WEEK 7 — Booking Form Part 1 🔴 BLOCKER — Most Complex
**18–20 hrs | SINGLE FOCUS WEEK**

> ⚠️ This is the most complex component. Give it full attention. No multitasking.

**Booking Schema** — critical: `balanceAmount` is computed, not stored in DB. `paymentMode` uses the 5 lowercase DB values.
```typescript
const bookingSchema = z.object({
  // Patient
  patientId: z.string().uuid().optional(),
  isNewPatient: z.boolean().default(false),
  newPatient: z.object({
    firstName: z.string().min(1),
    phone: z.string().length(10),
    gender: z.enum(['male', 'female', 'other']),
    age: z.number().optional(),
  }).optional(),

  // Doctor (optional — walk-in allowed)
  doctorId: z.string().uuid().optional(),

  // Tests (min 1)
  tests: z.array(z.object({
    testId: z.string().uuid(),
    testName: z.string(),   // SNAPSHOT at booking time
    rate: z.number(),       // SNAPSHOT at booking time
  })).min(1, 'Select at least one test'),

  // Payment
  totalAmount: z.number(),       // sum of test rates — auto-calculated
  discountAmount: z.number().default(0),
  // netAmount = totalAmount - discountAmount — computed client-side
  paidAmount: z.number().min(0),
  paymentMode: z.enum(['cash', 'upi', 'card', 'cheque', 'online']), // matches DB payment_mode exactly
  // balanceAmount = netAmount - paidAmount — NEVER sent to API (computed in DB)
  remarks: z.string().optional(),
}).refine(data => {
  const netAmount = data.totalAmount - data.discountAmount;
  return data.paidAmount <= netAmount;
}, {
  message: 'Paid amount cannot exceed net amount',
  path: ['paidAmount'],
});
```

**Auto-calculation with useWatch:**
```typescript
const tests = useWatch({ control, name: 'tests' });
const discountAmount = useWatch({ control, name: 'discountAmount' });

useEffect(() => {
  const total = tests.reduce((sum, t) => sum + (t.rate ?? 0), 0);
  const net = total - (discountAmount ?? 0);
  setValue('totalAmount', total, { shouldValidate: false });
  // Don't setValue for net — display it computed, don't store
}, [tests, discountAmount, setValue]);
```

**Days 1-2:** Schema + patient section (existing patient autocomplete OR new patient mini-form)

**Day 3:** TestSelector — multi-select combobox with search, rates auto-fill

**Day 4:** Payment section (5 modes: cash/upi/card/cheque/online) + Ctrl+S

**Day 5:** Working slip print (browser `window.print()`, hidden print div, no Puppeteer)

**✅ Week 7 Done:** Complete booking created, auto-calc works, working slip prints

---

### WEEK 8 — Booking List + Balance Receipt 🔴 BLOCKER
**15–17 hrs**

**Booking list filters:**
- Date picker (default: today)
- Status: active / completed / cancelled
- Search by patient name or booking number

**Balance receipt** (F3 shortcut):
- Search pending balance bookings
- Show: Total / Paid / Balance
- Payment form: amount + mode (cash/upi/card/cheque/online)
- Submit → `POST /bookings/:id/receipts`
- Print receipt on success

**Barcode label print:**
```css
/* @media print — thermal label style */
@page { size: 50mm 25mm; margin: 0; }
.print-label { width: 50mm; font-size: 8pt; }
```

**Cancellation modal:**
- Admin-only button (hide for Receptionist)
- Reason text required (min 10 chars)
- `DELETE /bookings/:id` with body `{ remark }`

**✅ Week 8 Done:** Booking list with filters, balance receipt works, cancellation (admin) works

---

## 🗓️ MONTH 3 — Results, Reports, Delivery (Weeks 9–12)

---

### WEEK 9 — Workload Dashboard + Result Entry 🔴 BLOCKER
**17–19 hrs | Heaviest Socket.io week**

**useWorkload hook** — corrected from v1:
```typescript
// src/hooks/useWorkload.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import api from '@/lib/api/axios';
import { getSocket } from '@/lib/socket/socket';

export function useWorkload() {
  const qc = useQueryClient();

  useEffect(() => {
    const socket = getSocket();

    const handler = () => {
      qc.invalidateQueries({ queryKey: ['workload'] });
    };

    socket.on('workload:updated', handler);

    // Cleanup — critical to prevent memory leaks
    return () => {
      socket.off('workload:updated', handler);
    };
  }, [qc]);

  return useQuery({
    queryKey: ['workload'],
    queryFn: () => api.get('/results/workload').then(r => r.data),
    staleTime: 30_000, // 30s — Socket.io handles instant updates
  });
}
```

**TAT color function:**
```typescript
function getTATColor(createdAt: string, tatHours: number): string {
  const elapsedHours = (Date.now() - new Date(createdAt).getTime()) / 3_600_000;
  const percentage = elapsedHours / tatHours;
  if (percentage < 0.5) return 'text-green-600';   // < 50% TAT used
  if (percentage < 1.0) return 'text-amber-600';   // 50-100% TAT used
  return 'text-red-600 font-bold animate-pulse';    // TAT breached
}
```

**Result Entry — value is VARCHAR in DB** (not number):
```typescript
// test_results.value is VARCHAR — can be "Negative", "12.5", "Not Detected"
// Input: always text input
// Abnormal check: try parseFloat, compare to ranges
// If non-numeric text → isAbnormal stays false

const checkAbnormal = (value: string, min?: number, max?: number): boolean => {
  const num = parseFloat(value);
  if (isNaN(num)) return false; // text result — no range check
  if (min != null && num < min) return true;
  if (max != null && num > max) return true;
  return false;
};
```

**Gender-aware range display** — from test_parameters:
```typescript
// Show the correct range based on patient gender
const getRange = (param: TestParameter, gender: string) => {
  if (gender === 'male')
    return { min: param.normalRangeMaleMin, max: param.normalRangeMaleMax };
  if (gender === 'female')
    return { min: param.normalRangeFemaleMin, max: param.normalRangeFemaleMax };
  return { min: param.normalRangeChildMin, max: param.normalRangeChildMax };
};
```

**✅ Week 9 Done:** 3 browser tabs open → enter result → all 3 update. TAT colors correct.

---

### WEEK 10 — PDF Report Integration
**14–16 hrs | PDF generation is backend — frontend is integration only**

**Report status polling:**
```typescript
export function useReportStatus(bookingId: string) {
  return useQuery({
    queryKey: ['reports', bookingId, 'status'],
    queryFn: () =>
      api.get(`/reports/${bookingId}/status`).then(r => r.data),
    refetchInterval: (query) => {
      // Poll every 3s while processing, auto-stop when ready
      return query.state.data?.status === 'processing' ? 3000 : false;
    },
    staleTime: 0,
  });
}
```

**Socket.io report:ready event:**
```typescript
useEffect(() => {
  const socket = getSocket();
  const handler = ({ bookingId: id, pdfUrl }: { bookingId: string; pdfUrl: string }) => {
    if (id !== bookingId) return;
    toast.success('Report ready!', {
      action: {
        label: 'Open PDF',
        onClick: () => window.open(pdfUrl, '_blank'),
      },
      duration: 10_000,
    });
    qc.invalidateQueries({ queryKey: ['reports', id] });
  };
  socket.on('report:ready', handler);
  return () => socket.off('report:ready', handler);
}, [bookingId, qc]);
```

**Verify page** (`/verify/[code]`) — public, no `withAuth`:
- QR scan → shows patient name, tests, lab name, date
- "Download Report" button (presigned S3 URL — expires in 1hr)
- Handle expired URL gracefully: "This link has expired. Please contact the lab."

**Notification delivery status:**
```typescript
// In booking detail — show SMS/WhatsApp status from notification_logs
// status: 'queued' | 'sent' | 'failed'
// Icons: ◌ queued, ✓ sent (green), ✗ failed (red)
// "Resend" button on failed
```

**✅ Week 10 Done:** Generate → loading → report opens in new tab. Verify page works. Resend works.

---

### WEEK 11 — Lab Profile + Settings Screens
**14–16 hrs**

**Lab Profile form fields (all from DB schema):**
```typescript
const labProfileSchema = z.object({
  labName: z.string().min(1),
  address: z.string(),
  phone: z.string(),
  email: z.string().email().optional().or(z.literal('')),
  registrationNo: z.string().optional(),
  footerText: z.string().optional(),
  // Logo: S3 presigned URL upload
  logoS3Url: z.string().optional(),
  // Signatories: dynamic list
  reportSignatory: z.array(z.object({
    name: z.string().min(1),
    designation: z.string(),
    signatureS3Url: z.string().optional(), // uploaded signature image
  })),
  // Letterhead config (JSONB in DB)
  letterheadConfig: z.object({
    primaryColor: z.string().default('#0f766e'),
    fontFamily: z.string().default('Arial'),
    logoPosition: z.enum(['left', 'center', 'right']).default('left'),
  }),
});
```

**Logo + Signature Upload (presigned URL pattern):**
```typescript
async function uploadToS3(file: File, uploadType: 'logo' | 'signature'): Promise<string> {
  // 1. Get presigned URL from backend
  const { uploadUrl, fileKey } = await api
    .get(`/lab-profile/${uploadType}-upload-url`, {
      params: { fileName: file.name, fileType: file.type }
    })
    .then(r => r.data);

  // 2. Upload directly to S3 (PUT to presigned URL)
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  // 3. Return the fileKey (stored in DB, not the full presigned URL)
  return fileKey;
}
```

**User Management:**
- List: Name, Email, Role, Status (active/inactive), Last Login
- Create: name, email, role, temp password
- Toggle active/inactive (no delete — soft disable per audit requirements)
- Role options: LabAdmin, Receptionist, LabTechnician, Doctor

**Department + Sample Type:** Simple CRUD, same DataTable pattern

**✅ Week 11 Done:** Lab profile saves with logo. Signatory list dynamic. User CRUD works.

---

### WEEK 12 — MIS + Day Collection
**14–16 hrs**

**Day Collection summary cards:**
```typescript
// Format all amounts as Indian Rupees
const formatINR = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
// Output: ₹23,450
```

Cards to show:
- Total Bookings: 47
- Total Billed: ₹23,450
- Total Collected: ₹18,200
- Total Pending: ₹5,250
- Cash: ₹12,000 | UPI: ₹4,000 | Card: ₹2,200 | Cheque: ₹0 | Online: ₹0

**Excel export (blob download):**
```typescript
const { mutate: exportExcel } = useMutation({
  mutationFn: (date: string) =>
    api.get('/mis/day-collection/export', {
      params: { date },
      responseType: 'blob',
    }).then(r => r.data),
  onSuccess: (blob, date) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `day-collection-${date}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  },
});
```

**Print CSS (sidebar/topbar hidden):**
```css
@media print {
  .sidebar, .topbar { display: none !important; }
  main { padding: 0 !important; }
  .no-print { display: none !important; }
}
```

**✅ Week 12 Done:** Day Collection shows correct totals. Excel downloads. Print hides sidebar.

---

## 🗓️ MONTH 4 — Polish, Security, Launch (Weeks 13–16)

---

### WEEK 13 — Integration Testing + Bug Sprint
**15–17 hrs | No new features — test and fix everything**

**E2E Flow Checklist (test manually, step by step):**
- [ ] Register new patient → UID generated (`PC-YYYY-XXXX`)
- [ ] Create booking (new patient + 3 tests + partial payment) → booking no + barcode shown
- [ ] Print working slip
- [ ] Enter results → abnormal values highlight amber
- [ ] Enter critical value → red + alert banner shown
- [ ] Verify workload updates in separate browser tab (Socket.io test)
- [ ] Generate PDF report → report:ready event → PDF opens
- [ ] Verify page (`/verify/[code]`) → shows correct patient info
- [ ] Balance receipt → payment collected → booking paid_amount updated
- [ ] Cancel booking (LabAdmin) → shows in list as cancelled
- [ ] Day Collection MIS → totals correct for today

**TanStack Query Cache Audit:**
```typescript
// Every mutation that changes data → verify it invalidates:
// useCreateTest → invalidates TEST_KEYS.all ✓
// useCreateBooking → invalidates ['bookings'] ✓
// useSubmitResults → invalidates ['workload'] AND ['bookings', bookingId] ✓
// useCreateReceipt → invalidates ['bookings'] AND ['reports', bookingId] ✓
```

**Role access audit — try these as Receptionist:**
- [ ] `/dashboard/masters/tests` → should redirect to `/dashboard`
- [ ] Cancel booking button → should not appear
- [ ] `/dashboard/settings/users` → should redirect

**OpenAPI sync:**
```bash
npm run gen:types
git diff src/generated/api-types.ts  # review any changes
git add src/generated/ && git commit -m "chore: sync api types"
```

---

### WEEK 14 — Security Hardening
**14–16 hrs**

**Frontend security checklist:**

- [ ] **Aadhaar audit**: `grep -r "aadhaar" src/` → verify ONLY `aadhaarLast4`, max 4-char input, no full number anywhere
- [ ] **XSS audit**: `grep -r "dangerouslySetInnerHTML" src/` → must return zero results
- [ ] **Console.log audit**: `grep -r "console.log" src/` → remove all that expose user data or API responses
- [ ] **`accessToken` exposure**: verify it's in sessionStorage (closes on tab close), never in localStorage
- [ ] **Expired presigned URL**: test by opening old PDF link → show "This link has expired" message, not a broken S3 error
- [ ] **Auth edge case**: Delete cookies manually → verify app redirects to login cleanly
- [ ] **Expired refresh token**: Force expire → verify both cookies cleared → login redirect
- [ ] **Slow 3G test**: DevTools → Network → Slow 3G → all pages show skeletons, no white screens
- [ ] **Role spoofing**: Manually change role in sessionStorage → verify server still rejects with 403

**UX Edge Cases:**
- [ ] Empty booking list (new lab) — proper empty state with CTA
- [ ] Booking with 10+ tests — TestSelector must handle long lists
- [ ] Patient name with special chars (Singh, O'Brien) — form handles
- [ ] Slow network simulation (DevTools → Network throttle → Slow 3G) — loading states visible

---

### WEEK 15 — Performance + Playwright E2E
**15–17 hrs**

**Performance Wins (Frontend):**
```typescript
// 1. Dynamic imports for heavy components
const BookingForm = dynamic(() => import('@/components/booking/BookingForm'), {
  loading: () => <Skeleton />,
});

// 2. Image optimization
<Image src={logoUrl} width={200} height={80} alt="Lab Logo" priority />

// 3. Memoize expensive components
const MemoizedDataTable = React.memo(DataTable);
```

**Playwright Setup:**
```bash
npm install -D @playwright/test
npx playwright install chromium
```

`playwright.config.ts`:
```typescript
export default {
  testDir: './tests',
  use: {
    baseURL: 'http://metropolis.pathcare.local:3000',
    video: 'on-first-retry',
  },
};
```

Example test:
```typescript
// tests/booking-flow.spec.ts
test('complete booking flow', async ({ page }) => {
  await page.goto('http://metropolis.pathcare.local:3000/login');
  await page.fill('[name=email]', 'admin@test.com');
  await page.fill('[name=password]', 'password123');
  await page.click('button[type=submit]');
  await expect(page).toHaveURL('/dashboard');

  // F1 → new booking
  await page.keyboard.press('F1');
  await expect(page).toHaveURL('/dashboard/booking/new');
  // ... fill form, submit, verify booking number shown
});
```

Write tests for:
- [ ] Login flow (happy path + wrong password)
- [ ] Booking creation flow (happy path)
- [ ] Result entry flow
- [ ] Balance receipt flow

---

### WEEK 16 — Onboarding Wizard + Production Launch 🚀
**15–18 hrs**

**Onboarding Wizard (5 steps, shown to new tenant on first login):**
```typescript
// /onboarding.tsx — no DashboardLayout, minimal chrome
// Step detection: check if lab_profile.lab_name is empty → show onboarding

const STEPS = [
  { id: 1, title: 'Lab Details', fields: ['labName', 'address', 'phone'] },
  { id: 2, title: 'Logo Upload', fields: ['logoS3Url'] },
  { id: 3, title: 'Departments', fields: ['departments'] }, // pre-fill 4 defaults
  { id: 4, title: 'Admin User', fields: [] }, // already created — just confirm
  { id: 5, title: 'Test Catalog', fields: [] }, // CSV import or skip
];

// Pre-fill departments:
const DEFAULT_DEPARTMENTS = [
  'Biochemistry', 'Haematology', 'Microbiology', 'Serology'
];
```

**Demo Tenant:**
- [ ] `demo.pathcare.com` — pre-loaded fixture data
- [ ] "Try Demo" button on marketing site (not your job — but test the demo tenant works)

**Production environment checklist:**
- [ ] Vercel Pro activated (`*.pathcare.com` wildcard needs Pro plan)
- [ ] Env vars in Vercel: `NEXT_PUBLIC_API_URL=https://api.pathcare.com`
- [ ] `NEXT_PUBLIC_SOCKET_URL=https://api.pathcare.com`
- [ ] Sentry setup:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```
- [ ] Source maps disabled in production (don't expose code):
```javascript
// next.config.js
const nextConfig = {
  productionBrowserSourceMaps: false,
};
```
- [ ] Test on `metropolis.pathcare.com` → cookie sets with `Domain=.pathcare.com` ✓
- [ ] Test on Chrome + Firefox + Safari (cross-browser cookie test)

---

## 🗓️ WEEKS 17–20 — Buffer + Stabilization

### Week 17-18: Overflow Buffer
Use for: features that slipped, UX polish, pilot lab feedback fixes

### Week 19: Pilot Lab Session
- Sit with first pilot lab for their first real booking session
- Note every UX friction point
- Fix top 5 issues immediately

### Week 20: Phase 2 Preparation
Research (don't build yet):
- Doctor commission statement (Month 5 target)
- Radiology module — Quill.js rich text editor
- Offline PWA — IndexedDB + sync queue architecture

---

## 📦 COMPLETE DEPENDENCY LIST

```bash
# Framework (from create-next-app)
# next react react-dom typescript tailwindcss

# UI Components
npx shadcn@latest add [all components listed in Week 1]

# Forms + Validation
npm install react-hook-form @hookform/resolvers zod

# Server State + Table
npm install @tanstack/react-query @tanstack/react-query-devtools @tanstack/react-table

# Client State
npm install zustand

# API + Real-time
npm install axios socket.io-client

# Utilities
npm install date-fns          # date formatting throughout app
npm install clsx tailwind-merge  # cn() utility (shadcn dependency)

# Dev Tools
npm install -D openapi-typescript      # type generation from backend
npm install -D @playwright/test        # E2E testing (Week 15)
npm install -D @sentry/nextjs          # error monitoring (Week 16)
npm install -D husky lint-staged       # pre-commit hooks
```

---

## 🧠 LEARNING GUIDE — For New Concepts

### TanStack Query — In This Order

| Step | What to Learn | Where to Use |
|---|---|---|
| 1 | `useQuery` — `queryKey`, `queryFn`, `isLoading` | Every data fetch |
| 2 | `useMutation` — `onSuccess`, `onError` | Every POST/PUT/DELETE |
| 3 | `invalidateQueries` | After every mutation |
| 4 | `useQueryClient` | Access cache in non-component code |
| 5 | `enabled` | Conditional fetch (search min chars) |
| 6 | `refetchInterval` | PDF status polling |
| 7 | `staleTime` | Control how long cache is "fresh" |

### Zustand — In This Order

| Step | What to Learn | Where to Use |
|---|---|---|
| 1 | `create` — basic store | authStore |
| 2 | `persist` + `sessionStorage` | Auth survives refresh, clears on tab close |
| 3 | `useAuthStore()` in components | All protected pages |
| 4 | `useAuthStore.getState()` outside React | axios interceptor, socket.ts |

### React Hook Form + Zod — In This Order

| Step | What to Learn | Where to Use |
|---|---|---|
| 1 | `useForm` + `register` + `handleSubmit` | Login, all forms |
| 2 | `zodResolver` + Zod basics | Schema validation |
| 3 | `formState.errors` | Show error messages |
| 4 | `useWatch` | Booking auto-calculation |
| 5 | `useFieldArray` | Test parameters (dynamic fields) |
| 6 | `setValue` | Auto-fill rates when test selected |

---

## ⚡ STANDARD PAGE TEMPLATE

```typescript
// src/pages/dashboard/masters/tests/index.tsx
import { useState } from 'react';
import { withAuth } from '@/lib/auth/withAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/common/DataTable';
import { PageHeader } from '@/components/common/PageHeader';
import { useTests } from '@/hooks/useTests';
// import TestDrawer from '@/components/masters/TestDrawer'; // build separately

function TestsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTests({ search, page });

  return (
    <DashboardLayout title="Test Catalog">
      <PageHeader
        title="Test Catalog"
        subtitle={`${data?.total ?? 0} tests`}
        action={{ label: '+ Add Test', onClick: () => setDrawerOpen(true) }}
      />
      <div className="mb-4">
        <input
          placeholder="Search tests..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="border px-3 py-2 rounded text-sm w-64"
        />
      </div>
      <DataTable
        data={data?.items ?? []}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No tests found. Click '+ Add Test' to create one."
      />
      {/* <TestDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} /> */}
    </DashboardLayout>
  );
}

export default withAuth(TestsPage, ['LabAdmin', 'SuperAdmin']);
```

**Standard Mutation Pattern:**
```typescript
const { mutate, isPending } = useMutation({
  mutationFn: (data) => api.post('/endpoint', data).then(r => r.data),
  onSuccess: () => {
    toast.success('Saved successfully');
    queryClient.invalidateQueries({ queryKey: ['resource'] });
    onClose(); // close drawer/modal
  },
  onError: (error: any) => {
    toast.error(error.response?.data?.message ?? 'Something went wrong');
  },
});
```

---

## 🚨 MISTAKES TO AVOID

| ❌ Wrong | ✅ Right | Why |
|---|---|---|
| Store API data in Zustand | Use TanStack Query | Zustand = auth state only |
| `useEffect` for data fetching | `useQuery` | Built-in loading/error/cache |
| Manually type API responses | `npm run gen:types` | Single source of truth |
| `localhost` in dev | `.pathcare.local` | Cookie SameSite behavior breaks on localhost |
| `innerHTML` with user data | Never — XSS risk | Use React JSX always |
| Full Aadhaar in any form | `aadhaarLast4` only | Legal + security requirement |
| New `io()` call per component | `getSocket()` singleton | One WS connection per app |
| `console.log(user)` in production | Sentry for errors | Exposes PII |
| Storing `balanceAmount` state | Compute: `total - discount - paid` | Not stored in DB — computed |
| `document.dispatchEvent` for Ctrl+S | `window.dispatchEvent` | Master plan uses `window` |
| Open PDF URLs directly from DB | Use presigned URL from API | S3 bucket is private |
| Skip `_retry` flag on 401 | Always add `_retry = true` | Prevents infinite loop |
| Sidebar shortcut label disagrees with `KeyboardShortcuts.tsx` | Sidebar always mirrors the shortcuts map | Prevents F-key mislabeling |
| `paymentMode` enum drifting from DB values | Keep it as `['cash','upi','card','cheque','online']` everywhere | Prevents form/DB/report mismatches |

---

## 📊 HOUR ALLOCATION

| Period | Weeks | Hrs/Week | Focus |
|---|---|---|---|
| Month 1 | 1–4 | 15–18 | Foundation, Auth, Layout |
| Month 2 | 5–8 | 16–19 | Masters, Booking (heaviest) |
| Month 3 | 9–12 | 14–17 | Results, Reports, MIS |
| Month 4 | 13–16 | 14–17 | Testing, Security, Launch |
| Buffer | 17–20 | 10–15 | Overflow, Pilot feedback |

**Total: ~320–360 hrs over 20 weeks**

---

## 🔗 QUICK REFERENCE — API ENDPOINTS (Frontend Calls)

| Module | Method | Endpoint | Used In |
|---|---|---|---|
| Auth | POST | `/auth/login` | Login page |
| Auth | POST | `/auth/refresh` | Axios interceptor |
| Auth | POST | `/auth/logout` | Sidebar logout |
| Tests | GET | `/tests?page=&search=` | Tests list |
| Tests | GET | `/tests/search?q=` | BookingForm TestSelector |
| Tests | POST | `/tests` | Create test |
| Tests | PUT | `/tests/:id` | Edit test |
| Tests | POST | `/tests/bulk-import` | CSV import |
| Doctors | GET | `/doctors` | Doctor list + booking form |
| Patients | GET | `/patients/search?q=` | PatientAutocomplete |
| Patients | POST | `/patients` | Register patient |
| Patients | GET | `/patients/:id/history` | Patient history modal |
| Bookings | POST | `/bookings` | BookingForm submit |
| Bookings | GET | `/bookings?date=&status=` | Booking list |
| Bookings | DELETE | `/bookings/:id` | Cancel booking |
| Bookings | POST | `/bookings/:id/receipts` | Balance receipt |
| Results | GET | `/results/workload` | Workload dashboard |
| Results | POST | `/results/:bookingId` | Result entry |
| Reports | POST | `/reports/:bookingId/generate` | Generate button |
| Reports | GET | `/reports/:bookingId/status` | Status polling |
| Reports | GET | `/verify/:code` | Public verify page |
| Notifications | POST | `/notifications/:bookingId/resend` | Resend button |
| Lab Profile | GET/PUT | `/lab-profile` | Settings |
| Lab Profile | GET | `/lab-profile/logo-upload-url` | Logo upload |
| Users | GET/POST | `/users` | User management |
| Users | PATCH | `/users/:id/deactivate` | Toggle active |
| MIS | GET | `/mis/day-collection?date=` | Day Collection |
| MIS | GET | `/mis/day-register?date=` | Day Register |
| MIS | GET | `/mis/day-collection/export?date=` | Excel export |
| Departments | GET/POST/PUT | `/departments` | Department master |
| Sample Types | GET/POST/PUT | `/sample-types` | Sample type master |

---

*PathCare Labs Frontend Execution Plan*
*Stack: Next.js 14 (Pages Router) · shadcn/ui · TanStack Query v5 · Zustand · React Hook Form + Zod · Socket.io · Axios · openapi-typescript · Playwright*
*Generated: July 2026*
