
const mongoose = require('mongoose');
const cities = require('./cities');
const Campground = require('../models/campground');
const { places, descripters } = require('./seedHelpers');


const sample = array => array[Math.floor(Math.random() * array.length)];
mongoose.connect('mongodb://127.0.0.1:27017/Yelpcamp')
    .then(() => {
        console.log('Database Connection');
    })
    .catch((err) => {
        console.log('Connection Error!', err);
    })

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seed = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
       
        const price = Math.floor(Math.random() * 30) + 10;
        const c = new Campground({
            author:'68f38b0d736fb8e7338d918e',
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            title: `${sample(descripters)} ${sample(places)}`,
            images: [
                     {
                       url: 'https://res.cloudinary.com/dhpbo6l4p/image/upload/v1761030636/YelpCamp/qwrsli3zgfwze92upayx.jpg',
                       filename: 'YelpCamp/qwrsli3zgfwze92upayx',
                        
                     }
                   ],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Tenetur esse quas nam odio reiciendis eius doloremque ipsam earum cumque? Ducimus deleniti esse minus mollitia aperiam, sapiente aspernatur magni reiciendis veritatis!',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
        })
        await c.save();
    }

}
seed().then(() => {
    mongoose.connection.close();
});



// base44
// cursorai