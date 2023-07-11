const express = require("express");
const HttpError = require("../models/http-error");
const placesConttrollers = require("../controllers/places-controller");

const router = express.Router();

// Places route
// Register this route
router.get("/:pid", placesConttrollers.getPlaceById);

// User route
router.get("/user/:uid", placesConttrollers.getUserById);

module.exports = router;
