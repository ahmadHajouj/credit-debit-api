const mongoose = require("mongoose");
const express = require("express");
const Customers = require("../models/customers");
const router = express.Router();

const Data = mongoose.model(
  "Table",
  new mongoose.Schema({
    customer: {
      type: String,
      required: true,
    },
    creditDate: {
      type: Date,
      required: true,
    },
    credit: {
      type: Number,
      required: true,
    },
    debitDate: {
      type: Date,
    },
    debit: {
      type: Number,
    },
    totle: {
      type: Number,
    },
    comment: {
      type: String,
    },
  })
);

const data = [
  {
    creditDate: "12-03",
    credit: 5000,
    debitdate: "16-03",
    debit: 4500,
    comment: "bank",
  },
  {
    creditDate: "10-03",
    credit: 9000,
    debitdate: "14-03",
    debit: 8999,
    comment: "home",
  },
  {
    creditDate: "09-03",
    credit: 10000,
    debitdate: "15-03",
    debit: 9500,
    comment: "cars",
  },
  {
    creditDate: "11-03",
    credit: 5500,
    debitdate: "12-03",
    debit: 3000,
    comment: "farm",
  },
];

router.get("/", async (req, res) => {
  const data = await Data.find().sort("_id");
  res.send(data);
});

// router.get("/:id", async (req, res) => {
//   const data = await Data.findById(req.params.id);
//   res.send(data);
// });

router.get("/:customer", async (req, res) => {
  const data = await Data.find();
  res.send(data.filter((c) => c.customer === req.params.customer));
});

router.post("/", async (req, res) => {
  const d = new Date();
  let data = {
    customer: req.body.customer,
    creditDate: req.body.creditDate
      ? new Date(`${d.getFullYear()}-${req.body.creditDate}`)
      : new Date(),
    credit: req.body.credit,
    totle: req.body.debit ? req.body.credit - req.body.debit : req.body.credit,
  };
  if (req.body.debit)
    data = {
      ...data,
      debitDate: req.body.debitDate
        ? new Date(`${d.getFullYear()}-${req.body.debitDate}`)
        : new Date(),
      debit: req.body.debit,
      totle: req.body.credit - req.body.debit,
    };
  if (req.body.comment)
    data = {
      ...data,
      comment: req.body.comment,
    };
  data = new Data(data);
  data = await data.save();

  const customer = await Customers.findById(data.customer);
  await Customers.findByIdAndUpdate(
    data.customer,
    { account: customer.account + data.totle },
    { new: true }
  );

  res.send(data);
});

router.put("/:id", async (req, res) => {
  const d = new Date();
  let data = {
    customer: req.body.customer,
    creditDate: req.body.creditDate ? req.body.creditDate : new Date(),
    credit: req.body.credit,
    totle: req.body.debit ? req.body.credit - req.body.debit : req.body.credit,
  };
  if (req.body.debit)
    data = {
      ...data,
      debitDate: req.body.debitDate ? req.body.debitDate : new Date(),
      debit: req.body.debit,
      totle: req.body.credit - req.body.debit,
    };
  if (req.body.comment)
    data = {
      ...data,
      comment: req.body.comment,
    };

  const oldData = await Data.findById(req.params.id);
  data = await Data.findByIdAndUpdate(req.params.id, data, { new: true });

  if (!data)
    return res.status(404).send("The data with the given ID was not found.");

  const customer = await Customers.findById(data.customer);
  await Customers.findByIdAndUpdate(
    data.customer,
    { account: customer.account - oldData.totle + data.totle },
    { new: true }
  );

  res.send(data);
});

module.exports = router;
