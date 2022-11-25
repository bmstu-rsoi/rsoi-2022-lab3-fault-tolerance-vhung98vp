const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const ROUTES = require('./routes');
const BREAKERS = require('./breakers');
const rsmq = require('./rsmq');

const app = express();
app.use(morgan('combined'));

ROUTES.forEach(item => {
    app.use(item.url, [item.validation, createProxyMiddleware(item.options)])
})  

app.get('/manage/health', function(req, res) {
    return res.status(200).json({});
})

app.patch('/manage/queue', function(req, res) {
    let message = JSON.stringify(req.body.failReq);
    rsmq.sendMessage({
        qname: "APPQUEUE",
        message: message,
        delay: 0
    }, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    return res.status(200).json({});
})

setInterval(() => {
    BREAKERS.forEach(breaker => {
        breaker
            .fire()
            //.then(console.log)
            //.catch(console.error)
    });
}, 3000)   // Try after 5s

module.exports = app;