const Joi = require('joi');

module.exports.backtestingSchema = Joi.object({
    asset: Joi.string().required(),
    strategy: Joi.string().required(),
    sYear: Joi.string().required(),
    eYear: Joi.string().required(),
    transDay: Joi.string().required(),
    sLeg: Joi.number().required().greater(0).less(20),
    lLeg: Joi.number().required().greater(0).less(20),
    offset: Joi.string().required()
});