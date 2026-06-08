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

- **CryptoCompare News API** - XRP 관련 암호화폐 기사 수집
- **YouTube Data API v3** - 관련 영상 검색
- **Naver Search API** - 뉴스 데이터 수집
- **Twitter API v2** - 초기 트윗 수집용으로 구현했으나 현재 기본 데이터 소스에서는 제외

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
├── crypto/                 # 암호화폐 기사 수집 모듈 (CryptoCompare)
├── popup/                  # 팝업 CRUD, 노출 조건 및 이미지 저장소
├── tweet/                  # 레거시 트윗 수집 모듈 (Twitter API v2)
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

- CryptoCompare News API, YouTube Data API, Naver Search API를 통한 XRP 관련 콘텐츠 수집
- 커서/오프셋 기반 페이지네이션 지원

### CryptoCompare 사용 및 Twitter API 제외 배경

- 초기 버전에서는 Twitter API v2로 XRP 관련 트윗을 수집하도록 구현했습니다.
- 이후 X(Twitter) API 정책과 요금제가 변경되면서 무료 또는 저비용 환경에서 안정적인 트윗 조회를 유지하기 어려워졌습니다.
- 특히 API 접근 권한, 호출량 제한, 유료 플랜 의존도 때문에 개인/포트폴리오 프로젝트의 상시 운영 데이터 소스로 사용하기에는 비용과 장애 가능성이 커졌습니다.
- 이를 보완하기 위해 현재 기본 콘텐츠 소스는 CryptoCompare News API로 전환했습니다. CryptoCompare는 암호화폐 기사 데이터를 구조화된 형태로 제공하고, XRP 카테고리 기사 목록을 커서 기반 API로 제공하기에 적합합니다.
- `tweet` 모듈과 `/tweet/*` 엔드포인트는 초기 구현 흔적 및 호환 목적의 레거시 코드로 남아 있으며, 앱의 기본 기사 화면은 `/crypto/news/xrp`를 사용합니다.

### 사용자 인증

- JWT Access Token + Refresh Token 이중 인증 구조
- SUPER_ADMIN / ADMIN / USER 역할 기반 권한 관리

### 앱 버전 관리

- Android/iOS 플랫폼별 독립적인 버전 상태 관리
- 강제 업데이트 / 선택 업데이트 구분 처리

### XRP 보유량 추적

- 사용자별 XRP 보유량 CRUD
- 보유량 요약 통계 제공

### 관리자 팝업 및 이미지 관리

- 관리자 권한 기반 팝업 등록, 조회, 수정, 삭제 및 활성화 상태 변경
- 최대 10개 팝업과 `1~10` 노출 순서 관리
- 시작일과 종료일을 기준으로 현재 노출 가능한 팝업만 자동 조회
- 이미지 클릭 동작을 `NONE`(이동 없음), `EXTERNAL_LINK`(외부 링크)로 구분
- 외부 링크 선택 시 `http/https` URL 필수 검증
- 개발 환경은 `.local-storage/`, 운영 환경은 OCI Object Storage에 이미지 저장
- PostgreSQL에는 이미지 Object Key, MIME Type, 링크 설정 등 메타데이터 저장

### 로컬 개발 지원

- Debug/Profile Flutter 앱은 `http://localhost:3000`, Release는 운영 도메인 사용
- localhost와 `CORS_ORIGINS`에 등록한 개발 Origin을 허용하는 동적 CORS 구성
- 환경변수로 로컬 슈퍼관리자 계정을 생성하거나 기존 계정 정보를 갱신

## ⚙️ 로컬 개발 환경 설정

### 팝업 이미지 Object Storage 설정

팝업 이미지는 OCI Object Storage에 저장되고 PostgreSQL에는 Object Key만
저장됩니다. OCI VM에서는 Instance Principal을 사용하도록 다음 환경변수를
설정합니다.

```env
OCI_AUTH_MODE=instance_principal
OCI_REGION=ap-chuncheon-1
OCI_OBJECT_STORAGE_NAMESPACE=your-namespace
OCI_OBJECT_STORAGE_BUCKET=xrp-monitor-popup
```

VM이 속한 Dynamic Group에는 대상 Bucket의 Object를 관리할 수 있는 IAM
Policy가 필요합니다. 로컬 개발에서는 `OCI_AUTH_MODE=config`와 OCI CLI
설정 파일을 사용할 수 있습니다.

