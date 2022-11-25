const axios = require('axios');
const CircuitBreaker = require('./CircuitBreaker');
const RATING_URL = process.env.RATING_URL || 'http://localhost:8050';
const LIBRARY_URL = process.env.LIBRARY_URL || 'http://localhost:8060';
const RESERVATION_URL = process.env.RESERVATION_URL || 'http://localhost:8070';

function ratingRequest() {
    return new Promise((resolve, reject) => {
        axios.get(RATING_URL + '/manage/health')
            .then(response => {
                if (response.status !== 200) {
                    return reject(new Error(`Expected status code 200, instead got ${response.status}`));
                }        
                resolve(response.data);
            })
            .catch(reject);
    });
}

function libraryRequest() {
    return new Promise((resolve, reject) => {
        axios.get(LIBRARY_URL + '/manage/health')
            .then(response => {
                if (response.status !== 200) {
                    return reject(new Error(`Expected status code 200, instead got ${response.status}`));
                }        
                resolve(response.data);
            })
            .catch(reject);
    });
}

function reservationRequest() {
    return new Promise((resolve, reject) => {
        axios.get(RESERVATION_URL + '/manage/health')
            .then(response => {
                if (response.status !== 200) {
                    return reject(new Error(`Expected status code 200, instead got ${response.status}`));
                }        
                resolve(response.data);
            })
            .catch(reject);
    });
}

const ratingBreaker = new CircuitBreaker(ratingRequest);
const libraryBreaker = new CircuitBreaker(libraryRequest);
const reservationBreaker = new CircuitBreaker(reservationRequest);
const BREAKERS = [ratingBreaker, libraryBreaker, reservationBreaker];

module.exports = BREAKERS;
