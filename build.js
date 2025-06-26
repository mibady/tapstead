// Simple script to run Next.js build directly
const nextBuild = require('next/dist/build').default;
const { resolve } = require('path');

const dir = resolve('./');
console.log('Starting Next.js build...');
console.log('Project directory:', dir);

try {
  // Set environment variable to help with debugging
  process.env.NODE_OPTIONS = '--trace-warnings --max-old-space-size=4096';
  
  nextBuild(dir)
    .then(() => {
      console.log('Build completed successfully!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Build failed:', err);
      process.exit(1);
    });
} catch (error) {
  console.error('Error starting build:', error);
  process.exit(1);
}
