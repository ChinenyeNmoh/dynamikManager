import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

// User Schema Definition
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
       
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email address',
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
        type: String,
        Enum: ['user', 'admin', 'manager'],
        default: 'user',
    },
    lastEmailSent: {
        type: Date,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    team: {
        type: Schema.Types.ObjectId,
        ref: 'Team', 
    },
}, {
    timestamps: true, 
});

// Pre-save Middleware to Hash Password
userSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Custom Method to Compare Passwords
userSchema.methods.isPasswordMatch = async function (enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Export the User model
export default model('User', userSchema);
