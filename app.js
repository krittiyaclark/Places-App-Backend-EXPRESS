const express = require("express");
const bodyParser = require("body-parser");
//Middleware
const placesRoutes = require("./routes/places-routes.js");

const app = express();

app.use("/api/places", placesRoutes); // It will forward to placesRoutes and /api/places can be anything

app.listen(8000);
