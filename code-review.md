# Code Review: QA Live Healthcare

**Project**: qa-live-healthcare
**Stack**: Vue 3 + TypeScript + Vite + Ant Design Vue
**Date**: 2026-05-11
**Review Scope**: Full codebase (initial commit)

---

## Executive Summary

This is a **frontend-only prototype/demo** for a Chinese-language online healthcare consultation platform. The codebase is small (~19 source files) and appears to be a first-draft scaffold. While the UI is polished and the Vue 3 Composition API usage is modern, there are significant concerns around **security, data persistence, test coverage, and production readiness**. The application in its current form is suitable only as a visual demo or proof-of-concept.

**Overall Rating: Needs Major Improvements**

| Category | Rating |
|---|---|
| Architecture | Fair |
| Security | Poor |
| Code Quality | Fair |
| Test Coverage | None |
| Performance | Good |
| Accessibility | Fair |
| DevOps/CI | None |

---

## 1. Critical Issues

### 1.1 Plaintext Passwords in Source Code

**File**: `src/data/doctor-user-list.json`
**Severity**: CRITICAL

All doctor accounts share the hardcoded password `123456`, stored in plaintext JSON committed to the repository. Even as a demo, this establishes a dangerous pattern.

```json
"password": "123456"
```

**Recommendation**: Remove passwords from source code entirely. Even for a demo, use environment variables or a mock auth service. If credentials must exist, never commit real passwords.

### 1.2 Client-Side Authentication with No Backend

**File**: `src/store/index.ts:59-68`

The `loginDoctor` method performs authentication by comparing plaintext credentials in memory:

```ts
loginDoctor(username: string, password: string): Doctor | null {
  const doctor = state.doctors.find(
    d => d.username === username && d.password === password
  );
```

This means anyone can bypass authentication by inspecting the browser's source or calling `store.loginDoctor()` from the dev console. The "authentication" provides zero security.

**Recommendation**: Even for a prototype, simulate a backend API layer with proper token-based auth. At minimum, don't store passwords client-side.

### 1.3 No Data Persistence

**File**: `src/store/index.ts`

All state lives in a Vue `reactive()` object. Every page refresh resets all data (questions, patients, doctor sessions) to the seed JSON. Users lose all interactions instantly.

**Recommendation**: Add at minimum `localStorage` persistence for the store, or integrate a backend API.

### 1.4 Patient Identity "Verification" is Trivially Bypassed

**File**: `src/store/index.ts:74-92`, `src/views/Consultation.vue:43-48`

Patient verification uses only name + birthday, and the UI explicitly tells users they can enter anything:

```html
<a-alert
  message="提示"
  description="输入任意姓名和生日即可使用。首次输入会自动创建账户..."
/>
```

For a healthcare application, this is especially concerning. Any user can impersonate any patient by knowing their name and birthday.

**Recommendation**: Implement proper patient authentication (phone verification, ID number, etc.) before any production use.

---

## 2. Security Issues

### 2.1 Password Stored in Reactive State

**File**: `src/store/index.ts:6-17`

The `Doctor` interface includes `password` as a field, meaning the full password is accessible in the reactive state tree and visible in Vue DevTools.

```ts
export interface Doctor {
  id: string;
  username: string;
  password: string;  // Should never be in client-side state
  ...
}
```

**Recommendation**: Never include passwords in client-side data models. The Doctor type used in UI should omit the password field.

### 2.2 External Image Dependencies

**Files**: `src/views/Home.vue:31`, `src/components/AppHeader.vue:5`, `src/data/doctor-user-list.json`

Multiple images are loaded from `images.pexels.com`. This creates:
- Privacy concerns (third-party tracking via image loads)
- Availability risk (if Pexels changes URLs or goes down, the app breaks)
- No CSP or SRI protection against image source tampering

**Recommendation**: Download and self-host all images as static assets.

### 2.3 No Route Guards

**File**: `src/router/index.ts`

The doctor room route (`/doctor/room/:username`) has no navigation guard. While `DoctorRoom.vue` checks authentication in `onMounted`, the brief flash of content before redirect is a poor UX and potential info leak.

**Recommendation**: Add `beforeEach` route guards to protect authenticated routes.

---

## 3. Code Quality Issues

### 3.1 Unused Component: HelloWorld.vue

**File**: `src/components/HelloWorld.vue`

This is the default Vite starter template component, never imported or used anywhere.

**Recommendation**: Remove dead code.

