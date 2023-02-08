const express = require("express");
const { Customer, validate } = require("../models/customer");

const router = express.Router();

router.get("/", async (_, res) => {
  const customers = await Customer.find().sort("name");

  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send("Customer not found");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const { value, error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: value.name,
    phone: value.phone,
    isGold: value.isGold,
  });

  customer = await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { value, error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, value, {
    new: true,
  });

  if (!customer)
    return res
      .status(404)
      .send("The customer with id " + req.params.id + " does not exist");

  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with id " + req.params.id + " does not exist");

  res.send(customer);
});

module.exports = router;
