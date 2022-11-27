const axios = require('axios');
const Reservation = require('../models/reservation');
const PORT = process.env.PORT || 8080;
const GATEWAY_URL = (process.env.GATEWAY_URL || 'http://localhost') + ':' + PORT

class ReservationController {
    static getReservationsByUsername = async(req, res, next) => {
        let username = req.headers['x-user-name'];
        const reservations = await Reservation.findAll({where: {username}});
        let items = [];
        let library, book;
        for (const item of reservations){
            // Get data from other services
            try {
                let libResp = await axios.get(GATEWAY_URL + '/api/v1/libraries/' + item.library_uid);
                let bookResp = await axios.get(GATEWAY_URL + '/api/v1/books/' + item.book_uid);
                library = libResp.data;
                book = bookResp.data;
            } catch (error) {
                library = {libraryUid};
                book = {bookUid};
                console.log(error);
            }                
            items.push({
                reservationUid: item.reservation_uid,
                status: item.status,
                startDate: item.start_date.toISOString().slice(0, 10),
                tillDate: item.till_date.toISOString().slice(0, 10),
                book: {bookUid: item.book_uid,...book},
                library: {libraryUid: item.library_uid, ...library}
            });
        }
        return res.status(200).json(items);
    }

    static takeBook = async(req, res, next) => {
        let username = req.headers['x-user-name'];
        let {bookUid, libraryUid, tillDate} = req.body;

        let rentedTotal = await Reservation.count({where: {username, status: 'RENTED'}});
        let stars;
        try {
            let ratingResp = await axios.get(GATEWAY_URL + '/api/v1/rating', {headers: {'x-user-name': username}})
            stars = ratingResp.data.stars;
        } catch (error) {
            return res.status(503).json({ message: "Bonus Service unavailable"});
        }

        if (stars > rentedTotal){
            let library = {libraryUid}, book = {bookUid};
            // Get data from other services
            try {
                await axios.patch(GATEWAY_URL + '/api/v1/books/' + bookUid, {rent: true});
                let libResp = await axios.get(GATEWAY_URL + '/api/v1/libraries/' + libraryUid);
                let bookResp = await axios.get(GATEWAY_URL + '/api/v1/books/' + bookUid);
                library = libResp.data;
                book = bookResp.data;
            } catch (error) {
                return res.status(500).json({ message: error});
            }
            
            // Save order
            try {
                const MODEL = {
                    username: username,
                    book_uid: bookUid,
                    library_uid: libraryUid,
                    status: 'RENTED',
                    start_date: new Date(),
                    till_date: tillDate
                };
                const reservation = await Reservation.create(MODEL);
                let resObj = {
                    reservationUid: reservation.reservation_uid,
                    status: reservation.status,
                    startDate: reservation.start_date.toISOString().slice(0, 10),
                    tillDate: reservation.till_date.toISOString().slice(0, 10),
                    book: book,
                    library: library
                }
                return res.status(200).json(resObj);
            } catch (error) {
                return res.status(400).json({ message: 'Data validation error'})
            }
        } else {
            return res.status(400).json({ message: 'Data validation error'})
        }
        
    }

    static returnBook = async(req, res, next) => {
        let username = req.headers['x-user-name'];
        let reservation_uid = req.params.reservationUid;
        let {condition, date} = req.body;
        let reservation = await Reservation.findOne({where: {username, reservation_uid}});
        if(reservation){
            let starChange = 0;
            if(date > reservation.till_date){
                reservation.status = 'EXPIRED';
                starChange -= 10;
            } else {
                reservation.status = 'RETURNED';
                starChange += 1;
            }
            await Reservation.update({status: reservation.status}, { where: { id: reservation.id} });
            
            try{
                let bookResp = await axios.get(GATEWAY_URL + '/api/v1/books/' + reservation.book_uid);
                let conditionBefore = bookResp.data.condition;
                if(condition != conditionBefore) {
                    starChange -= 10;
                    if (reservation.status = 'RETURNED') {
                        starChange -= 1;
                    }
                }
                await axios.patch(GATEWAY_URL + '/api/v1/books/' + reservation.book_uid, {rent: false, condition});
            } catch (error) {
                let failReq = {method: "patch", url: GATEWAY_URL + '/api/v1/books/' + reservation.book_uid, body: {rent: false, condition}}    
                await axios.patch(GATEWAY_URL + '/manage/queue', {failReq})
                console.log(error);
            }           
            try{
                await axios.patch(GATEWAY_URL + '/api/v1/rating', {stars: starChange}, {headers: {'x-user-name': username}, timeout: 1000});
            } catch (error) {
                let failReq = {method: "patch", url: GATEWAY_URL + '/api/v1/rating', body: {stars: starChange}, headers: {'x-user-name': username}} 
                await axios.patch(GATEWAY_URL + '/manage/queue', {failReq})
                console.log(error);
            }  
            return res.status(204).json();            
        } else {
            return res.status(404).json({message: "Reservation not found"});
        }
        
    }

}

module.exports = ReservationController;