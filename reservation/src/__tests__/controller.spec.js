const request = require('supertest');
const faker = require('@faker-js/faker').faker;
const axios = require('axios');
const uuid = require('uuid');
const app = require('../app');
const Reservation = require('../models/reservation');

describe('Test reservation controller', () => {
    let reservation;
    let reservation_uid;
    let library_uid;
    let book_uid;
    let username;

    beforeEach(() => {
        reservation_uid = uuid.v4();
        library_uid = uuid.v4();
        book_uid = uuid.v4();
        username = faker.datatype.string(20);
        let startDate = faker.date.between();        
        reservation = {
            id: faker.datatype.number(100),
            reservation_uid: reservation_uid,
            status: faker.helpers.arrayElement(['RENTED', 'RETURNED', 'EXPIRED']),
            start_date: startDate,
            till_date: faker.date.between(startDate, new Date()),
            username: username,
            library_uid: library_uid,
            book_uid: book_uid
        }
    });

    afterEach(() => {
        reservation = null;
        reservation_uid = null;
        library_uid = null;
        book_uid = null;
        username = null;
    });

    describe('Get reservation by username', () => {
        it('Should success', async() => {
            Reservation.findAll = jest.fn().mockResolvedValue([reservation]);
            axios.get = jest.fn().mockResolvedValue({data: {}});
            await request(app)
                .get(`/reservations`)
                .set('x-user-name', username)
                .send()
                .expect(200);
        })

    })

    describe('Take book', () => {
        let tillDate;
        beforeEach(() => {
            tillDate = faker.date.between()
        });
    
        afterEach(() => {
            tillDate = null;
        });

        it('Should success', async() => {
            Reservation.count = jest.fn().mockResolvedValue(0);
            axios.get = jest.fn().mockResolvedValueOnce({data: {stars: 10}}).mockResolvedValue({data: {}});
            axios.patch = jest.fn().mockResolvedValue({});
            Reservation.create = jest.fn().mockResolvedValue(reservation);
            await request(app)
                .post(`/reservations`)
                .set('x-user-name', username)
                .send({bookUid: book_uid, libraryUid: library_uid, tillDate})
                .expect(200);
        })

        it('Should fail', async() => {
            Reservation.count = jest.fn().mockResolvedValue(0);
            axios.get = jest.fn().mockResolvedValueOnce({data: {stars: 10}}).mockResolvedValue({data: {}});
            Reservation.create = jest.fn().mockRejectedValue(new Error());
            await request(app)
                .post(`/reservations`)
                .set('x-user-name', username)
                .send({bookUid: book_uid, libraryUid: library_uid, tillDate})
                .expect(400);
        })
    })

    describe('Return book', () => {
        let condition;
        let date;

        beforeEach(() => {
            condition = faker.helpers.arrayElement(['EXCELLENT', 'GOOD', 'BAD']);
            date = faker.date.between(reservation.startDate, reservation.tillDate);
        });
    
        afterEach(() => {
            condition = null;
            date = null;
        });

        it('Should success', async() => {
            Reservation.findOne = jest.fn().mockResolvedValue(reservation);
            Reservation.update = jest.fn().mockResolvedValue({});
            axios.get = jest.fn().mockResolvedValueOnce({data: {stars: 10}}).mockResolvedValue({data: {}});
            axios.patch = jest.fn().mockResolvedValue({});
            await request(app)
                .post(`/reservations/${reservation_uid}/return`)
                .set('x-user-name', username)
                .send({condition, date})
                .expect(204);
        })

        it('Should fail', async() => {
            Reservation.findOne = jest.fn().mockResolvedValue(null);
            await request(app)
                .post(`/reservations/${reservation_uid}/return`)
                .set('x-user-name', username)
                .send({condition, date})
                .expect(404);
        })
    
    })

})
