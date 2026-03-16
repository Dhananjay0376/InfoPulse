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
