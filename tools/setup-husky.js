const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, message) {
  console.log(`\n--- ${message} ---`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${message} 완료`);
  } catch (error) {
    console.error(`❌ ${message} 실패:`, error.message);
    process.exit(1);
  }
}

// 1. 기존 Husky 설정 제거
runCommand('npx husky uninstall', 'Husky 설정 제거');

// 2. Husky 재초기화
runCommand('npx husky-init', 'Husky 재초기화');

// 3. pre-commit 훅 파일 직접 생성
const preCommitContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`;
fs.writeFileSync(
  path.join(__dirname, '../.husky/pre-commit'),
  preCommitContent,
  'utf-8',
);
fs.chmodSync(path.join(__dirname, '../.husky/pre-commit'), 0o755);
console.log('✅ pre-commit 훅 생성 완료');

// 4. commit-msg 훅 파일 직접 생성
const commitMsgContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

node tools/commit-emoji.js "$1"
`;
fs.writeFileSync(
  path.join(__dirname, '../.husky/commit-msg'),
  commitMsgContent,
  'utf-8',
);
fs.chmodSync(path.join(__dirname, '../.husky/commit-msg'), 0o755);
console.log('✅ commit-msg 훅 생성 완료');

console.log('\n✨ Husky 설정이 모두 완료되었습니다.');
