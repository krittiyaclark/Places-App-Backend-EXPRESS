const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
//Middleware
const placesRoutes = require("./routes/places-routes.js");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRoutes); // It will forward to placesRoutes and /api/places can be anything
app.use("/api/users", usersRoutes);
// Handling Errors for Unsupported Routes
app.use((req, res, next) => {
  const error = new HttpError("Cound not find this route");
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
app.listen(8000);
