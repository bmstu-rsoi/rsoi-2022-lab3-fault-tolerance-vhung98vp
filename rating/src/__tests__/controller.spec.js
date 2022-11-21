const request = require('supertest');
const faker = require('@faker-js/faker').faker;
const app = require('../app');
const Rating = require('../models/rating');

describe('Test rating controller', () => {
    let username;
    let rating;

    beforeEach(() => {
        username = faker.datatype.string(20);
        rating = {
            id: faker.datatype.number(100),
            username: username,
            stars: faker.datatype.number(100)
        }
    });

    afterEach(() => {
        username = null;
        rating = null;
    });

    describe('Get rating by username', () => {
        it('Should success', async() => {
            Rating.findOne = jest.fn().mockResolvedValue(rating);
            await request(app)
                .get(`/rating`)
                .set('x-user-name', username)
                .send()
                .expect(200)
                .then(res => { expect(res.body.stars == rating.stars) });
        })

        it('Should fail', async() => {
            Rating.findOne = jest.fn().mockResolvedValue(null);
            await request(app)
                .get(`/rating`)
                .set('x-user-name', username)
                .send()
                .expect(404);
        })
    })

    describe('Update rating by username', () => {
        it('Should success', async() => {
            Rating.findOne = jest.fn().mockResolvedValue(rating);
            Rating.update = jest.fn().mockResolvedValue(null);
            await request(app)
                .patch(`/rating`)
                .set('x-user-name', username)
                .send({stars: rating.stars + 1})
                .expect(200);
        })

        it('Should fail', async() => {
            Rating.findOne = jest.fn().mockResolvedValue(null);
            await request(app)
                .patch(`/rating`)
                .set('x-user-name', username)
                .send({stars: rating.stars + 1})
                .expect(404);
        })
    })

})
