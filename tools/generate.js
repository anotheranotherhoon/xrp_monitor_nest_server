#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  console.error("사용법: node generate.js <name>");
  process.exit(1);
}

const name = process.argv[2].toLowerCase();   // post
const className = name.charAt(0).toUpperCase() + name.slice(1); // Post
const SRC = path.join(process.cwd(), "src");
const BASE_DIR = path.join(SRC, name);

// 폴더 구조 정의
const dirs = [
  path.join(BASE_DIR, "controllers"),
  path.join(BASE_DIR, "repositories"),
  path.join(BASE_DIR, "services"),
];

// 파일 템플릿
const templates = {
  controller: {
    file: path.join(BASE_DIR, "controllers", `${name}.controller.ts`),
    content: `import { Controller } from '@nestjs/common';

@Controller('${name}')
export class ${className}Controller {
  // TODO: implement ${name} controller
}
`,
  },
  service: {
    file: path.join(BASE_DIR, "services", `${name}.service.ts`),
    content: `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${className}Service {
  // TODO: implement ${name} service
}
`,
  },
  repository: {
    file: path.join(BASE_DIR, "repositories", `${name}.repository.ts`),
    content: `import { Injectable } from '@nestjs/common';

@Injectable()
export class ${className}Repository {
  // TODO: implement ${name} repository
}
`,
  },
};

// 폴더 생성
dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📂 폴더 생성: ${dir}`);
  }
});

// 파일 생성
Object.values(templates).forEach(({ file, content }) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, content);
    console.log(`✏️  파일 생성: ${file}`);
  } else {
    console.log(`⚠️  이미 존재: ${file}`);
  }
});

console.log(`✅ ${className} 모듈 세트 생성 완료!`);
