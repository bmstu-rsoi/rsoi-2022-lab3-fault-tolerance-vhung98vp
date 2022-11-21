const express = require('express');
const router = require('./routes/route');

const app = express();
app.use(express.json());

app.use('/reservations', router);

app.get('/manage/health', function(req, res) {
    return res.status(200).json({});
})

module.exports = app;