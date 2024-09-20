import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwtManagerToken;
  if(!token ){
    
    return res.status(400).json({
      message: "Log in to continue",
    });
  }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select('-password');
      console.log('User is authenticated with JWT');
      return next();
    } catch (error) {
      console.error('Token verification failed:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } 
);


const ensureGuest = (req, res, next) => {
 
  const token = req?.cookies?.jwtManagerToken;

  if (token) {
    return res.status(400).json({
      message: "You are already logged in. You need to be a guest."
    });
  }
  console.log('User is not authenticated');
  next();
};


const ensureAdmin = asyncHandler(async (req, res, next) => {


  // check the JWT token
  const token = req.cookies.jwtManagerToken;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    if (req.user && req.user.role === 'admin') {
      console.log('User is an admin via JWT',  req.user.email);
      return next();
    } else {
      return res.status(403).json({ message: 'You are not an admin' });
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
});

const ensureNotUser = asyncHandler(async (req, res, next) => {


  // check the JWT token
  const token = req.cookies.jwtManagerToken;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    if (req.user && req.user.role === 'admin' || req.user.role === 'manager') {
      console.log('you have permission',  req.user.email);
      return next();
    } else {
      return res.status(403).json({ message: 'You are not authorized as a user' });
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
});



// Function to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


const validateId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: 'Invalid ObjectId',
    });
  }
  console.log("Object id is valid")
  // If the ID is valid, continue to the next middleware or route handler
  next();
});


export { protect, ensureAdmin, ensureGuest, validateId, ensureNotUser};