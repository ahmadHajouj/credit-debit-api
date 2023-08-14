const config = require("config");
const mongoose = require("mongoose");
const table = require("./routes/table");
const Customers = require("./routes/customers");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const cors = require("cors");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defind");
  process.exit(1);
}

mongoose
  .connect(config.get("db"))
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        ["https://credit-debit-app.vercel.app"].indexOf(origin) !== -1 ||
        !origin
      )
        callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    methods: "OPTIONS, DELETE, POST, GET, PATCH, PUT",
    allowedHeaders: "*",
    credentials: true,
  })
);

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "POST, GET, PUT");
//   res.header("Access-Control-Allow-Headers", "Content-type");
//   next();
// });

app.get("/", (req, res) => {
  res.json("Hi");
});

app.use("/api/table", table);
app.use("/api/customers", Customers);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
