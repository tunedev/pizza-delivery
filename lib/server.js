/**
 * Entry to the app
 */

const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');
const config = require('../lib/config');
const handlers = require('./handlers');

const server = {};

server.routes = {
  ping: handlers.ping,
};

server.logic = (req, res) => {
  console.log('request object header of lele', req.headers, req.protocol);
  const baseURL = `${req.protocol}:${req.headers.host}`;
  const URLObject = new url.URL(req.url, baseURL);

  // Get path
  const stringPath = URLObject.pathname;
  const path = stringPath.replace(/^\/+|\/+$/g, '');

  const method = req.method.toUpperCase();

  const query = URLObject.searchParams;

  const headers = URLObject.headers;

  const decode = new StringDecoder();
  let buffer = '';
  req.on('data', (data) => {
    buffer += decode.write(data);
  });

  req.on('end', () => {
    buffer += decode.end();

    const data = {
      path,
      query,
      method,
      headers,
      body: helpers.parseJSONToObj(buffer),
    };

    const selectedHandler =
      typeof server.routes[path] !== 'undefined'
        ? server.routes[path]
        : handlers.notFound;

    console.log('Data ->', data);

    console.log('select Handler', selectedHandler);

    selectedHandler(data, (responseCode, payload) => {
      const statusCode = typeof responseCode === 'number' ? responseCode : 200;

      payload = typeof payload === 'object' ? payload : {};

      const stringPayload = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(stringPayload);

      // log the request info to the console
      console.group('request info');
      console.log('Method', method);
      console.log('Path', path);
      console.log('Query', query);
      console.log('Headers', headers);
      console.log('request Payload', buffer);
      console.groupEnd();
    });
  });
};
server.httpServer = http.createServer((req, res) => {
  req.protocol = 'http';
  server.logic(req, res);
});

server.httpsServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, './https/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './https/cert.perm')),
  },
  (req, res) => {
    req.protocol = 'https';
    server.logic(req, res);
  }
);

const { httpPort, httpsPort } = config;

// Init script
server.init = () => {
  server.httpServer.listen(httpPort, () => {
    console.log(
      `checkout the server on http://localhost:${httpPort} in ${config.envName} mode`
    );
  });

  server.httpsServer.listen(httpsPort, () => {
    console.log(
      `checkout the server on https://localhost:${httpsPort} in ${config.envName} mode`
    );
  });
};

module.exports = server;
