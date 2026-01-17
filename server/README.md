# News Backend

Express + MongoDB backend with JWT authentication and a seed script.

Quick start:

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. From `server/` run:

```bash
npm install
npm run seed
npm run dev
```

Seed prints JWT tokens for seeded users.
