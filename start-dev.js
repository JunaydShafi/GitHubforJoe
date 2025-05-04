// start-dev.js
import { spawn } from 'child_process';

const proc = spawn('nodemon', ['backend/server.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_OPTIONS: '--openssl-legacy-provider'
  }
});

proc.on('close', (code) => {
  process.exit(code);
});
