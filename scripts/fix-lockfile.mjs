import { execSync } from 'child_process';
import { unlinkSync, existsSync } from 'fs';

const projectDir = '/vercel/share/v0-project';

// Remove conflicting lock files
for (const file of ['pnpm-lock.yaml', 'package-lock.json']) {
  const filePath = `${projectDir}/${file}`;
  if (existsSync(filePath)) {
    unlinkSync(filePath);
    console.log(`Removed ${file}`);
  }
}

// Regenerate package-lock.json from package.json
console.log('Regenerating package-lock.json...');
execSync('npm install --package-lock-only', {
  cwd: projectDir,
  stdio: 'inherit',
});
console.log('Done! package-lock.json is now in sync with package.json.');
