const { spawn } = require('child_process');
const http = require('http');

console.log('Starting Next.js server...');
const server = spawn('npm', ['run', 'start'], { stdio: 'pipe' });

server.stdout.on('data', (data) => {
  if (data.toString().includes('started server on')) {
    console.log('Server is up. Querying /study/eczema_md...');
    setTimeout(() => {
      http.get('http://localhost:3000/study/eczema_md', (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        let body = '';
        res.on('data', d => body += d);
        res.on('end', () => {
          if (body.includes('Diagnostic: No Trials Found')) {
            console.log('RESULT: FOUND DIAGNOSTIC (404)');
          } else if (body.includes('Currently tracking')) {
            console.log('RESULT: FOUND SUCCESS (200 OK STATE HUB MATCHES)');
          } else if (body.includes('Page Not Found')) {
            console.log('RESULT: FOUND 404 PAGE (GENERIC)');
          } else {
            console.log('RESULT: UNKNOWN CONTENT');
          }
           server.kill('SIGINT');
           process.exit();
        });
      });
    }, 2000);
  }
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
