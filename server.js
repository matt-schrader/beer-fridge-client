const express = require('express');
const proxy = require('express-http-proxy');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

const proxyHost = process.env.PROXY_HOST || 'beer-fridge'
console.log(`Proxying host ${proxyHost}`);
app.use('/', proxy(proxyHost));

const port = process.env.PORT || 3333;
app.listen(port);

console.log(`Beer Fridge Client listening on ${port}`);