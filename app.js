const express = require("express");
const bodyParser = require("body-parser");
//Middleware
const placesRoutes = require("./routes/places-routes.js");

const app = express();

app.use("/api/places", placesRoutes); // It will forward to placesRoutes and /api/places can be anything

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});
app.listen(8000);
