const path = require('node:path');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, '..', 'app');
const result = spawnSync(process.execPath, [
  path.join(root, 'node_modules/expo/bin/cli'), 'export', '--platform', 'web',
  '--output-dir', outputDir,
], { cwd: root, stdio: 'inherit', env: { ...process.env, EXPO_NO_DOTENV: '1' } });
if (result.error) throw result.error;
if ((result.status ?? 1) === 0) {
  fs.copyFileSync(path.join(root, 'assets/images/biomind-logo.png'), path.join(outputDir, 'biomind-logo.png'));
}
process.exit(result.status ?? 1);
