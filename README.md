# XRP Monitor - Backend Server

> WebSocket 기반 실시간 XRP 가격 모니터링 및 멀티소스 뉴스 집계 시스템의 백엔드 서버

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

## 📌 프로젝트 소개

XRP Monitor는 암호화폐 XRP의 실시간 시세 모니터링과 관련 뉴스를 한곳에서 제공하는 풀스택 서비스입니다.
본 레포지토리는 **NestJS 기반 백엔드 서버**로, 실시간 데이터 처리, 외부 API 연동, 사용자 인증 등 핵심 비즈니스 로직을 담당합니다.

## 🔗 관련 프로젝트

| 프로젝트           | 설명               | 링크                                                                                         |
| ------------------ | ------------------ | -------------------------------------------------------------------------------------------- |
| **Flutter App**    | 사용자용 모바일 앱 | [xrp_monitor_flutter_app](https://github.com/anotheranotherhoon/xrp_monitor_flutter_app)     |
| **Flutter Admin**  | 관리자 웹 대시보드 | [xrp_monitor_flutter_admin](https://github.com/anotheranotherhoon/xrp_monitor_flutter_admin) |
| **Backend (현재)** | NestJS API 서버    | [xrp_monitor_nest_server](https://github.com/anotheranotherhoon/xrp_monitor_nest_server)     |

## 🌐 배포 환경

| 항목                   | URL                             |
| ---------------------- | ------------------------------- |
| **API 서버**           | https://xrp-monitor.p-e.kr      |
| **관리자 대시보드**    | https://xrp-admin.p-e.kr        |
| **API 문서 (Swagger)** | https://xrp-monitor.p-e.kr/docs |

## 🛠 기술 스택

### Core

- **NestJS** - Node.js 기반 서버 프레임워크
- **TypeScript** - 정적 타입 언어
- **TypeORM** - ORM
- **PostgreSQL** - 관계형 데이터베이스

### 인증 / 보안

- **JWT** (Access Token + Refresh Token)
- **Passport.js** - 인증 미들웨어
- **bcryptjs** - 비밀번호 해싱

### 실시간 통신

- **Socket.io** - WebSocket 기반 실시간 데이터 전송
- **Upbit WebSocket API** - 실시간 XRP 시세 데이터 수신

### 외부 API 연동

- **Twitter API v2** - 트윗 데이터 수집
- **YouTube Data API v3** - 관련 영상 검색
- **Naver Search API** - 뉴스 데이터 수집

### 인프라 / 배포

- **Docker + docker-compose** - 컨테이너 기반 배포
- **Oracle Cloud Infrastructure (OCI)** - Always Free VM 운영
- **Nginx** - 리버스 프록시 및 정적 파일 서빙
- **Let's Encrypt** - HTTPS SSL 인증서
- **GitHub Actions** - CI/CD 자동화

## 📁 프로젝트 구조

```
src/
├── auth/                   # 인증 모듈 (JWT, 로그인, 회원가입)
├── admin/                  # 관리자 모듈 (유저 관리, 대시보드)
├── keyword/                # 키워드 모듈
├── news/                   # 뉴스 수집 모듈 (Naver API)
├── tweet/                  # 트윗 수집 모듈 (Twitter API v2)
├── upbit/                  # 업비트 WebSocket 모듈
├── version/                # 앱 버전 관리 모듈
├── xrp/                    # XRP 보유량 관리 모듈
├── youtube/                # 유튜브 데이터 모듈
└── common/
    ├── filters/            # 전역 예외 필터
    └── interceptors/       # 전역 응답 인터셉터
```

## 🚀 주요 기능

### 실시간 XRP 시세 모니터링

- Upbit WebSocket API를 통한 실시간 가격 데이터 수신
- Socket.io를 통해 Flutter 앱에 실시간 데이터 브로드캐스팅

### 멀티소스 뉴스 집계

- Twitter API v2, YouTube Data API, Naver Search API를 통한 뉴스 수집
- 커서/오프셋 기반 페이지네이션 지원

### 사용자 인증

- JWT Access Token + Refresh Token 이중 인증 구조
- SUPER_ADMIN / ADMIN / USER 역할 기반 권한 관리

### 앱 버전 관리

- Android/iOS 플랫폼별 독립적인 버전 상태 관리
- 강제 업데이트 / 선택 업데이트 구분 처리

### XRP 보유량 추적

- 사용자별 XRP 보유량 CRUD
- 보유량 요약 통계 제공

## ⚙️ 로컬 개발 환경 설정

### 사전 요구사항

- Node.js 20+
- Docker & docker-compose
- PostgreSQL (또는 Docker로 실행)

### 1. 레포지토리 클론

```bash
git clone https://github.com/anotheranotherhoon/xrp_monitor_nest_server.git
cd xrp_monitor_nest_server
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

`.env` 파일 생성:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=xrp
DB_SSL=false

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Environment
NODE_ENV=development

# External APIs
YOUTUBE_API_KEY=your-youtube-api-key
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET_KEY=your-naver-secret-key
X_BEARER_TOKEN=your-twitter-bearer-token
```

### 4. 서버 실행

```bash
# 개발 모드 (hot reload)
npm run start:dev

# 프로덕션 빌드 후 실행
npm run build
npm run start:prod
```

### 5. Docker로 실행

```bash
docker-compose up -d
```

## 🐳 Docker 배포

### docker-compose.yml 구성

```yaml
version: '3'
services:
  db:
    image: postgres:15-alpine
    container_name: postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: xrp
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  app:
    build: .
    container_name: nestjs
    ports:
      - '3000:3000'
    env_file:
      - .env
    depends_on:
      - db
    restart: always

volumes:
  postgres_data:
```

## 🔄 CI/CD

`master` 브랜치에 push하면 GitHub Actions가 자동으로 Oracle Cloud VM에 배포합니다.

```
git push origin master
→ GitHub Actions 실행
→ Oracle Cloud VM에 자동 배포
→ docker-compose 재빌드 및 재시작
```

## 📖 API 문서

Swagger UI: https://xrp-monitor.p-e.kr/docs

### 주요 엔드포인트

| Method | Endpoint           | 설명                  |
| ------ | ------------------ | --------------------- |
| POST   | `/auth/register`   | 회원가입              |
| POST   | `/auth/login`      | 로그인                |
| POST   | `/auth/refresh`    | 토큰 갱신             |
| GET    | `/news/xrp/cursor` | 뉴스 목록 (커서 기반) |
| GET    | `/youtube/search`  | 유튜브 검색           |
| GET    | `/xrp/holding`     | XRP 보유량 조회       |
| GET    | `/version/check`   | 앱 버전 확인          |
| GET    | `/admin/dashboard` | 관리자 대시보드       |

## 🛠 개발 도구

프로젝트에는 NestJS 개발 생산성을 높이기 위한 자동화 스크립트가 포함되어 있습니다.

```bash
# Controller/Service/Repository 세트 자동 생성
npm run generate -- <모듈명>

# 프로젝트 이름 일괄 변경
npm run rename -- <새 프로젝트명>

# Git 초기화 및 새 원격 저장소 연결
npm run git-reset -- <새 원격 저장소 URL>

# Husky 설정 (git-reset 이후 실행)
npm run husky:setup
```

## 📝 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
refactor: 코드 리팩토링
chore: 빌드/설정 변경
docs: 문서 수정
ci: CI/CD 설정 변경
```
