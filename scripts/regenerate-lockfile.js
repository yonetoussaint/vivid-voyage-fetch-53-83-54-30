const { execSync } = require('child_process');

const projectDir = '/vercel/share/v0-project';

console.log('Regenerating package-lock.json...');
execSync('npm install --package-lock-only', {
  cwd: projectDir,
  stdio: 'inherit',
});
console.log('Done! package-lock.json is now in sync with package.json.');
