import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Routes
import AuthRoute from './routes/AuthRoute.js';
import UserRoute from './routes/UserRoute.js';
import PostRoute from './routes/PostRoute.js';
import UploadRoute from './routes/UploadRoute.js';
import ChatRoute from './routes/ChatRoute.js';
import MessageRoute from './routes/MessageRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CONNECTION = process.env.MONGODB_URI;

// Middleware
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Serve static files
app.use(express.static('public'));
app.use('/images', express.static('images'));

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

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Connect to MongoDB and start the server
mongoose
  .connect(CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`Connected to MongoDB`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`MongoDB connection error: ${error}`);
    process.exit(1);
  });
