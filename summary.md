# QA Live Healthcare - Project Summary

## Overview

**QA Live Healthcare** (在线医疗问诊平台) is an online medical consultation platform connecting patients with doctors for remote Q&A. The UI is entirely in Chinese (Simplified), targeting the Chinese healthcare market.

**Two user roles:**
- **Patients** — verify identity (name + birthday), browse active doctors, submit medical questions, view doctor responses
- **Doctors** — log in with username/password, view pending questions, provide written answers, or mark questions as answered

## Tech Stack

| Category | Technology |
|---|---|
| Language | TypeScript |
| Framework | Vue 3 (`<script setup>` SFCs) |
| Build Tool | Vite 5 |
| UI Library | Ant Design Vue 4 |
| Routing | Vue Router 4 |
| Date Handling | Day.js |
| Type Checking | vue-tsc 2 |

**No backend** — all data is stored in-memory via a reactive Vue store, loaded from static JSON files. No API layer, no HTTP client, no database, no state management library (Pinia/Vuex).

## Project Structure

```
src/
├── main.ts                    # App entry point
├── App.vue                    # Root layout (Header + RouterView + Footer)
├── style.css                  # Global CSS
├── assets/                    # Static assets
├── components/
│   ├── AppHeader.vue          # Top nav bar with menu + doctor login
│   ├── AppFooter.vue          # Footer with links and contact info
│   └── HelloWorld.vue         # Unused starter template leftover
├── data/
│   ├── doctor-user-list.json  # 5 seed doctors with credentials
│   ├── patient-user.json      # 5 seed patients
│   └── question-list.json     # 7 seed questions (3 answered, 4 pending)
├── router/
│   └── index.ts               # 7 routes (Home, Consultation, Doctors, About, DoctorLogin, DoctorRoom)
├── store/
│   └── index.ts               # Reactive state store (doctors, patients, questions)
└── views/
    ├── Home.vue               # Landing page: hero, stats, active rooms
    ├── Consultation.vue       # Patient portal: auth, submit Qs, view answers
    ├── DoctorLogin.vue        # Doctor login form
    ├── DoctorRoom.vue         # Doctor dashboard: pending/answered Qs
    ├── Doctors.vue            # Doctor directory listing
    └── About.vue              # About page with features, process, contact
```

## Routes

| Path | View | Purpose |
|---|---|---|
| `/` | Home | Landing page |
| `/consultation` | Consultation | Patient Q&A portal |
| `/consultation/:doctorUsername` | Consultation | Patient Q&A for specific doctor |
| `/doctors` | Doctors | Doctor directory |
| `/about` | About | About the platform |
| `/doctor/login` | DoctorLogin | Doctor authentication |
| `/doctor/room/:username` | DoctorRoom | Doctor dashboard |

## Data Model

- **Doctor**: id, username, password, name, title, department, avatar, experience, specialties, isActive
- **Patient**: id, name, birthday, phone, gender
- **Question**: id, patientId, patientName, doctorId, doctorName, question, submitTime, status (pending/answered), answer, answerTime

Key store methods: `loginDoctor()`, `verifyPatient()`, `addQuestion()`, `answerQuestion()`, `markQuestionAsAnswered()`, `getActiveDoctors()`, `getStatistics()`

## Build & Run

| Command | Description |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Type-check (vue-tsc) then bundle (vite build) |
| `npm run preview` | Preview production build |

## Current State

- **Front-end-only prototype/demo** — no backend, database, or API
- **No tests** — no test framework, no test files
- **No CI/CD** — no pipelines, Dockerfile, or docker-compose
- **No linting** — no ESLint/Prettier configuration
- **Security**: Passwords stored in plain text; patient verification uses name + birthday
- **Repository**: `github.com/vibecodingshow/qa-live-healthcare`
