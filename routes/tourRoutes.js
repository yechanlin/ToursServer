const express = require('express');
const tourController = require('./../controllers/tourController.js');
const authController = require('./../controllers/authController.js');
// const reviewController = require('./../controllers/reviewController.js');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

// router.param('id', tourController.checkID);

// Create a checkBody middleware function
// Check if body contains the name and price properties
// If not, send back 400 (back request)
// Add it to the post handler stack
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect,
  authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(authController.protect,
    authController.restrictTo('admin', 'lead-guide'), tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );


router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);


// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

// Nested routes

// POST /tour/234fad4/reviews
// GET /tour/234fad4/reviews
router.use('/:tourId/reviews', reviewRouter);


module.exports = router;
