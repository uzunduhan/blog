# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack blog application with:
- **Backend**: ASP.NET Core 10 Web API (`backend/BlogApi/`)
- **Frontend**: React 19 + TypeScript + Vite (`frontend/`)
- **Database**: PostgreSQL via EF Core (Npgsql)

## Commands

### Backend (`backend/BlogApi/`)
```bash
dotnet run                          # Start API (http://localhost:5109)
dotnet build                        # Build
dotnet ef migrations add <Name>     # Add EF migration
dotnet ef database update           # Apply migrations
```

### Frontend (`frontend/`)
```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # TypeScript check + Vite production build
npm run lint     # ESLint
```

## Architecture

### Backend

Controllers call service interfaces; services return `ServiceResult` / `ServiceResult<T>` (with `Ok`, `NotFound`, `Forbidden` statuses) and controllers map those to HTTP responses via a switch expression. This keeps HTTP concerns out of services.

Service registration and infrastructure configuration (DB, Identity, JWT, CORS, OpenAPI) live in `Extensions/ServiceCollectionExtensions.cs` — `Program.cs` is intentionally thin. Role seeding (`Admin`, `User`) happens at startup via `Extensions/WebApplicationExtensions.cs`.

**Post approval flow**: new posts default to `IsApproved = false`. Only `GET /api/posts` (public) returns approved posts. `GET /api/posts/pending` (Admin-only) returns unapproved ones. `POST /api/posts/{id}/approve` promotes a post.

API documentation is served via Scalar at `/scalar/v1` (not Swagger UI).

### Frontend

Auth state is held in `AuthContext` (`src/context/AuthContext.tsx`) and persisted to `localStorage` (`token`, `username`, `role`). The axios instance in `src/api/axios.ts` attaches the Bearer token on every request and calls a registered `logoutCallback` on 401 — the callback is wired from `AuthContext` via `setLogoutCallback`.

Route guards: `PrivateRoute` requires any authenticated user; `AdminRoute` requires `role === 'Admin'`.

API calls are split by resource in `src/api/` (`authApi.ts`, `postsApi.ts`, `commentsApi.ts`), all using the shared axios instance.

The `VITE_API_URL` env var sets the backend base URL (default assumed `http://localhost:5109`).

## Configuration

Backend (`appsettings.json`):
- `ConnectionStrings:DefaultConnection` — PostgreSQL connection string (default: `localhost`, db `blogdb`, user `postgres`, password `123456`)
- `Jwt:Key` — must be ≥ 32 chars; change before deploying
- `Cors:AllowedOrigins` — array of allowed frontend origins (default: `http://localhost:5173`)

Frontend: create `frontend/.env.local` with `VITE_API_URL=http://localhost:5109`.
