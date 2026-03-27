const Joi = require('joi');

const userSchema = Joi.object({
  fullname: Joi.string().max(100).required(),
  email: Joi.string().email().max(254).required(),
  mobile_number: Joi.string().pattern(/^\+?\d{10,15}$/).required(),
    pass: Joi.string().max(7).required(),

});

module.exports = userSchema;