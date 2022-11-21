const request = require('supertest');
const faker = require('@faker-js/faker').faker;
const uuid = require('uuid');
const app = require('../app');
const Books = require('../models/books');
const LibraryBooks = require('../models/library_books');

describe('Test book controller', () => {
    let book;
    let book_uid;

    beforeEach(() => {
        book_uid = uuid.v4();
        book = {
            id: faker.datatype.number(100),
            book_uid: book_uid,
            name: faker.datatype.string(20),
            author: faker.name.fullName(),
            genre: faker.datatype.string(20),
            condition: faker.helpers.arrayElement(['EXCELLENT', 'GOOD', 'BAD'])
        }
    });

    afterEach(() => {
        book_uid = null;
        book = null;
    });

    describe('Get book by uid', () => {
        it('Should success', async() => {
            Books.findOne = jest.fn().mockResolvedValue(book);
            await request(app)
                .get(`/books/${book_uid}`)
                .send()
                .expect(200)
                .then(res => { expect(res.body.bookUid == book_uid) });
        })

        it('Should fail', async() => {
            Books.findOne = jest.fn().mockResolvedValue(null);
            await request(app)
                .get(`/books/${book_uid}`)
                .send()
                .expect(404);
        })
    })

    describe('Update book by uid', () => {
        let libraryBook;
        let condition;

        beforeEach(() => {
            libraryBook = {
                library_id: faker.datatype.number(100),
                book_id: book.id,
                available_count: faker.datatype.number(100)
            }
            condition = faker.helpers.arrayElement(['EXCELLENT', 'GOOD', 'BAD']);
        });
    
        afterEach(() => {
            libraryBook = null;
            condition = null;
        });


        it('Should success', async() => {
            let book_updated = {condition, ...book};
            Books.findOne = jest.fn().mockResolvedValue(book);
            Books.update = jest.fn().mockResolvedValue(book_updated);
            LibraryBooks.findOne = jest.fn().mockResolvedValue(libraryBook);
            LibraryBooks.update = jest.fn().mockResolvedValue(libraryBook);

            await request(app)
                .patch(`/books/${book_uid}`)
                .send({condition})
                .expect(200);
        })

        it('Should fail', async() => {
            Books.findOne = jest.fn().mockResolvedValue(null);
            await request(app)
                .patch(`/books/${book_uid}`)
                .send({condition})
                .expect(404);
        })
        
    })
})
