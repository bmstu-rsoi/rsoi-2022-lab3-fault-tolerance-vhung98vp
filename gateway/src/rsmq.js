const RedisSMQ = require("rsmq");
const axios = require('axios');
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const rsmq = new RedisSMQ( {host: REDIS_HOST, port: REDIS_PORT, ns: "rsmq"} );

rsmq.createQueue({qname: "APPQUEUE"}, (err) => {
    if (err) {
        if (err.name !== "queueExists") {
            console.error(err);
            return;
        } else {
            console.log("The queue exists. That's OK.");
        }
    }
    console.log("Queue created");
});

setInterval(() => {
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
}, 10000)   // Try after 10s

module.exports = rsmq;