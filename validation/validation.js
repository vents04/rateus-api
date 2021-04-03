const Joi = require('@hapi/joi');
const mongoose = require('mongoose');

const createWaitlistValidation = data => {
    const schema = Joi.object({
        address: Joi.string().max(1000).required(),
        emailOrPhone: Joi.string().max(1000).required()
    });
    return schema.validate(data);
}

const loginValidation = data => {
    const schema = Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(data);
}

const questionnaireValiation = data => {
    const schema = Joi.object({
        questions: Joi.array().items({
            title: Joi.string().required(),
            input: Joi.number().required()
        }),
        title: Joi.string().required(),
        _id: mongoose.Types.ObjectId
    })
    return schema.validate(data);
}

const createAnswerValidation = data => {
    const schema = Joi.object({
        answers: Joi.array().items({
            answer: Joi.string().required(),
            input: Joi.number().required()
        }),
        questionnaireId: mongoose.Types.ObjectId
    })
    return schema.validate(data);
}

module.exports.createWaitlistValidation = createWaitlistValidation;
module.exports.loginValidation = loginValidation;
module.exports.questionnaireValiation = questionnaireValiation;
module.exports.createAnswerValidation = createAnswerValidation;