GitHub Actions 저장소 Secret에도 다음 값을 등록해야 합니다.

- `OCI_OBJECT_STORAGE_NAMESPACE`
- `OCI_OBJECT_STORAGE_BUCKET`

운영 배포에서는 Docker 컨테이너가 `OBJECT_STORAGE_DRIVER=oci`와 Instance
Principal 인증을 사용합니다. `master` 브랜치 배포 시 GitHub Actions가
Object Storage Secret을 OCI VM의 Docker Compose 실행 환경에 전달합니다.

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
OBJECT_STORAGE_DRIVER=local
LOCAL_STORAGE_PATH=.local-storage

# 쉼표로 구분한 추가 Flutter Web Origin이 필요한 경우
CORS_ORIGINS=http://192.168.0.10:8080

# External APIs
YOUTUBE_API_KEY=your-youtube-api-key
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET_KEY=your-naver-secret-key
CRYPTO_COMPARE=your-cryptocompare-api-key

# Optional legacy Twitter API integration
X_BEARER_TOKEN=your-twitter-bearer-token

# Local super admin seed
SUPER_ADMIN_EMAIL=superadmin@xrpmonitor.com
SUPER_ADMIN_PASSWORD=superadmin123
SUPER_ADMIN_NICKNAME=슈퍼관리자
```

개발 환경에서는 `OBJECT_STORAGE_DRIVER`의 기본값이 `local`이므로 팝업
이미지가 `.local-storage/`에 저장됩니다. 운영 환경에서는 기본값이 `oci`이며
기존 OCI Object Storage 설정을 사용합니다.

### 4. 서버 실행

```bash
# 개발 모드 (hot reload)
npm run start:dev

# 프로덕션 빌드 후 실행
npm run build
npm run start:prod
```

로컬 관리자 계정이 없다면 다음 명령으로 생성합니다. 같은 이메일이 이미
존재하면 비밀번호, 닉네임, 권한과 활성 상태를 갱신합니다.

```bash
npm run create-super-admin
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

### 목록 API 포맷

목록 API는 요청/응답 포맷을 아래 기준으로 통일합니다.

```http
GET /news/xrp/cursor?cursorId=-1&perPage=10
GET /youtube/search?cursorId=-1&perPage=10&q=XRP%20Ripple
GET /crypto/news/xrp?cursorId=-1&perPage=10
GET /tweet/users/25073877/tweets?cursorId=-1&perPage=10
GET /admin/users?page=1&perPage=10&role=USER
```

- 첫 요청은 `cursorId=-1`을 사용합니다.
- 다음 요청은 이전 응답의 `result.nextCursor` 값을 `cursorId`로 전달합니다.
- 페이지 크기는 `perPage`를 사용합니다. `display`, `maxResults`, `max_results`, `next_token`, `limit`는 기존 호출 호환용입니다.
- 커서형 응답은 `result.nextCursor`, `result.page.perPage`, `result.list`를 사용합니다.
- 페이지형 응답은 `result.page`, `result.list`를 사용합니다.

### 주요 엔드포인트

| Method | Endpoint           | 설명                        |
| ------ | ------------------ | --------------------------- |
| POST   | `/auth/register`   | 회원가입                    |
| POST   | `/auth/login`      | 로그인                      |
| POST   | `/auth/refresh`    | 토큰 갱신                   |
| GET    | `/news/xrp/cursor` | 뉴스 목록 (커서 기반)       |
| GET    | `/crypto/news/xrp` | CryptoCompare XRP 기사 목록 |
| GET    | `/youtube/search`  | 유튜브 검색                 |
| GET    | `/xrp/holding`     | XRP 보유량 조회             |
| GET    | `/version/check`   | 앱 버전 확인                |
| GET    | `/admin/dashboard` | 관리자 대시보드             |
| GET    | `/popup/active`    | 현재 노출 가능한 팝업 목록  |
| GET    | `/popup/:id/image` | 팝업 이미지 조회            |
| GET    | `/admin/popup`     | 관리자 팝업 목록            |
| POST   | `/admin/popup`     | 관리자 팝업 등록            |
| PUT    | `/admin/popup/:id` | 관리자 팝업 수정            |
| DELETE | `/admin/popup/:id` | 관리자 팝업 삭제            |

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
