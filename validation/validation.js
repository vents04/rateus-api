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

const signupValidation = data => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        phone: Joi.string().required(),
        password: Joi.string().required().min(8)
    });
    return schema.validate(data);
}

const questionnaireValidation = data => {
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
            answer: Joi.string().optional().allow('').allow(null),
            input: Joi.number().required()
        }),
        questionnaireId: mongoose.Types.ObjectId
    })
    return schema.validate(data);
}

const subscriptionValidation = data => {
    const schema = Joi.object({
        planId: Joi.string().required()
    })
    return schema.validate(data);
}

const questionnaireCreationValidation = data => {
    const schema = Joi.object({
        title: Joi.string().required(),
    })
    return schema.validate(data);
}

module.exports.createWaitlistValidation = createWaitlistValidation;
module.exports.loginValidation = loginValidation;
module.exports.questionnaireValidation = questionnaireValidation;
module.exports.questionnaireValidation = questionnaireValidation;
module.exports.createAnswerValidation = createAnswerValidation;
module.exports.signupValidation = signupValidation;
module.exports.subscriptionValidation = subscriptionValidation;
module.exports.questionnaireCreationValidation = questionnaireCreationValidation;
