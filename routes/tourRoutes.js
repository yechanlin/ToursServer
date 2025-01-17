const express = require('express');
const tourController = require('./../controllers/tourController.js');
const authController = require('./../controllers/authController.js');

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
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
<<<<<<< HEAD
  .delete(tourController.deleteTour);
=======
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );
>>>>>>> 383bb67 (Initial commit)

module.exports = router;
