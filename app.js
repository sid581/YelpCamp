if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

 
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const expresserror = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user'); 
const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
const helmet = require('helmet');

const userRoutes = require('./routes/user');
const campgroundsRoutes = require('./routes/campground');
const reviewsRoutes = require('./routes/review');
const dbUrl=process.env.DB_URL || 'mongodb://127.0.0.1:27017/Yelpcamp';
//  mongodb://127.0.0.1:27017/Yelpcamp
const MongoStore = require('connect-mongo');
mongoose.connect(dbUrl ,{
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false
})
    .then(() => {
        console.log('Database Connection');
    })
    .catch((err) => {
        console.log('Connection Error!', err);
    })

const app = express();
app.set('query parser', 'extended');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static('public'))
app.use(sanitizeV5({ replaceWith: '_' }));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret: 'thisshouldbeabettersecret',
    resave:false,
    saveUninitialized:true, 
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig)); 
app.use(flash());
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    // "https://api.tiles.mapbox.com",
    // "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com",
    "https://unpkg.com",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    // "https://api.mapbox.com",
    // "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com",
    "https://unpkg.com",
];
const connectSrcUrls = [
    // "https://api.mapbox.com",
    // "https://a.tiles.mapbox.com",
    // "https://b.tiles.mapbox.com",
    // "https://events.mapbox.com",
    "https://api.maptiler.com",
    "https://cdn.maptiler.com",
    "https://cdn.jsdelivr.net",
    "https://unpkg.com",
    "https://*.maptiler.com",
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",                 
                "https://res.cloudinary.com/dhpbo6l4p/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com",
                "https://api.maptiler.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email:'siddesh@gmail.com', username: 'siddesh' });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
});

app.use('/', userRoutes);
app.use('/campground', campgroundsRoutes);
app.use('/campground/:id/reviews', reviewsRoutes);

app.get('/', (req, res) => {
    res.render('home');
});
 
 
app.all(/(.*)/, (req, res, next) => {
    next(new expresserror('Page not found', 404));
})
app.use((err, req, res, next) => {
    const { statuscode = 500 } = err;
    if (!err.message) err.message = 'Oh! Something went Wrong';
    res.status(statuscode).render('error', { err });
})


app.listen(1000, (req, res) => {
    console.log('Running on app 1000 port');
})