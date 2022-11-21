const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const ROUTES = require('./routes');
const BREAKERS = require('./breakers');

const app = express();
app.use(morgan('combined'));

ROUTES.forEach(item => {
    app.use(item.url, [item.validation, createProxyMiddleware(item.options)])
})  

setInterval(() => {
    BREAKERS.forEach(breaker => {
        breaker
            .fire()
            .then(console.log)
            .catch(console.error)
    });
}, 30000)   // Try after 30s

module.exports = app;