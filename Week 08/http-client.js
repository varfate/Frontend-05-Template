const net = require('net');

/**
 * 请求
 */
class Request {
  constructor(options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.path = options.path || '/';
    this.port = options.port || '80';
    this.headers = options.headers || {};
    this.body = options.body || {};
    this.bodyText = '';
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (this.headers['Content-Type'] === 'application/json') {
      this.body = JSON.stringify(this.body);
    } else if (
      this.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      this.bodyText = Object.keys(this.body)
        .map((key) => `${key}=${this.body[key]}`)
        .join('&');
    }
    this.headers['Content-Length'] = Buffer.byteLength(this.bodyText);
  }

  /**
   * 发送请求
   */
  send() {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();

      const connection = net.createConnection({
        host: this.host,
        port: this.port,
      });

      connection.write(this.toString());

      connection.on('data', (data) => {
        parser.receive(data.toString());
        if (parser.isFinished) {
          resolve(parser.response);
          connection.end();
        }
      });

      connection.on('error', (err) => {
        reject(err);
        connection.end();
      });
    });
  }

  /**
   * 发送到服务端的特殊数据格式
   */
  toString() {
    const headerBlock = Object.keys(this.headers)
      .map((key) => `${key}: ${this.headers[key]}`)
      .join('\r\n');
    return `${this.method} ${this.path} HTTP/1.1\r
${headerBlock}\r
\r
${this.bodyText}`;
  }
}

/**
 * 解析body,拥有自己的状态机
 */
class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }

  /**
   * 逐个处理body中字符
   * @param {String} char 字符
   */
  receiveChar(char) {
    if (this.isFinished) return;
    // 读取返回的body长度,由于body内容可以包含任意字符,无法根据字符判定body的结束
    // 1e\r\n Hello Word!\n\r\n0
    if (this.current === this.WAITING_LENGTH) {
      // 1e\r
      // 如果碰到 \r ,说明表示长度的字符读取完了
      if (char === '\r') {
        // 如果body总长度为0,直接完成,无需再解析
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        // 1
        // 1e
        // 长度是16进制,这里转化为10进制
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      // 1e\r\n
      if (char === '\n') {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
      // 1e\r\n Hello Word!\n
      this.content.push(char);
      this.length -= Buffer.byteLength(char);

      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }
    } else if (this.current === this.WAITING_NEW_LINE) {
      // 1e\r\n Hello Word!\n\r
      if (char === '\r') {
        this.current = this.WAITING_NEW_LINE_END;
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      // 1e\r\n Hello Word!\n\r\n
      if (char === '\n') {
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}

// 解析请求,格式化返回
class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 'status line';
    this.WAITING_STATUS_LINE_END = 'status line end';

    this.WAITING_HEADER_NAME = 'header name';
    this.WAITING_HEADER_SPACE = 'header space';
    this.WAITING_HEADER_VALUE = 'header value';
    this.WAITING_HEADER_LINE_END = 'header line end';
    this.WAITING_HEADER_BLOCK_END = 'header block end';

    this.WAITING_BODY = 'body';
    this.WAITING_BODY_BLOCK = 'body block';
    this.WAITING_BODY_END = 'body block end';

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
  }

  receive(text) {
    let stringifyText = '';
    for (let char of text) {
      stringifyText += JSON.stringify(char).replace(/"/g, '');
      this.receiveChar(char);
    }
    console.log(this.headers);
    console.log(stringifyText);
  }

  receiveChar(char) {
    // HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nDate: Sat, 28 Nov 2020 03:53:52 GMT\r\nConnection: keep-alive\r\nKeep-Alive: timeout=5\r\nTransfer-Encoding: chunked\r\n\r\nc\r\nHello World\n\r\n0\r\n\r\n
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE;
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === ' ') {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
      } else if (char === '\n') {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END;
        if (this.headers['Transfer-Encoding'] === 'chunked') {
          // 别的类型使用别的 bodyParser
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        this.current = this.WAITING_HEADER_NAME;
        this.headerName = char;
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === '\n') {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    // HTTP/1.1 200 OK
    this.statusLine.match(/HTTP\/1.1 (\d+) ([\s\S]+)/);
    console.log(this.statusLine);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(''),
    };
  }
}

void (async function () {
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    path: '/',
    port: '8088',
    headers: {
      'X-Foo': 'custom header',
    },
    body: {
      name: 'qi',
    },
  });
  const response = await request.send();
  console.log('response================================');
  console.log(JSON.stringify(response, null, 2));
})();
