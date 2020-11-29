const http = require('http');

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
        res.end(
          'Hello World!  你好世界! 你好世界! 你好世界! 你好世界! 你好世界! 你好世界! 你好世界! 你好世界!'
        );
      });
  })
  .listen(8088);

console.log('server started listen to 8088================================');
