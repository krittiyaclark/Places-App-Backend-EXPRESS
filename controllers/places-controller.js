const DUMMY_PLACES = [
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
  const placeId = req.params.pid; // { pid: 'p1' }
  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeId;
  });
  // Handling Errors
  if (!place) {
    throw new HttpError("Could not finda place for the provided id.", 404);
    // return res
    //   .status(404)
    //   .json({ message: "Could not finda place for the provided id." });
  }
  console.log("GET Request in Places");
  res.json({ place });
};

const getUserById = (req, res, next) => {
  const userId = req.params.uid;
  const place = DUMMY_PLACES.find((p) => {
    return p.creator === userId;
  });
  // Handling Errors
  if (!place) {
    return next(
      HttpError("Could not finda place for the provided user id.", 404)
    );
    //   return res
    //       .status(404)
    //       .json({ message: "Could not finda place for the provided user id." });
  }
  res.json({ place });
};

exports.getPlaceById = getPlaceById;
exports.getUserById = getUserById;