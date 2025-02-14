const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

// Add console.log to debug
console.log('viewsController:', viewsController);
console.log('authController:', authController);

// Temporarily remove authController.isLoggedIn to test basic routing
router.get('/', viewsController.getOverview);
router.get('/overview', viewsController.getOverview);
router.get('/tour/:slug', viewsController.getTour); // Remove authController.isLoggedIn temporarily
router.get('/login', viewsController.getLoginForm); // Remove authController.isLoggedIn temporarily
router.get('/me', authController.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;