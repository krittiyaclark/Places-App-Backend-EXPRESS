const express = require("express");
const usersConttrollers = require("../controllers/users-controller");

const router = express.Router();
// Places route
// Register this route
router.get("/", usersConttrollers.getUsers);

// User route
router.post("/signup", usersConttrollers.signup);
router.post("/login", usersConttrollers.login);

module.exports = router;
