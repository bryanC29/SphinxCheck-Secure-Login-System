import jwt from "jsonwebtoken";

export const generateToken = (userIP, userID) => {

    if (!userIP || !userID || !username) {
        return null;
    }

    jwt.sign({
            userIP,
            userID,
        },
        process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        },
        (err, token) => {
            if (err) {
                return null;
            }
            return token;
        }
    );
}

export const verifyToken = (token) => {

    if (!token) {
        return null;
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return null;
        }
        return user;
    });
};