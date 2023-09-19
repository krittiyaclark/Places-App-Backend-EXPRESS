const express = require("express");
const placesConttrollers = require("../controllers/places-controller");

const router = express.Router();
// Places route
// Register this route
router.get("/:pid", placesConttrollers.getPlaceById);

// User route
router.get("/user/:uid", placesConttrollers.getUserById);

router.post("/", placesConttrollers.createPlace);

module.exports = router;
