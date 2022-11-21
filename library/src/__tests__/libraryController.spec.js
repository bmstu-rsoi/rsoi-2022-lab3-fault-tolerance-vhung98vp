const request = require('supertest');
const faker = require('@faker-js/faker').faker;
const uuid = require('uuid');
const app = require('../app');
const Library = require('../models/library');
const Books = require('../models/books');
const LibraryBooks = require('../models/library_books');

describe('Test library controller', () => {
    let library;
    let library_uid;

    beforeEach(() => {
        library_uid = uuid.v4();
        library = {
            id: faker.datatype.number(100),
            library_uid: library_uid,
            name: faker.name.fullName(),
            address: faker.address.street(),
            city: faker.address.city()
        }
    });

    afterEach(() => {
        library = null;
        library_uid = null;
    });

    describe('Get library by uid', () => {
        it('Should success', async() => {
            Library.findOne = jest.fn().mockResolvedValue(library);
            await request(app)
                .get(`/libraries/${library_uid}`)
                .send()
                .expect(200)
                .then(res => { expect(res.body.libraryUid == library_uid) });
        })

        it('Should fail', async() => {
            Library.findOne = jest.fn().mockResolvedValue(null);
            await request(app)
                .get(`/libraries/${library_uid}`)
                .send()
                .expect(404);
        })
    })

    describe('Get libraries by city', () => {            
        it('Should success', async() => {
            let city = library.city;    
            Library.findAndCountAll = jest.fn().mockResolvedValue({count: 1, rows: [library]});
            await request(app)
                .get(`/libraries?city=${city}`)
                .send()
                .expect(200);
        })
        
    })

    describe('Get books by library', () => {
        let book;
        let libraryBook;

        beforeEach(() => {
            book = {
                id: faker.datatype.number(100),
                book_uid: faker.datatype.string(20),
                name: faker.datatype.string(20),
                author: faker.name.fullName(),
                genre: faker.datatype.string(20),
                condition: faker.helpers.arrayElement(['EXCELLENT', 'GOOD', 'BAD'])
            }
            libraryBook = {
                library_id: library.id,
                book_id: book.id,
                available_count: faker.datatype.number(100)
            }
        });
    
        afterEach(() => {
            book = null;
            libraryBook = null;
        });


        it('Should success', async() => {
            Library.findOne = jest.fn().mockResolvedValue(library);
            LibraryBooks.findAndCountAll = jest.fn().mockResolvedValue({count: 1, rows: [libraryBook]});
            Books.findByPk = jest.fn().mockResolvedValue(book);

            await request(app)
                .get(`/libraries/${library_uid}/books`)
                .send()
                .expect(200);
        })

        it('Should fail', async() => {
            Library.findOne = jest.fn().mockResolvedValue(null);
            await request(app)
                .get(`/libraries/${library_uid}/books`)
                .send()
                .expect(404);
        })
        
    })
})
