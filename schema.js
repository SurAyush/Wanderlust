const joi = require('joi');
//schema validation

module.exports.listingSchema = joi.object({
    listings: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        image: joi.string().allow("",null),
        price: joi.number().required().min(0)
    }).required()
});

module.exports.reviewSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        content: joi.string().required()
    }).required()
});