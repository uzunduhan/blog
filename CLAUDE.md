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
npx tsc --noEmit # Type-check only, no output
```

## Architecture

### Backend

**Request flow**: `Controller` → `IService` → `ServiceResult` / `ServiceResult<T>` → controller maps status to HTTP via switch expression. HTTP concerns never leak into services.

**`ServiceResult` pattern** (`Services/Results/ServiceResult.cs`): statuses are `Ok`, `NotFound`, `Forbidden`, `Conflict`. Controllers pattern-match on `result.Status`; `result.Data` carries the payload for `Ok`.

**Pagination**: public post listing uses `PostsQueryDto` (categoryId, search, page, pageSize) and returns `PagedResult<T>` (items, totalCount, page, pageSize, totalPages). `CountAsync()` is called before `Skip/Take` so the count query runs without `ORDER BY`.

**Infrastructure wiring**: `Extensions/ServiceCollectionExtensions.cs` registers DB, Identity, JWT, CORS, OpenAPI, and all services. `Program.cs` is intentionally thin. Role seeding (`Admin`, `User`) happens at startup via `Extensions/WebApplicationExtensions.cs`.

**Post approval flow**: new posts default to `IsApproved = false`. `GET /api/posts` (public, paginated) returns only approved posts. `GET /api/posts/pending` (Admin-only) returns unapproved. `POST /api/posts/{id}/approve` promotes a post.

**Models**: `Post` has `Author` (ApplicationUser), `Comments`, `Categories` (many-to-many). `ApplicationUser` extends `IdentityUser`.

API docs at `/scalar/v1` (not Swagger UI).

### Frontend

**Auth**: `AuthContext` (`src/context/AuthContext.tsx`) holds `token`, `username`, `role` — persisted to `localStorage`. The axios instance (`src/api/axios.ts`) attaches the Bearer token on every request and calls a registered `logoutCallback` on 401, wired in from `AuthContext` via `setLogoutCallback`.

**Route guards**: `PrivateRoute` requires any authenticated user; `AdminRoute` requires `role === 'Admin'`. Both are in `src/guards/`.

**API layer**: one file per resource in `src/api/` — `authApi.ts`, `postsApi.ts`, `commentsApi.ts`, `categoriesApi.ts` — all using the shared axios instance. `postsApi.getApproved(query)` returns `PagedResult<Post>`; other list endpoints return plain arrays.

**Theme**: dark mode via `ThemeContext` (`src/context/ThemeContext.tsx`), toggled by Navbar, persisted to `localStorage`. Tailwind uses `class` strategy — `dark:` prefixes throughout.

**UI components** (`src/components/ui/`): `Button` (primary/secondary/danger variants), `Badge`, `Spinner`, `Alert`, `Pagination`. Category filter pills and `Pagination` share the same `rounded-full border` Tailwind style.

**Pages and routing** (defined in `App.tsx`):
| Route | Page | Guard |
|---|---|---|
| `/` | `HomePage` | public |
| `/posts/:id` | `PostDetailPage` | public |
| `/posts/create` | `CreatePostPage` | `PrivateRoute` |
| `/posts/:id/edit` | `EditPostPage` | `PrivateRoute` |
| `/my-posts` | `MyPostsPage` | `PrivateRoute` |
| `/admin` | `AdminPage` | `AdminRoute` |
| `/login`, `/register` | auth pages | public |

## Configuration

Backend (`appsettings.json`):
- `ConnectionStrings:DefaultConnection` — PostgreSQL (default: `localhost`, db `blogdb`, user `postgres`, password `123456`)
- `Jwt:Key` — must be ≥ 32 chars
- `Cors:AllowedOrigins` — array of allowed frontend origins (default: `http://localhost:5173`)

Frontend: create `frontend/.env.local` with `VITE_API_URL=http://localhost:5109`.
