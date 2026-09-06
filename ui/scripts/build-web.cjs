const path = require('node:path');
const { spawnSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const result = spawnSync(process.execPath, [
  path.join(root, 'node_modules/expo/bin/cli'), 'export', '--platform', 'web',
  '--output-dir', path.join(root, '..', 'app'),
], { cwd: root, stdio: 'inherit', env: { ...process.env, EXPO_NO_DOTENV: '1' } });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