### 3.2 Duplicated Global CSS Reset

**Files**: `src/App.vue:17-30`, `src/style.css`

Both files define overlapping global resets (`margin: 0; padding: 0; box-sizing: border-box`). `style.css` is imported in `main.ts` and `App.vue` also has a global `<style>` block with similar resets.

**Recommendation**: Consolidate global styles into one location (`style.css`) and use scoped styles in `App.vue`.

### 3.3 Magic Delay with `setTimeout`

**Files**: `src/views/Consultation.vue:282-298`, `src/views/DoctorLogin.vue:80-91`, `src/views/DoctorRoom.vue:200-208`

All submit/login operations use `setTimeout(() => { ... }, 500)` to simulate async behavior. This is misleading and doesn't represent real error scenarios.

```ts
setTimeout(() => {
  // ... actual logic
  submitting.value = false;
}, 500);
```

**Recommendation**: Either remove the artificial delay (it adds no value) or replace with a proper async service layer that can handle real errors.

### 3.4 Non-Null Assertions

**File**: `src/views/Consultation.vue:110`, `src/views/DoctorRoom.vue:84`

```ts
formatTime(question.answerTime!)
```

Non-null assertions bypass TypeScript's null safety. `answerTime` can genuinely be `null` for pending questions. While the template guards with `v-if`, the assertion is still a code smell.

**Recommendation**: Use a conditional or default value instead of the `!` operator:
```ts
formatTime(question.answerTime ?? '')
```

### 3.5 `Date.now()` for ID Generation

**File**: `src/store/index.ts:81,109`

```ts
id: `patient${Date.now()}`
id: `q${Date.now()}`
```

Using `Date.now()` for IDs creates collision risk if two entities are created within the same millisecond (e.g., rapid form submissions). It also leaks timing information.

**Recommendation**: Use `crypto.randomUUID()` or a simple incrementing counter.

### 3.6 Inconsistent Statistics Naming

**File**: `src/store/index.ts:145-157`

```ts
const activeSessions = state.questions.filter(q => q.status === 'pending').length;
const totalSessions = state.doctors.filter(d => d.isActive).length;
```

`activeSessions` counts pending questions, while `totalSessions` counts active doctors. These are semantically different metrics with confusing names. "Sessions" is ambiguous here.

**Recommendation**: Rename to `pendingQuestions` and `activeDoctors` respectively for clarity.

### 3.7 Unused Variable Check in verifyPatient

**File**: `src/views/Consultation.vue:230-234`

```ts
const existingPatientCount = store.state.patients.filter(
  p => p.name === authForm.name && p.birthday === birthday
).length;

store.verifyPatient(authForm.name, birthday);
```

The count is computed before calling `verifyPatient`, but `verifyPatient` itself already does the same lookup internally. This is duplicated logic. The count check is only used to show a different message, but it creates a race condition -- the filter runs before the store is updated.

**Recommendation**: Have `verifyPatient` return whether the patient is new or existing, eliminating the separate filter.

### 3.8 Empty Script Setup in AppFooter

**File**: `src/components/AppFooter.vue:39-40`

```html
<script setup lang="ts">
</script>
```

The `<script setup>` block is empty but present.

**Recommendation**: Remove the empty script block entirely.

---

## 4. Architecture & Design Issues

### 4.1 No State Management Library

**File**: `src/store/index.ts`

The app uses a hand-rolled reactive store with methods. While this works for a small prototype, it lacks:
- DevTools integration (Pinia provides excellent Vue DevTools support)
- SSR compatibility
- Plugin system (persistence, logging)
- Proper computed property reactivity

**Recommendation**: Migrate to Pinia for production. The current store structure is already close to a Pinia store, making migration straightforward.

### 4.2 No API Service Layer

There is no abstraction between the UI and data access. Views directly call `store.*` methods and access `store.state.*`. This tight coupling makes it difficult to swap in a real backend later.

**Recommendation**: Create a service/API layer (e.g., `src/services/`) that the store calls, so views are decoupled from the data source.

### 4.3 No Error Boundaries or Error Handling

There is no global error handler, no error boundaries, and no try/catch in any async operation. If anything goes wrong (clipboard API failure, missing data, etc.), the user gets no feedback.

**Recommendation**: Add `app.config.errorHandler` in `main.ts` and add error boundaries for critical components.

### 4.4 No 404 Route

**File**: `src/router/index.ts`

