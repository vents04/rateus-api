const Joi = require('@hapi/joi');

const createWaitlistValidation = data => {
    const schema = Joi.object({
        address: Joi.string().max(1000).required(),
        emailOrPhone: Joi.string().max(1000).required()
    });
    return schema.validate(data);
}

module.exports.createWaitlistValidation = createWaitlistValidation;