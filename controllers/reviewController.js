const catchAsync = require('./../utils/catchAsync');
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');


// Create a new review
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.createReview = catchAsync(async (req, res, next) => {
  // if (!req.body.tour) req.body.tour = req.params.tourId;
  // if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});


// Get all reviews
exports.getAllReviews = factory.getAll(Review);

// Get a review
exports.getReview = factory.getOne(Review);

// Update a review
exports.updateReview = factory.updateOne(Review);

// Delete a review
exports.deleteReview = factory.deleteOne(Review);
