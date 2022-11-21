const db = require('./database');
const app = require('./app');
const PORT = process.env.RESERVATION_PORT || 8070;

db.sync().then(() => {
    app.listen(PORT);
    console.log(`Reservation service running on port ${PORT}`);
}).catch(error => {
    console.error(error);
});