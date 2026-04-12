const { execSync } = require('child_process');
const fs = require('fs');
try {
  const result = execSync('npx prisma generate', { stdio: 'pipe', encoding: 'utf-8' });
  fs.writeFileSync('prisma_output.txt', result);
} catch(e) {
  fs.writeFileSync('prisma_output.txt', e.stdout + '\n' + e.stderr);
}
