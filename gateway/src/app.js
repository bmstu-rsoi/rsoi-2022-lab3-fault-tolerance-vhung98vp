const express = require('express');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const ROUTES = require('./routes');
const BREAKERS = require('./breakers');
const rsmq = require('./rsmq');

const app = express();
app.use(morgan('combined'));

ROUTES.forEach(item => {
    app.use(item.url, [item.validation, queue, createProxyMiddleware(item.options)])
})  

app.get('/manage/health', function(req, res) {
    return res.status(200).json({});
})

app.post('/manage/queue', function(req, res) {
    console.log(req.body)
    let message = JSON.stringify({method: "patch", url: 'http://gateway:8080/api/v1/rating', body: {stars: 1}, headers: {'x-user-name': 'Test Max'}} );
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
}, 500)   // Try after 3s

function queue(req, res, next){
    rsmq.receiveMessage({ qname: "APPQUEUE" }, (err, resp) => {
        if (err) {
           console.error(err);
           return;
        }
        if (resp.id) {
            console.log(resp.message);
            let {method, url, headers, body} = JSON.parse(resp.message);
            if(method == 'patch'){
                try {
                    axios.patch(url, body, {headers: headers});
                    rsmq.deleteMessage({ qname: "APPQUEUE", id: resp.id }, (err) => {
                        if (err) {
                           console.error(err);
                           return;
                        }
                        console.log("Deleted message with id", resp.id);
                    });                
                } catch (err) {
                    console.log(err)
                }
            }
        } else {
            console.log("No message in queue");
        }
    });
}

module.exports = app;