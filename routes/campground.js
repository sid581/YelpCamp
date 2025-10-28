const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn,validateCampground,isAuthor} = require('../middleware'); 
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage }); 

const catchAsync = require('../utils/catchAsync');
const expresserror = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../Schema')


 

router.get('/', catchAsync( campgrounds.index ));
router.get('/new', isLoggedIn,campgrounds.renderNewForm );
router.post('/', isLoggedIn,validateCampground,upload.array('image'), catchAsync(campgrounds.createCampground ));
// router.post('/', upload.array('image'),(req,res)=>{
//     console.log(req.files,req.body);
//     res.send("It Worked!");
// });
router.get('/:id',catchAsync(campgrounds.showCampground ));
router.get('/:id/edit', isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))
router.patch('/:id',isLoggedIn, isAuthor,validateCampground,upload.array('image'), catchAsync( campgrounds.updateCampground ));

router.delete('/:id',isLoggedIn, isAuthor, catchAsync( campgrounds.deleteCampground ));  

module.exports = router;
