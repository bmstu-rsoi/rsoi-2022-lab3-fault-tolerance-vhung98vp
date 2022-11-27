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

module.exports = rsmq;