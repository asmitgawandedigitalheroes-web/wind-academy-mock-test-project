# Wings Academy Mock Test Platform

A professional, high-performance web application built with **Next.js 15+** and **Supabase**, designed for online examinations, practice modules, and educational content management.

## 🚀 Key Features
- **Comprehensive Student Portal**: Timed mock tests, practice modules, and detailed result analysis.
- **Advanced Admin Dashboard**: CRUD for courses/modules, essay grading system, and user analytics.
- **Exam Integrity System**: Real-time monitoring of tab switching, window minimization, and illegal shortcuts.
- **Premium Tech Stack**: React 19, Tailwind CSS 4, Framer Motion, and Recharts.

## 🛠️ Tech Stack
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS 4.
- **Backend & DB**: Supabase (PostgreSQL, Auth, Edge Functions, RLS).
- **Communication**: Nodemailer for email automation.
- **E2E Testing**: Playwright.

## 📦 Getting Started

### 1. Prerequisites
- Node.js (Latest LTS)
- Supabase CLI

### 2. Installation
```bash
npm install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `EMAIL_SERVER_HOST` / `PORT` / `USER` / `PASSWORD`

### 4. Development
```bash
npm run dev
# or
pnpm dev
```

## 📖 Documentation
Detailed software documentation including architecture diagrams and database schema can be found in the `software_documentation.md` artifact.
