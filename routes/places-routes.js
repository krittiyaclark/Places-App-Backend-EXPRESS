const express = require("express");
const { check } = require("express-validator");
const placesConttrollers = require("../controllers/places-controller");

const router = express.Router();
// Places route
// Register this route
router.get("/:pid", placesConttrollers.getPlacesById);

// User route
router.get("/user/:uid", placesConttrollers.getUserById);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("decscription").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesConttrollers.createPlace
);

router.patch("/:pid", placesConttrollers.updatePlace);

router.delete("/:pid", placesConttrollers.deletePlace);

module.exports = router;
