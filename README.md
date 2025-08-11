# WiderWindow Blog

Containerized Next.js 15 App Router blog with MongoDB.

## Run (Docker only)
1. Copy `.env.example` to `.env.local` (optional for local dev) or create env file and adjust `docker-compose.yml`.
2. Build & start: `docker compose up --build`.
3. App: http://localhost:4020  MongoDB: localhost:27060.

## Development notes
- All installs happen in image build (multi-stage Dockerfile).
- Add new deps: update `package.json` then rebuild `docker compose build web`.
- Persistent Mongo storage via named volume `mongo_data_widerwindow`.

## Next Steps
- Add auth (JWT) routes.
- Admin UI for creating/editing posts.
- Markdown rendering & SEO metadata.
- Affiliate link tracking.
