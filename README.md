# 프로젝트 자동 생성 도구 사용법

이 프로젝트에는 NestJS 개발을 편하게 하기 위한 자동 생성 스크립트가 포함되어 있습니다.  
`tools` 폴더 안에 스크립트가 위치하며, 아래와 같이 사용할 수 있습니다.

---

## 1. 프로젝트 이름 및 내부 문자열 변경 (`rename.js`)

### 사용법

```bash
npm run generate -- <이름>

```

### 예시

```bash
npm run generate -- my-app

```

## 2. Controller / Service / Repository 세트 생성 (`generate.js`)

`generate.js`를 사용하면, 지정한 이름으로 NestJS 모듈 구조를 자동 생성할 수 있습니다.

### 사용법

```bash
npm run rename -- <새 프로젝트명>
```

### 예시

```bash
npm run rename -- my-app

src/
  post/
    controllers/
      post.controller.ts
    services/
      post.service.ts
    repositories/
      post.repository.ts

```

## 3. Git 초기화 및 새 원격 연결 (`git-reset.js`)

### 사용법

```bash
npm run git-reset -- git@github.com:username/new-project.git
```

## 4. husky 셋팅 (`setup-husky.js`)

Git 초기화 이후에 반드시 실행 시킬 것

### 사용법

```bash
npm run husky:setup
```
