const http = require('http');
const fs = require('fs');
const response = fs.readFileSync('./response.html', { encoding: 'utf8' });

http
  .createServer((req, res) => {
    let body = [];
    req
      .on('error', (err) => {
        console.error(err);
      })
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('body', body);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(response);
      });
  })
  .listen(8088);

console.log('server started listen to 8088================================');
