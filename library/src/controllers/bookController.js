const Books = require('../models/books');
const LibraryBooks = require('../models/library_books');

class BookController {
    static getBookByUid = async(req, res, next) => {
        const book = await Books.findOne({
            where: {book_uid: req.params.bookUid}
        });
        if(book) {
            let resObj = {
                bookUid: book.book_uid,
                name: book.name,
                author: book.author,
                genre: book.genre,
                condition: book.condition,
            }
            return res.status(200).json(resObj);
        } else {
            return res.status(404).json({message: "Book not found"});
        }
    }

    static updateBookByUid = async(req, res, next) => {
        let book = await Books.findOne({where: {book_uid: req.params.bookUid}});
        if(!book) {
            return res.status(404).json({message: "Book not found"});
        }

        let libraryBook = await LibraryBooks.findOne({
            where: {book_id: book.id}
        });
        let count = libraryBook.available_count;
        if(req.body.rent) {
            if(count == 0){
                return res.status(400).json();
            }
            count -= 1;
        } else {
            count += 1;
        }

        try {
            if(req.body.condition){
                await Books.update({condition: req.body.condition}, { where: { book_uid: req.params.bookUid }});
            }
            await LibraryBooks.update({available_count: count}, { where: { book_id: book.id} });
        } catch (error) {
            return res.status(500).send({message: error})
        }
        return res.status(200).json();        
    }
}

module.exports = BookController;