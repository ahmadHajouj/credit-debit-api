const bcrypt = require("bcrypt");
const _ = require("lodash");
const auth = require("../middleware/auth");
const User = require("../models/users");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  let user = await User.findOne({ name: req.body.name });
  if (user) return res.status(400).send("Username already registered.");

  user = new User(_.pick(req.body, ["name", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "name"]));
});

router.put("/password", async (req, res) => {
  let user = await User.findOne({ name: req.body.name });
  if (!user) return res.status(404).send("Username not fonud.");

  const validPassword = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );
  if (!validPassword) return res.status(400).send("Invalid password.");

  const salt = await bcrypt.genSalt(10);
  const data = { password: await bcrypt.hash(req.body.password, salt) };

  user = await User.findByIdAndUpdate(user._id, data, { new: true });

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(_.pick(user, ["_id", "name"]));
});

module.exports = router;
