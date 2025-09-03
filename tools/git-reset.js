#!/usr/bin/env node

const { execSync } = require('child_process');

if (process.argv.length < 3) {
  console.error('사용법: node tools/git-reset.js <새 원격 URL>');
  process.exit(1);
}

const REMOTE_URL = process.argv[2];

try {
  console.log('🔹 기존 .git 폴더 삭제...');
  execSync('rm -rf .git', { stdio: 'inherit', shell: true });
} catch (err) {
  console.log('⚠️ Windows 환경이면 아래 명령어를 대신 사용하세요:');
  console.log('Remove-Item -Recurse -Force .git (PowerShell)');
}

try {
  console.log('🔹 새 Git 저장소 초기화...');
  execSync('git init', { stdio: 'inherit' });

  console.log('🔹 새 원격 저장소 연결...');
  execSync(`git remote add origin ${REMOTE_URL}`, { stdio: 'inherit' });

  console.log('🔹 첫 커밋 생성...');
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "✨feat: initial commit"`, { stdio: 'inherit' });

  console.log('🔹 기본 브랜치 설정 및 push...');
  execSync('git branch -M feature', { stdio: 'inherit' });
  execSync('git push -u origin feature', { stdio: 'inherit' });

  console.log('✅ Git 리셋 및 새 원격 연결 완료!');
} catch (err) {
  console.error('❌ 오류 발생:', err.message);
}
