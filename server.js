const http = require('http');
const filesystem = require('fs');
const db = require('./db.json')

const hostname = '127.0.0.1';
const port = 4000;

const server = http.createServer((req, res) => {
  const { url, method } = req;

  const routes = {
    '/students': () => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(db.students));
    },
    404: () => {
      res.setHeader('Content-Type', 'text/html');
      const errorPage = filesystem.readFileSync('404.html');
      res.end(errorPage);
    },
  };

  // url = '/students'
  // routes['/students'] = fn() -> "method invocation" / "call a function" ()
  routes[url] ? routes[url]() : routes[404]();
});

server.listen(port, hostname, () => {
  console.log(`Server started on port http://${hostname}:${port}`);
});
