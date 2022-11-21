const db = require('./database');
const app = require('./app');
const PORT = process.env.LIBRARY_PORT || 8060;

db.sync().then(() => {
    app.listen(PORT);
    console.log(`Library service running on port ${PORT}`);
}).catch(error => {
    console.error(error);
});