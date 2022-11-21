const express = require('express');
const library = require('./routes/library');
const books = require('./routes/books');

const app = express();
app.use(express.json());

app.use('/libraries', library);
app.use('/books', books);

app.get('/manage/health', function(req, res) {
    return res.status(200).json({});
})

module.exports = app;