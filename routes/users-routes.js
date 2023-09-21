const express = require("express");
const { check } = require("express-validator");
const usersConttrollers = require("../controllers/users-controller");

const router = express.Router();
// Places route
// Register this route
router.get("/", usersConttrollers.getUsers);

// User route
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmpty(),
    check("password").isLength({ min: 6 }),
  ],
  usersConttrollers.signup
);
router.post("/login", usersConttrollers.login);

module.exports = router;
