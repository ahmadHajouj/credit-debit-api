const mongoose = require("mongoose");

const Customers = mongoose.model(
  "Customers",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    account: {
      type: Number,
      require: true,
      default: 0,
    },
  })
);

module.exports = Customers;
