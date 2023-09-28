import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// routes
import AuthRoute from './routes/AuthRoute.js'
import UserRoute from './routes/UserRoute.js'
import PostRoute from './routes/PostRoute.js'
import UploadRoute from './routes/UploadRoute.js'
import ChatRoute from './routes/ChatRoute.js'
import MessageRoute from './routes/MessageRoute.js'

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "30mb" })); // No need for `extended: true` with Express 4.16+
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// To serve images inside the public folder
app.use(express.static('public'));
app.use('/images', express.static('images'));

dotenv.config();
const PORT = process.env.PORT || 5000; // Use 5000 as default if PORT is not defined
const CONNECTION = process.env.MONGODB_URI;

mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to MongoDB`);
    app.listen(PORT, () => console.log(`Listening at Port ${PORT}`));
  })
  .catch((error) => {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(1); // Exit the application on MongoDB connection failure
  });

// Routes
app.use('/auth', AuthRoute);
app.use('/user', UserRoute);
app.use('/posts', PostRoute);
app.use('/upload', UploadRoute);
app.use('/chat', ChatRoute);
app.use('/message', MessageRoute);

// Handle unhandled routes
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
