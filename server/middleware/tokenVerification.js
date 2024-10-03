import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = (req, res, next) => {
    const { token } = req.signedCookies;

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};