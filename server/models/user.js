import Mongoose, { Schema, model } from "mongoose";

const Users = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    services: [
        {
            type: String,
            default: 'resetPassword'
        }
    ],
}, { timestamps: true })

export default model('Users', Users)