import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting 2FA System (Frontend + Backend)...\n');

// Start backend server
console.log('📡 Starting Backend Server (Port 8080)...');
const backendServer = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Wait a moment for backend to start
setTimeout(() => {
  console.log('\n🌐 Starting Frontend Server (Port 3000)...');
  const frontendServer = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backendServer.kill();
    frontendServer.kill();
    process.exit(0);
  });

  frontendServer.on('close', (code) => {
    console.log(`Frontend server exited with code ${code}`);
    backendServer.kill();
  });

}, 2000);

backendServer.on('close', (code) => {
  console.log(`Backend server exited with code ${code}`);
});

console.log('\n📋 System URLs:');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend API: http://localhost:8080');
console.log('   Email API: http://localhost:8080/api/send-email');
console.log('\n🎯 To test 2FA:');
console.log('   1. Go to http://localhost:3000');
console.log('   2. Try logging in with a user account');
console.log('   3. 2FA should trigger automatically');
console.log('   4. Check your Gmail for the verification code'); 