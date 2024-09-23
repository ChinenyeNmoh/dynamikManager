import User from "../models/userModel.js"; 
import { emailVerificationTemplate, sendEmail, passwordResetTemplate } from "../utils/mail.js";
import generateToken from "../utils/generateToken.js";
import Token from "../models/tokenModel.js";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";


// Register a new user
const registerUser = asyncHandler(async (req, res) => {
    const { fullName:name, captchaValue: captcha, email, password, confirmPassword } = req.body;
    console.log(name);
    try{
        if (!captcha) {
            throw new Error("Complete Captcha verification");
        }
    
        // Verify captcha using reCAPTCHA API
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SERVER_CAPTCHA}&response=${captcha}`;
        
        try {
            const captchaResponse = await axios.post(verifyUrl);
            if (!captchaResponse.data.success) {
                console.log(captchaResponse.data);
                throw new Error("Captcha verification failed");
            }
        } catch (error) {
            console.log("Captcha verification failed:", error.message);
            throw new Error("Captcha verification failed with error: " + error.message);
        }
    
        if (password !== confirmPassword) {
            throw new Error("Passwords does not match");
        }
    
        const existingUser = await User.findOne({ email });
    
        if (existingUser) {
            throw new Error("User already exists with this email");
        }
    
        const newUser = await new User({ name, email, password }).save();
    
        // Create a verification token for the user
        const token = await new Token({
            userId: newUser._id,
            token: uuidv4(),
            type: 'verification',
        }).save();
    
        // Generate an email verification link
        const link = `${process.env.BASE_URL}/verify/${newUser._id}/${token.token}`;
    
        // Send the email verification link
        const htmlContent = emailVerificationTemplate(link, newUser);
        await sendEmail(newUser.email, "Email Verification", htmlContent);
    
        return res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });

    }catch(error){
        console.error(error);
        res.status(500).json({ message: error.message });
    }


    
});



// Verify user's email
const verifyToken = asyncHandler(async (req, res) => {
    const { id, token } = req.params;
    console.log(token)
  
    const user = await User.findById(id);
  
    if (!user) {
        return res.status(400).redirect(`http://localhost:3000/?error=${encodeURIComponent('User not found')}`);
    }
  
    const userToken = await Token.findOne({
      userId: user._id,
      token: token,
      type: "verification",
    });
  
    if (!userToken) {
        return res.status(400).redirect(`http://localhost:3000/?error=${encodeURIComponent('Expired or invalid token.')}`);
    }
  
    // Token is valid, update the user and delete the token
    await User.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );
  
    await Token.findByIdAndDelete(userToken._id);
    res.status(200).redirect(`http://localhost:3000/login?message=${encodeURIComponent("Email verified successfully. you can login")}`);
  });


// Login user
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    // Check if the password matches
    const isMatch = await user.isPasswordMatch(password);
    console.log(isMatch);
    if (!isMatch) {
       return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if the user is verified
    if (!user.isVerified) {
        const tokenUser = await Token.findOne({ userId: user._id, type: 'verification' });

        if (tokenUser) {
            return res.status(401).json({ message: "User is not verified. Check your email for the verification link." });
        } else {
            // Create a new token for the user
            const token = await new Token({
                userId: user._id,
                token: uuidv4(),
                type: 'verification',
            }).save();

            const link = `${process.env.BASE_URL}/verify/${user._id}/${token.token}`;
            const htmlContent = emailVerificationTemplate(link, user);

            // Send the verification email
            await sendEmail(user.email, 'Account Verification', htmlContent);

            console.log('Verification email sent');
            return res.status(401).json({ message: "User is not verified. Check your email for the verification link." });
        }
    }

    // Generate and send JWT token
    generateToken(res, user._id);

    const responseUser = {
        _id: user._id,
        name: user.name,
        email: user.email,
       role: user.role,
    }
    console.log(responseUser);
    // Send success response
    return res.status(200).json({ message: "User logged in successfully", user: responseUser });
});



// Request password reset
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Please provide your email address" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ message: "No user found with this email" });
    }

    // Check if user is verified
    if (!user.isVerified) {
        let tokenUser = await Token.findOne({ userId: user._id, type: 'verification' });

        if (tokenUser) {
            throw new Error("User is not verified. Check your email for the verification link.");
        }

        // Create a new verification token for the user if not verified
        const verificationToken = await new Token({
            userId: user._id,
            token: uuidv4(),
            type:'verification',
        }).save();

        const verificationLink = `${process.env.BASE_URL}/${user._id}/verify/${verificationToken.token}`;
        const htmlContent = emailVerificationTemplate(verificationLink, user);

        // Send the verification email
        await sendEmail(user.email, 'Account Verification', htmlContent);
        console.log('Verification email sent');
        throw new Error("User is not verified. Check your email for the verification link.");
    }

    // Check if there is an existing password reset token for the user
    let tokenUser = await Token.findOne({ userId: user._id, type: 'passwordReset' });

    if (tokenUser) {
        throw new Error("A password reset link has already been sent. Please check your email.");
    }
     // Check when the last email was sent
     const now = Date.now();
     const emailDelay = 15 * 60 * 1000; // 15 minutes

     if (user.lastEmailSent && (now - new Date(user.lastEmailSent).getTime()) < emailDelay) {
         throw new Error('Too many requests. Try again later.');
     }

    // Create a new password reset token for the user
    const passwordResetToken = await new Token({
        userId: user._id,
        token: uuidv4(),
        type: 'passwordReset',
    }).save();

    // Construct the password reset link
    const resetLink = `${process.env.BASE_URL}/resetpassword/${user._id}/${passwordResetToken.token}`;
    const htmlContent = passwordResetTemplate(resetLink, user);

    // Send the password reset email
    await sendEmail(user.email, 'Password Reset', htmlContent);
    user.lastEmailSent = now;
    await user.save();
    console.log('Password reset email sent');
    return res.status(200).json({ message: 'Password reset email sent. Check your email for the reset link.' });

});


