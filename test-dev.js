#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Next.js dev server...');

const nextDev = spawn('npx', ['next', 'dev', '--port', '3002'], {
  cwd: process.cwd(),
  stdio: ['inherit', 'pipe', 'pipe']
});

let output = '';
let hasStarted = false;

nextDev.stdout.on('data', (data) => {
  const text = data.toString();
  output += text;
  console.log('STDOUT:', text.trim());
  
  if (text.includes('Ready in') || text.includes('compiled successfully')) {
    hasStarted = true;
    console.log('✓ Server appears to be ready!');
  }
});

nextDev.stderr.on('data', (data) => {
  const text = data.toString();
  console.log('STDERR:', text.trim());
});

nextDev.on('close', (code) => {
  console.log(`Process exited with code ${code}`);
});

// Kill after 15 seconds if not ready
setTimeout(() => {
  if (!hasStarted) {
    console.log('⚠ Server taking too long to start, killing process...');
    nextDev.kill('SIGTERM');
    process.exit(1);
  }
}, 15000);