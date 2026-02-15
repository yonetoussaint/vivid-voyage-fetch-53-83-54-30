import { execSync } from 'child_process';

const projectDir = '/vercel/share/v0-project';

try {
  console.log('Removing stale pnpm-lock.yaml if present...');
  try {
    execSync('rm -f pnpm-lock.yaml', { cwd: projectDir });
  } catch (e) {
    // ignore
  }

  console.log('Regenerating package-lock.json...');
  execSync('npm install --package-lock-only --ignore-scripts', {
    cwd: projectDir,
    stdio: 'inherit',
    timeout: 120000,
  });
  console.log('Done! package-lock.json is now in sync with package.json.');
} catch (error) {
  console.error('Failed:', error.message);
  process.exit(1);
}
