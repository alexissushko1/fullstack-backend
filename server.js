require("dotenv").config();
const express = require("express");
const app = express();
const PORT = 3000;

app.use(require("morgan")("dev"));
app.use(express.json());

//404 middleware
app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint not found" });
});

//Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500);
  res.json(err.message ?? "Sorry, something went wrong on the server side");
});

app.listen(PORT, () => {
  console.log(`Listening on port#: ${3000}...`);
});
