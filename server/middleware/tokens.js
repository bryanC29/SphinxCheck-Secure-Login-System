import jwt from "jsonwebtoken";

export const generateToken = (req, res, next) => {
    
    const { userIP, username, userID } = req.body;

    if (!userIP || !userID || !username) {
        res.status(404).json({ message: "Invalid request" });
    }

    jwt.sign(
        {
            userIP,
            userID,
            username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        },
        (err, token) => {
            if (err) {
                res.status(500).json({ message: "Error generating token" });
            }
            res.status(201).json({ message: "Success generating token", token });
            next();
        }
    );
}

export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

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