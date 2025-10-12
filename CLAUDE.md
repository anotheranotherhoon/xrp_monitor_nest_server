# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Development

- `npm run start:dev` — Start development server with watch mode
- `npm run build` — Build the application
- `npm run lint` — Run ESLint with auto-fix
- `npm run format` — Format code with Prettier
- `npm test` — Run unit tests
- `npm run test:e2e` — Run end-to-end tests
- `npm run test:cov` — Run tests with coverage

### Database & Migrations

- `npm run migration:set-user-role` — Set default user roles
- `npm run create-super-admin` — Create a super admin user
- `npm run seed-keywords` — Seed keyword data

### Project Generation Tools

- `npm run generate -- <name>` — Generate NestJS module structure (controller/service/repository)
- `npm run rename -- <new-name>` — Rename project and update internal strings
- `npm run git-reset -- <git-url>` — Reset git and connect to new remote
- `npm run husky:setup` — Setup husky git hooks

---

## 🏗️ Architecture Overview

This is a **NestJS application** for **XRP monitoring**, consisting of modules such as:

- Auth (JWT-based)
- Admin (system/user management)
- Version (app deployment)
- Keyword (sentiment classification)
- XRP (portfolio tracking)
- News (Naver integration)
- Tweet (Twitter API)
- Youtube (YouTube API)
- Upbit (real-time crypto WebSocket)

All responses, DTOs, and entities **must follow the patterns defined below**.

---

## ⚙️ Global API Response Rules

### ✅ **List Responses**

All list APIs **must** return the following JSON structure:

```json
{
  "success": true,
  "code": 1,
  "message": "성공하였습니다.",
  "result": {
    "page": {
      "total": 10,
      "perPage": 15,
      "currentPage": 1,
      "lastPage": 10
    },
    "list": [
      {
        "ftUniqueId": "string",
        "ftName": "string",
        "ftPh": 0.1,
        "ftDo": 0.1,
        "ftTemp": 0.1,
        "ftSalinity": 0.1,
        "ftPhStatus": "NORMAL",
        "ftDoStatus": "NORMAL",
        "ftTempStatus": "NORMAL",
        "ftSalinityStatus": "NORMAL"
      }
    ]
  }
}
```

> ⚠️ Important rule:
>
> - Pagination info always goes under `result.page`.
> - Actual items always go under `result.list`.

---

### ✅ **Single/Detail Responses**

When returning a **single data object**, it must always be wrapped inside `result.data`:

```json
{
  "success": true,
  "code": 200,
  "message": "요청이 성공적으로 처리되었습니다.",
  "result": {
    "data": {
      "positiveKeywords": [
        {
          "id": 1,
          "keyword": "상승",
          "weight": "1.5",
          "type": "POSITIVE",
          "isActive": true,
          "createdAt": "2025-10-11 10:50:27",
          "updatedAt": "2025-10-11 10:50:27"
        }
      ],
      "negativeKeywords": [],
      "importantKeywords": []
    }
  }
}
```

> ⚠️ **Absolutely mandatory:**
>
> - Use `result.data` (not `result.list`) for non-list responses.
> - Keep timestamps formatted as `yyyy-MM-dd HH:mm:ss`.
> - Never return raw entity objects; always use DTOs.

---

## 🧱 Entity & Field Naming Rules

- Every entity field that represents an ID **must use a prefix**.
  - Example: `keIdx`, `veIdx`, `usIdx`
- The only exception: `createdAt` and `updatedAt` (no prefix).
- All datetime fields must be returned as formatted Korean time (`yyyy-MM-dd HH:mm:ss`).

---

## 🧩 Development Patterns

- Use repository pattern for DB access.
- Apply DTO classes for all input/output.
- Wrap all responses via `TransformInterceptor`.
- Never expose internal entity fields directly.
- All exceptions must pass through a global `HttpExceptionFilter`.
- Use strict TypeScript mode.
- Apply `@ApiResponse` decorators in controllers for Swagger consistency.

---

## 🌏 Date Handling

- All times must be converted to `Asia/Seoul`.
- Use `formatToKoreanTime()` utility for all date fields before response.

---

## 🧰 Environment & Integration

- DB: PostgreSQL with TypeORM
- APIs: Naver, Twitter, YouTube, Upbit
- Swagger: `/docs`
- Env variables: `DB_HOST`, `DB_PORT`, `DB_USERNAME`, etc.
- CORS: Allow multiple dev origins
- SSL: Enabled for production

---

## 🧪 Testing Setup

- Jest for unit tests
- Supertest for e2e tests
- Coverage enabled
- Files named `*.spec.ts`

---

## ⚠️ Summary of Critical Rules for Claude

Claude **must always enforce these response contracts**:

1. **List →** `result.list`
2. **Single Object →** `result.data`
3. **All timestamps →** `"yyyy-MM-dd HH:mm:ss"`
4. **All IDs →** prefixed format (e.g., `keIdx`, `veIdx`)
5. **Response JSON always includes** `success`, `code`, `message`, `result`
6. **List responses include** `result.page` pagination object
