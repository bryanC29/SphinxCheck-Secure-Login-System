import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const { token } = req.signedCookies;

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};