# YelpCamp

## Setup
1. Clone this repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory with the following variables:
```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret
MAPTILER_API_KEY=your_maptiler_key
MONGO_URI=mongodb://127.0.0.1:27017/Yelpcamp
```
4. Start MongoDB locally or update MONGO_URI with your database connection string
5. Run `npm start` to start the server

## Environment Variables
The following environment variables are required:
- `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `CLOUDINARY_KEY`: Your Cloudinary API key
- `CLOUDINARY_SECRET`: Your Cloudinary API secret
- `MAPTILER_API_KEY`: Your MapTiler API key
- `MONGO_URI`: MongoDB connection string (local or Atlas)