const uuid = require("uuid");
const { validationResult } = require("express-validator");
const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

// function getPlaceById() {...}
// const getPlaceById = function() {...}

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid; // params is an express object { pid: 'p1' }
  const places = DUMMY_PLACES.filter((p) => {
    return p.id === placeId;
  });
  // Handling Errors
  if (!places || places.length === 0) {
    throw new HttpError("Could not finda places for the provided id.", 404);
    // return res
    //   .status(404)
    //   .json({ message: "Could not finda place for the provided id." });
  }
  console.log("GET Request in Places");
  res.json({ places });
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });
  // Handling Errors
  if (!place) {
    return next(
      HttpError("Could not find a place for the provided user id.", 404)
    );
    //   return res
    //       .status(404)
    //       .json({ message: "Could not finda place for the provided user id." });
  }
  res.json({ place });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("invalida inputs passed, please check your data.", 422)
    );
  }
  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  // Properties need to be the same as placeSchema in models/place.js
  const createPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://pixabay.com/photos/amsterdam-canal-netherlands-channel-1674530",
    creator,
  });

  // const createdPlace = {
  //   id: uuid(),
  //   title,
  //   description,
  //   location: coordinates,
  //   address,
  //   creator,
  // };

  // DUMMY_PLACES.push(createdPlace); // Or unshift(createPlace)
  // Use save() from mongoose. save() is async.
  try {
    await createPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try agan.");
    return next(error);
  }

  // Send back to respond
  res.status(201).json({ place: createPlace });
};

const updatePlace = (req, res, next) => {
  const erroes = validationResult(req);
  if (erroes.isEmpty()) {
    throw new HttpError("invalida inputs passed, please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  // Make a copy
  const updatePlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  const placeIndex = { ...DUMMY_PLACES.findIndex((p) => p.id === placeId) };
  updatePlace.title = title;
  updatePlace.description = description;

  // Set DUMMY_PLACES
  DUMMY_PLACES[placeIndex] = updatePlace;

  // Return
  res.status(200).json({ place: updatePlace });
};

const deletePlace = (rea, res, next) => {
  const placeId = req.params.pid;
  if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
    HttpError("Could not find a place for the provided user id.", 404);
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);

  req.status(200).json({ message: "Deleteplace" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
