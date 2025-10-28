const express = require('express');
const router = express.Router({mergeParams:true});
const Reviews= require('../controllers/review');
const catchAsync = require('../utils/catchAsync');
const Review= require('../models/review')
const Campground = require('../models/campground');
 
const expresserror = require('../utils/ExpressError');
const {validateReview,isLoggedIn,isReviewAuthor}= require('../middleware');
router.post('/',isLoggedIn,validateReview,catchAsync( Reviews.createReview ));
router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync( Reviews.deleteReview ));

module.exports = router;
