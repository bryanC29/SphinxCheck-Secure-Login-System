import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = async (userIP, userID) => {

    if (!userIP || !userID) {
        return null;
    }

    const token = await jwt.sign(
        { userIP, userID },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
    return token;
}

export const verifyToken = (token) => {

    if (!token) {
        return null;
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return null;
        }
        return user;
    });
};