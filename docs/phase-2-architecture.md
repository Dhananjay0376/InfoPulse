# InfoPulse Phase 2 Architecture

## Scope

Phase 2 upgrades InfoPulse from a browser-only customer tracker into a production-style messaging platform with:

- a React frontend
- a Node.js backend API
- a background worker for async jobs
- PostgreSQL for persistent data
- Redis-backed queues for campaign processing

The first delivery channel is email.

## Services

### Frontend

- Existing Vite React app
- Handles customer management, campaign creation, templates, and reporting
- Authenticates against the backend API

### Backend API

- Owns customer, template, campaign, consent, and audit APIs
- Validates requests and persists data in PostgreSQL
- Enqueues background jobs instead of sending messages in request handlers

### Worker

- Pulls campaign jobs from the queue
- Sends email in batches via a provider integration
- Records delivery outcomes and retries recoverable failures

## Core Data Domains

- Customers
- Consents
- Templates
- Campaigns
- Campaign recipients
- Deliveries
- Audit logs

## Initial Build Order

1. Backend and worker scaffold
2. PostgreSQL schema and migrations
3. Authentication and role model
4. Customer CRUD API
5. Template CRUD API
6. Campaign creation and launch flow
7. Queue processing and email provider integration
8. Delivery history and operational reporting
