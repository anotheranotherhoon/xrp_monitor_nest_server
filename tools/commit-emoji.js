const fs = require('fs');
const path = require('path');

const commitTypes = {
  feat: '✨',
  fix: '🐛',
  chore: '🧹',
  docs: '📚',
  refactor: '♻️',
  test: '✅',
  style: '💅',
};

// Husky가 환경 변수를 제대로 전달하지 못할 경우를 대비하여
// Git이 직접 넘겨주는 인자(process.argv[2])를 사용합니다.
const commitMsgFilePath = process.argv[2];

if (!commitMsgFilePath) {
  console.error('Error: The commit message file path could not be found.');
  process.exit(1);
}

const commitMsg = fs.readFileSync(commitMsgFilePath, 'utf-8').trim();

const firstLine = commitMsg.split('\n')[0];
const type = firstLine.split(':')[0].trim();

const emoji = commitTypes[type];

if (emoji) {
  // 수정된 부분: 이모지를 타입 앞에 배치하고 공백을 추가합니다.
  const newCommitMsg = `${emoji} ${type}: ${firstLine
    .substring(firstLine.indexOf(':') + 1)
    .trim()}`;

  fs.writeFileSync(
    commitMsgFilePath,
    newCommitMsg + '\n' + commitMsg.substring(firstLine.length).trim(),
  );
  console.log(`Commit message updated: ${newCommitMsg}`);
} else {
  console.warn(
    'Warning: No emoji found for commit type. Commit message not changed.',
  );
}
