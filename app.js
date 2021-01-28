const express = require("express");
const baseURLController = require("./controllers/baseUrlController");
const validatorController = require("./controllers/validatorController");

const app = express();

app.use(express.json());

// Route Middleware

app.get("/", baseURLController);

app.post(
  "/validate-rule",
  validatorController.isPayloadValid,
  validatorController.validateRule
);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  res.status(err.statusCode).json({
    message: err.message,
    status: err.status,
    data: null,
  });
});

module.exports = app;
