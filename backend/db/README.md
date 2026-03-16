# InfoPulse Database

This folder holds the PostgreSQL migration files for the production backend.

## Migration strategy

- Plain SQL migrations are used first so the schema is explicit and reviewable.
- Every new schema change should be added as a new numbered migration.
- Application code should treat these migrations as the source of truth.

## Initial schema

`0001_init.sql` creates the core Phase 2 entities:

- users
- customers
- customer_consents
- email_templates
- campaigns
- campaign_recipients
- message_deliveries
- audit_logs

## First-time local setup

1. Create the PostgreSQL database named `infopulse`.
2. Apply `migrations/0001_init.sql`.
3. Copy `backend/.env.example` to `backend/.env` and adjust credentials.
4. Run `npm run seed:admin` inside `backend` to create the first admin user.
