const uuid = require("uuid");
const HttpError = require("../models/http-error");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Krittiya Clark",
    email: "test@test.com",
    password: "testers",
  },
];

const getUsers = (req, res, next) => {
  // Return an array of the user
  // Or it could send back a respond => res.status(200)
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (has) {
    throw new HttpError("Could not create user, email alreadly exists.", 422);
  }
  const createUser = {
    id: uuid(),
    name, // name: name
    email,
    password,
  };

  //   Add users into the DUMMY_USERS
  DUMMY_USERS.push(createUser);

  res.status(201).json({ user: createUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      "Could not identify user, credentials seem to be wrong",
      401
    );
  }
  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