There is no catch-all route for unmatched URLs. Navigating to an undefined path shows a blank page.

**Recommendation**: Add a catch-all route:
```ts
{ path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
```

### 4.5 Hardcoded Chinese Strings (No i18n)

All user-facing text is hardcoded in Chinese within Vue templates. There is no internationalization framework.

**Recommendation**: For a production healthcare app, integrate `vue-i18n` or similar, especially if multi-language support is ever needed.

---

## 5. Missing Infrastructure

### 5.1 No Tests

Zero test coverage. No test framework installed, no test scripts, no test files.

**Recommendation**: Add Vitest + Vue Test Utils. At minimum:
- Unit tests for store methods
- Component tests for Consultation and DoctorRoom views
- E2E tests for critical user flows (Cypress/Playwright)

### 5.2 No Linting or Formatting

No ESLint, Prettier, Stylelint, or commit hooks. This leads to inconsistent code style and no automated quality gates.

**Recommendation**: Add ESLint with `@vue/eslint-config-typescript`, Prettier, and `lint-staged` with `husky` for pre-commit hooks.

### 5.3 No CI/CD Pipeline

No GitHub Actions, GitLab CI, Jenkinsfile, or any automated pipeline.

**Recommendation**: Add a CI pipeline that runs lint, type-check, build, and tests on every push/PR.

### 5.4 No Environment Configuration

The `.env` file is empty. There is no distinction between development/production environments, no configurable API URLs, no feature flags.

**Recommendation**: Use Vite's built-in `.env` support with `VITE_` prefixed variables for API endpoints and feature flags.

### 5.5 No Dockerfile or Deployment Config

No containerization or deployment configuration exists.

**Recommendation**: Add a `Dockerfile` with a multi-stage build (build stage + nginx serve stage) for production deployment.

---

## 6. UX/Accessibility Issues

### 6.1 Fixed Header Without Skip Navigation

**File**: `src/components/AppHeader.vue:67-71`

The header is `position: fixed` with `z-index: 1000`, but there is no skip-to-content link for keyboard/screen reader users.

### 6.2 Missing Alt Text on Decorative Images

Doctor avatar images use `:alt="doctor.name"` which is good, but the hero image uses a generic `alt="Healthcare"`.

### 6.3 No Loading States for Initial Data

The app loads seed data synchronously so there are no loading states, but when a real backend is added, none of the views have skeleton/loading patterns prepared.

### 6.4 Clipboard API Without Fallback

**File**: `src/views/DoctorRoom.vue:162-165`

```ts
navigator.clipboard.writeText(roomUrl.value);
```

The Clipboard API is not supported in all browsers (notably older Safari and non-HTTPS contexts). There is no fallback or error handling.

**Recommendation**: Add a fallback using `document.execCommand('copy')` or use a library like `clipboard-copy`.

### 6.5 Mobile Navigation

The header navigation uses a horizontal menu with no mobile hamburger menu. On small screens, the navigation items will overflow or compress poorly.

---

## 7. Positive Aspects

- **Modern stack**: Vue 3 Composition API with `<script setup>` is the recommended approach
- **TypeScript**: Properly typed interfaces for Doctor, Patient, Question
- **Consistent UI**: Good use of Ant Design Vue components throughout
- **Responsive design**: Views include `@media` breakpoints for mobile
- **Clean component structure**: Logical separation of views and shared components
- **Vue Router**: Proper use of route params and navigation

---

## 8. Prioritized Recommendations

| Priority | Action | Effort |
|---|---|---|
| P0 | Remove plaintext passwords from source code | Small |
| P0 | Add route guards for protected pages | Small |
| P0 | Add 404 catch-all route | Small |
| P1 | Remove password from client-side Doctor interface | Small |
| P1 | Add data persistence (localStorage or backend) | Medium |
| P1 | Add ESLint + Prettier | Small |
| P1 | Add unit tests (store methods) | Medium |
| P1 | Self-host external images | Small |
| P2 | Migrate store to Pinia | Medium |
| P2 | Add API service layer | Medium |
| P2 | Add error handling and error boundaries | Medium |
| P2 | Add i18n support | Medium |
| P2 | Add CI/CD pipeline | Small |
| P3 | Add E2E tests | Large |
| P3 | Add mobile navigation (hamburger menu) | Medium |
| P3 | Add Dockerfile and deployment config | Small |
| P3 | Replace `Date.now()` IDs with `crypto.randomUUID()` | Small |
