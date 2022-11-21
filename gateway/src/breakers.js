const axios = require('axios');
const CircuitBreaker = require('./CircuitBreaker');
const RATING_URL = process.env.RATING_URL || 'http://localhost:8050';
const LIBRARY_URL = process.env.LIBRARY_URL || 'http://localhost:8060';
const RESERVATION_URL = process.env.RESERVATION_URL || 'http://localhost:8070';

function unstableRequest(host) {
    return new Promise((resolve, reject) => {
        let response;
        try {
            response = axios.get(host + '/manage/health');
            resolve({message: "Success"})
        } catch(error) {
            reject({message: error})
        }
    })
}
const ratingBreaker = new CircuitBreaker(unstableRequest(RATING_URL));
const libraryBreaker = new CircuitBreaker(unstableRequest(LIBRARY_URL));
const reservationBreaker = new CircuitBreaker(unstableRequest(RESERVATION_URL));
const BREAKERS = [ratingBreaker, libraryBreaker, reservationBreaker];

module.exports = BREAKERS;
