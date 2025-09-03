#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

if (process.argv.length < 3) {
  console.error("사용법: node rename.js <새프로젝트명>");
  process.exit(1);
}

const NEW_NAME = process.argv[2];
const ROOT = process.cwd();
const PARENT = path.dirname(ROOT);
const CURRENT_DIR_NAME = path.basename(ROOT);

// 재귀적으로 모든 파일 탐색
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

// package.json 수정
const packageJsonPath = path.join(ROOT, "package.json");
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  pkg.name = NEW_NAME;
  fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2));
  console.log(`📦 package.json name 필드를 '${NEW_NAME}' 로 변경`);
}

// 파일 내부 문자열 치환
walkDir(ROOT, function (filePath) {
  if (filePath.includes("node_modules") || filePath.includes(".git")) return;

  let content = fs.readFileSync(filePath, "utf8");
  if (content.includes("xrp_monitor_nest_server")) {
    const updated = content.replace(/xrp_monitor_nest_server/g, NEW_NAME);
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`✏️  ${filePath} 내부 문자열 치환 완료`);
  }
});

// 🔥 폴더명 변경
if (CURRENT_DIR_NAME !== NEW_NAME) {
  const NEW_PATH = path.join(PARENT, NEW_NAME);
  fs.renameSync(ROOT, NEW_PATH);
  console.log(`📂 프로젝트 폴더명을 '${CURRENT_DIR_NAME}' → '${NEW_NAME}' 로 변경 완료`);
  console.log(`✅ 최종 경로: ${NEW_PATH}`);
}
