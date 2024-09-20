import {Schema, model} from "mongoose";


const tokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true,
    },
    token: { 
        type: String,
        required: true 
    },
    type: { 
        type: String, 
        enum: ['verification', 'passwordReset'], 
        required: true 
      },
    expireAt: { 
        type: Date,
        expires:   60 * 60,
        index: true, 
        default: Date.now,
    }
});

export default  model("Token", tokenSchema);