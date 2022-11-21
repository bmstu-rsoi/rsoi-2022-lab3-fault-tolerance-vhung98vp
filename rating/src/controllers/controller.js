const Rating = require('../models/rating');

class RatingController {
    static getRatingByUsername = async(req, res, next) => {
        let username = req.headers['x-user-name'];
        const rating = await Rating.findOne({where: {username}});
        if(rating){
            return res.status(200).json({stars: rating.stars});
        } else {
            return res.status(404).json({message: "Rating not found"});
        }        
    }

    static updateRatingByUsername = async(req, res, next) => {
        let username = req.headers['x-user-name'];
        let rating = await Rating.findOne({where: {username}});
        if(rating){
            await Rating.update({stars: req.body.stars}, {where: {username}});
            return res.status(200).json();
        } else {
            return res.status(404).json({message: "Rating not found"});
        }  
    }

}

module.exports = RatingController;