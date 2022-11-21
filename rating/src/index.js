const db = require('./database');
const app = require('./app');
const PORT = process.env.RATING_PORT || 8050;

db.sync().then(() => {
    app.listen(PORT);
    console.log(`Rating service running on port ${PORT}`);
}).catch(error => {
    console.error(error);
});