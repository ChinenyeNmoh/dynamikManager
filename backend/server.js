import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errormiddleware.js';
import userRoute from './routes/userRoute.js';
import taskRoute from './routes/taskRoute.js';
import teamRoute from './routes/teamRoute.js';
import projectRoute from './routes/projectRoute.js';
import messageRoute from './routes/messageRoute.js';

// Load environment variables

dotenv.config();

// Connect to the database

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header({"Access-Control-Allow-Origin": "*"});
  next();
}) 

// Enable CORS
const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true,        
  };
  app.use(cors(corsOptions));
  
// Routes
app.use('/api/users', userRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/teams', teamRoute);
app.use('/api/projects', projectRoute);
  app.use('/api/messages', messageRoute);

// Define __dirname and __filename for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// path to our static folders
app.use(express.static(path.join(__dirname, 'public')));

// Logging using morgan middleware only if we are in development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

  app.use(notFound);
  app.use(errorHandler);
  
  
  app.listen(PORT, () => {
      console.log(`app is running on port ${PORT}`);
  })