// Reset user's password
const resetPassword = asyncHandler(async (req, res) => {
    const { id, token } = req.params;
    const user = await User.findById(id);
  
    if (!user) {
        return res.status(400).redirect(`http://localhost:3000/login?error=${encodeURIComponent('User not found')}`);
    }
  
    const userToken = await Token.findOne({
        userId: user._id,
        token: token,
        type: 'passwordReset',
    });
  
    if (!userToken) {
        return res.status(400).redirect(`http://localhost:3000/login?error=${encodeURIComponent('Invalid or expired token')}`);
    }

    // The TTL index will automatically remove expired tokens, but you can manually remove it after use
    await userToken.deleteOne();

    // Redirect to the password update page
    return res.status(200).redirect(`http://localhost:3000/resetpassword/?id=${user._id}&message=${encodeURIComponent('Please update your password')}`);
});


// Update user's password
const updatePassword = asyncHandler(async (req, res) => {
    
    const { password, confirmPassword, id } = req.body;
    console.log(req.body);
try{
    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
        return res.status(400).json({ error: "No user found with this ID" });
    }

    // Validate and compare passwords
    if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashPw = await bcrypt.hash(password, salt);

    // Update the user's password
    await User.findByIdAndUpdate(
        id,
        { password: hashPw },
        { new: true }
    );

    // Return success response
    return res.status(200).json({
        message: "Password reset successful",
    });

}catch(error){
    console.log(error.message);
    return res.status(500).json({ error: "Internal server error" });
}
    
});

// Logout user
const logOut = asyncHandler(async (req, res) => {
    const token = req.cookies.jwtManagerToken || "";

    if (token) {
        // Clear the JWT token
        res.cookie('jwtManagerToken', '', {
            httpOnly: true,
            expires: new Date(0), // Expire the token immediately
            secure: process.env.NODE_ENV === 'production', // Only set secure flag in production
            sameSite: 'Strict' // Helps mitigate CSRF attacks
        });
        console.log('JWT token cleared');
        return res.status(200).json({ message: "Logged out successfully" });
    } else {
        return res.status(400).json({ message: "User not logged in" });
    }
});


//get user profile

const getUserProfile = asyncHandler(async (req, res) => {
    try{
        console.log('control came here')
        const user = await User.findById(req.user._id)
        .populate('team')
     
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const userObj = user.toObject();
        const { password, ...userWithoutPassword } = userObj;
    
        res.status(200).json({
            message: "User profile fetched successfully",
            user: userWithoutPassword,
        });

    }catch(error){
        console.error(error.message);
        res.status(500).send(error.message);
    }
   
});

const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;  
        const { name, team } = req.body;

        // Check if the user exists
        const user = await User.findById(userId).populate('team');
        if (!user) {
            return res.status(404).json({ error: "No user found with this ID" });
        }

        // Update user name if provided
        if (name) {
            user.name = name;
        }
        // Update user team if provided
        if (team && Array.isArray(user.team)) {
            user.team.push(team);
        }
        
        // Save the user 
        await user.save();

        // Convert the user object to a plain object and remove the password field
        const userObj = user.toObject();
        const { password, ...userWithoutPassword } = userObj;

        // Return success response
        return res.status(200).json({
            message: "User profile updated successfully",
            user: userWithoutPassword,
        });

    } catch (error) {
        console.error('Error updating user profile:', error.message);
        res.status(500).json({ message: error.message });
    }
});

//get all users

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find()
            .populate('team')

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        // Convert each user to a plain object and remove the password field
        const usersWithoutPassword = users.map(user => {
            const userObj = user.toObject();
            const { password, ...userWithoutPassword } = userObj;
            return userWithoutPassword;
        });

        res.status(200).json({
            message: "User profiles fetched successfully",
            users: usersWithoutPassword, 
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});





//get user by id
const getUserById = asyncHandler(async (req, res) => {
    console.log(req.params.id)
    try{
        console.log('control came here')
        const user = await User.findById(req.params.id)
        .populate('team')
     
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        const userObj = user.toObject();
        const { password, ...userWithoutPassword } = userObj;
    
        res.status(200).json({
            message: "User profile fetched successfully",
            user: userWithoutPassword,
        });

    }catch(error){
        console.error(error.message);
        res.status(500).send(error.message);
    }
   
});


//delete user

const deleteUser = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "No user found with this ID" });
        }

        // Delete the user
        await user.deleteOne();

        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send(error.message);
    }
});

export { 
    loginUser, 
    verifyToken, 
    registerUser, 
    forgotPassword,
    resetPassword, 
    updatePassword,
    updateUserProfile, 
    getUserProfile, 
    logOut,
    getAllUsers,
    getUserById, 
    deleteUser  
};


  
  