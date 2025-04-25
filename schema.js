const Joi = require('joi');

const validCategories = [
    "Trending",
    "Iconic cities",
    "Rooms",
    "Mountains",
    "Castles",
    "Amazing Pools",
    "Camping",
    "Farms",
    "Arctic",
    "Domes",
    "New"
  ];

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        category: Joi.string().valid(...validCategories).required()
    }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
       rating: Joi.number().required().min(1).max(5),
       comment: Joi.string().required(),
    }).required()
})