const Basejoi = require('joi');

const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const joi = Basejoi.extend(extension);



module.exports.campgroundSchema = joi.object({
    campground: joi.object({
         // Added author field
        title: joi.string().required().max(40).escapeHTML(),
        price: joi.number().required().min(0),
        location: joi.string().required().escapeHTML(),
        image:  joi.array().items(joi.object({
            url: joi.string().required(),
            filename: joi.string().required()
        })),
        description: joi.string().required().escapeHTML()
    }).required(),
    deleteImages: joi.array()
})


module.exports.reviewSchema =  joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        body:joi.string().required().escapeHTML(),
    }).required()
})