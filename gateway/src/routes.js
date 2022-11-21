const RATING_URL = process.env.RATING_URL || 'http://localhost:8050';
const LIBRARY_URL = process.env.LIBRARY_URL || 'http://localhost:8060';
const RESERVATION_URL = process.env.RESERVATION_URL || 'http://localhost:8070';
const BREAKERS = require('./breakers');

const onReservationReq = function (req, res, next) {
    if(BREAKERS[2].state == "OPEN") {
        res.status(503).send({message: "Reservation Service unavailable"})
    } else {
        next();
    }
};
const onLibraryReq = function (req, res, next) {
    if(BREAKERS[1].state == "OPEN") {
        res.status(503).send({message: "Library Service unavailable"})
    } else {
        next();
    }
};
const onRatingReq = function (req, res, next) {
    if(BREAKERS[0].state == "OPEN") {
        res.status(503).send({message: "Bonus Service unavailable"})
    } else {
        next();
    }
};

const ROUTES = [
    {
        url: '/api/v1/reservations',
        validation: onReservationReq,
        options: {
            target: RESERVATION_URL,
            changeOrigin: true,
            pathRewrite: {'^/api/v1' : ''}
        }
    },
    {
        url: '/api/v1/libraries',
        validation: onLibraryReq,
        options: {
            target: LIBRARY_URL,
            changeOrigin: true,
            pathRewrite: {'^/api/v1' : ''}
        }
    },
    {
        url: '/api/v1/books',
        validation: onLibraryReq,
        options: {
            target: LIBRARY_URL,
            changeOrigin: true,
            pathRewrite: {'^/api/v1' : ''}
        }
    },
    {
        url: '/api/v1/rating',
        validation: onRatingReq,
        options: {
            target: RATING_URL,
            changeOrigin: true,
            pathRewrite: {'^/api/v1' : ''}
        }
    }
]

module.exports = ROUTES;