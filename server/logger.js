// server/logger.js
import fs from 'fs';
import path from 'path';

const logPath = path.join(process.cwd(), 'logs.txt');

export function logEvent(event) {
  const timestamp = new Date().toISOString();
  fs.appendFile(logPath, `[${timestamp}] ${event}\n`, err => {
    if (err) console.error('Logging error: ', err);
  });
}
