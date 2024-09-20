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
import { WebSocketServer } from 'ws';

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

// Routes
app.use('/api/users', userRoute);
app.use('/api/tasks', taskRoute);
app.use('/api/teams', teamRoute);
app.use('/api/projects', projectRoute);
app.use('/api/messages', messageRoute);

// Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(notFound);
app.use(errorHandler);

// Create HTTP server
const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});

// WebSocket setup
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New client connected', ws._socket.remoteAddress);
  // Send a JSON-formatted welcome message
  ws.send(JSON.stringify({ type: 'welcome', message: 'Welcome to dynamikManager!' }));

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        // Echo the message as JSON
        client.send(JSON.stringify({ type: 'echo', message }));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});



// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down gracefully...');
  wss.clients.forEach((client) => {
    client.close();
  });
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export { wss };