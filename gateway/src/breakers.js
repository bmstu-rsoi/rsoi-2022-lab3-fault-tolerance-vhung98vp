const axios = require('axios');
const CircuitBreaker = require('./CircuitBreaker');
const RATING_URL = process.env.RATING_URL || 'http://localhost:8050';
const LIBRARY_URL = process.env.LIBRARY_URL || 'http://localhost:8060';
const RESERVATION_URL = process.env.RESERVATION_URL || 'http://localhost:8070';

function ratingRequest() {
    return new Promise((resolve, reject) => {
        let response;
        try {
            response = axios.get(RATING_URL + '/manage/health');
            resolve({message: "Success"})
        } catch(error) {
            reject({message: error})
        }
    })
}

function libraryRequest() {
    return new Promise((resolve, reject) => {
        let response;
        try {
            response = axios.get(LIBRARY_URL + '/manage/health');
            resolve({message: "Success"})
        } catch(error) {
            reject({message: error})
        }
    })
}

function reservationRequest() {
    return new Promise((resolve, reject) => {
        let response;
        try {
            response = axios.get(RESERVATION_URL + '/manage/health');
            resolve({message: "Success"})
        } catch(error) {
            reject({message: error})
        }
    })
}

const ratingBreaker = new CircuitBreaker(ratingRequest);
const libraryBreaker = new CircuitBreaker(libraryRequest);
const reservationBreaker = new CircuitBreaker(reservationRequest);
const BREAKERS = [ratingBreaker, libraryBreaker, reservationBreaker];

module.exports = BREAKERS;
