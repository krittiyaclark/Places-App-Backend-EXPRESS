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

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; // params is an express object { pid: 'p1' }
  // const places = DUMMY_PLACES.filter((p) => {
  //   return p.id === placeId;
  // });
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    // This error for GET request
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }
  // Handling Errors
  // This error from the Database
  if (!place) {
    const error = new HttpError(
      "Could not finda places for the provided id.",
      404
    );
    return next(error);
    // return res
    //   .status(404)
    //   .json({ message: "Could not finda place for the provided id." });
  }
  console.log("GET Request in Places");
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try agan later.",
      500
    );
    return next(error);
  }

  // Handling Errors
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
    //   return res
    //       .status(404)
    //       .json({ message: "Could not finda place for the provided user id." });
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
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
  const createdPlace = new Place({
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
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try agan.", 500);
    return next(error);
  }

  // Send back to respond
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("invalida inputs passed, please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went went wrong. could not update place.",
      500
    );
    return next(error);
  }

  // Make a copy
  // const updatePlace = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  // const placeIndex = { ...DUMMY_PLACES.findIndex((p) => p.id === placeId) };
  place.title = title;
  place.description = description;

  // Set DUMMY_PLACES
  // DUMMY_PLACES[placeIndex] = updatePlace;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went went wrong. could not update place.",
      500
    );
    return next(error);
  }
  // Return
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  try {
    await place.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Deleted place." });

  // if (!DUMMY_PLACES.find((p) => p.id === placeId)) {
  //   HttpError("Could not find a place for the provided user id.", 404);
  // }
  // DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
