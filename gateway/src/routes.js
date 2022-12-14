const RATING_URL = process.env.RATING_URL || 'http://localhost:8050';
const LIBRARY_URL = process.env.LIBRARY_URL || 'http://localhost:8060';
const RESERVATION_URL = process.env.RESERVATION_URL || 'http://localhost:8070';
const BREAKERS = require('./breakers');

const onReservationReq = function (req, res, next) {
    console.log("On Reservation req")
    if(BREAKERS[2].state == "OPEN") {
        res.status(503).send({message: "Reservation Service unavailable"})
    } else {
        next();
    }
};
const onLibraryReq = function (req, res, next) {
    console.log("On Library req")
    if(BREAKERS[1].state == "OPEN") {
        res.status(503).send({message: "Library Service unavailable"})
    } else {
        next();
    }
};
const onRatingReq = function (req, res, next) {
    console.log("On Rating req")
    if(BREAKERS[0].state == "OPEN") {
        res.status(503).send({message: "Bonus Service unavailable"})
    } else {
        next();
    }
};
const onRatingError = function(err, req, res, target) {
    console.log("On Rating res")
    BREAKERS[0].failureCount += 1;
    res.status(503).send({message: "Bonus Service unavailable"})
}

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
            pathRewrite: {'^/api/v1' : ''},
            onError: onRatingError
        }
    }
]

module.exports = ROUTES;