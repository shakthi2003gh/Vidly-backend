const mongoose = require("mongoose");
const Joi = require("joi");

const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: { type: String, minlength: 3, maxlength: 50, required: true },
    phone: { type: String, minlength: 10, maxlength: 10, required: true },
    isGold: { type: Boolean, default: false, required: true },
  })
);

function validateCustomer(customer) {
  return Joi.validate(customer, {
    name: Joi.string().min(3).max(50),
    phone: Joi.string().min(10).max(10),
    isGold: Joi.boolean(),
  });
}

exports.Customer = Customer;
exports.validate = validateCustomer;
