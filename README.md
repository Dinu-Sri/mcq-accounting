# SL Accounting MCQ

Practice Sri Lanka A/L Accounting past paper MCQs with timed quizzes and instant feedback.

## Features
- Select past papers by year (2020-2024)
- Timed quizzes (90 minutes per paper)
- Instant scoring with correct/wrong/skipped breakdown
- Answer review with explanations
- Simple, clean UI - no training needed

## Tech Stack
- Next.js 15 + shadcn/ui + Tailwind CSS
- Zustand for state management
- PostgreSQL + Prisma
- Docker + Cloudflare Tunnel deployment

## Quick Start
```bash
npm install
cp .env.example .env.local
npx prisma migrate dev
npx prisma db seed
npm run dev
```
