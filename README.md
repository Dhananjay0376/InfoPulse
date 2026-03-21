# InfoPulse

InfoPulse is a customer messaging dashboard with:

- a Vite/React frontend
- a Node/Express backend
- a background worker for campaign processing
- PostgreSQL for persistent state

## Local Setup

1. Install root, backend, and worker dependencies.
2. Create `backend/.env` from `backend/.env.example`.
3. Create `worker/.env` from `worker/.env.example`.
4. Create the PostgreSQL database `infopulse`.
5. Run the SQL migration in `backend/db/migrations/0001_init.sql`.
6. Seed the first admin user:

```powershell
cd d:\advanced-customer-data-manager\backend
npm run seed:admin
```

## Run The Stack

From the repo root:

```powershell
npm run dev:all
```

This starts:

- frontend on `http://localhost:5173`
- backend on `http://localhost:4000`
- worker for queue processing

You can also run them individually:

```powershell
npm run dev:frontend
npm run dev:backend
npm run dev:worker
```

## First Login

Default seeded credentials:

- email: `admin@infopulse.local`
- password: `ChangeMe123!`

## Real Email Sending

Set the worker provider in `worker/.env`:

```env
EMAIL_PROVIDER=smtp
EMAIL_FROM=you@example.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-user
SMTP_PASS=your-password
```
