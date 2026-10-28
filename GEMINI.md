# PrepVerse AI - Project Instructions & Rules

## Mandatory Rules for All AI Assistants & Contributors

### 1. Mandatory Progress Recording (`progress.md`)
- **CRITICAL**: Every time code, configuration, or documentation changes are made in this repository, they **MUST** be recorded in `progress.md` at the project root.
- Before committing or finishing a task:
  - Open `progress.md`.
  - Add an entry under `📋 Changelog & Progress History` with:
    - Current date `[YYYY-MM-DD]`
    - Status (`Completed`, `In Progress`, `Verified`)
    - Affected module / component
    - Specific list of changes made and files modified.
- Keep the `progress.md` overview table up to date with the latest features and operational status.

### 2. Rollback Verification (`Rollback.md`)
- If any breaking change, migration, or critical refactoring occurs, record rollback steps and verify safety in `Rollback.md`.

### 3. Localhost Runtime Standards
- **Frontend**: Next.js on port 3000 (`http://localhost:3000`).
- **Backend**: FastAPI on port 8000 (`http://127.0.0.1:8000`).
- Always use the centralized `API_BASE` from `frontend/lib/api.ts` or `process.env.NEXT_PUBLIC_API_URL`. Never hardcode `http://localhost:8000` or `http://127.0.0.1:8000` in UI pages or components.

### 4. Secret & Environment Protection
- Never commit `.env` or sensitive API keys to git. Always use `.env.example` as a template.
