const Joi = require('joi');

module.exports.backtestingSchema = Joi.object({
    asset: Joi.string().required(),
    strategy: Joi.string().required(),
    sYear: Joi.string().required(),
    eYear: Joi.string().required(),
    transDay: Joi.string().required(),
    sLeg: Joi.number().required().greater(0).less(11),
    lLeg: Joi.number().required().greater(0).less(21),
    offset: Joi.string().required()
});


module.exports.findRICSchema = Joi.object({
    asset: Joi.string().required(),
    maturity: Joi.string().required(),
    strike: Joi.number().required(),
    type: Joi.string().required()
});
