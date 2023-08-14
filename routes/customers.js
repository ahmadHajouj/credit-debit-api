const express = require("express");
const Customers = require("../models/customers");
const router = express.Router();

const Data = Customers;

router.get("/", async (req, res) => {
  const data = await Data.find().sort("_id");
  res.send(data);
});

router.get("/:id", async (req, res) => {
  const data = await Data.findById(req.params.id);
  res.send(data);
});

router.post("/", async (req, res) => {
  let data = new Data({
    name: req.body.name,
    phone: req.body.phone ? req.body.phone : "05########",
    account: req.body.account ? req.body.account : 0,
  });
  data = await data.save();
  res.send(data);
});

router.put("/:id", async (req, res) => {
  let data = await Data.findById(req.param.id);

  data = {
    name: req.body.name ? req.body.name : data.name,
    phone: req.body.phone ? req.body.phone : data.phone,
    account: req.body.account ? req.body.account : data.account,
  };

  data = await Data.findByIdAndUpdate(req.params.id, data, { new: true });

  if (!data)
    return res.status(404).send("The data with the given ID was not found.");

  res.send(data);
});

module.exports = router;
