const http = require('http');
const fs = require('fs');
const db = require('./db.json');
const { v4: uuidv4 } = require('uuid');

const hostname = '127.0.0.1';
const port = 4000;

const server = http.createServer((req, res) => {
  const { url, method } = req; // method GET | POST | PUT | DELETE

  const routes = {
    '/students': () => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(db.students));
    },
    '/energy': () => {
      if (method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(db.energy));
      } else if (method === 'POST') {
        let bodyString = '';

        // Data is sent in chunks, collect them and store the whole data in bodyString
        req.on('data', (chunk) => (bodyString += chunk));
        // When all data is collected from the server
        req.on('end', () => {
          const body = JSON.parse(bodyString);
          const energyLevel = { ...body, id: uuidv4() };

          db.energy.push(energyLevel);

          fs.writeFile(
            'db.json',
            JSON.stringify(db, null, 2),
            'utf8',
            (error) => {
              res.statusCode = error ? 500 : 200;
              const response = error ? error : energyLevel;
              res.end(JSON.stringify(response));
            }
          );
        });

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(db.energy));
      }
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
