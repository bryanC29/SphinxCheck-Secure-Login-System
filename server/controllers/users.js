import Users from '../models/user.js';
import { generateToken } from '../utils/tokens.js';

import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
    const { name, password, email, role } = req.body;

    if (!name || !password || !email)
        return res.status(400).json({ message: 'Please fill in all fields' });

    try {
        const existingUser = await Users.findOne({ email })

        if(existingUser)
            return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new Users({
            name,
            password: hashedPassword,
            email,
            role
        });
        await newUser.save();

        const ip = (req.ip == "::1") ? "127.0.0.1" : req.ip;
        
        const token = await generateToken(ip, newUser._id);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            signed: true,
        });
        
        res.status(201).json({ message: "Successful request", newUser, token });
    }
    
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to create user' });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Please fill in all fields' });
    
    try {
        const user = await Users.findOne({ email });
        
        if(!(user && (await bcrypt.compare(password, user.password))))
            return res.status(400).json({ message: 'Invalid email or password' });

        user.password = undefined;
        
        const ip = (req.ip == "::1") ? "127.0.0.1" : req.ip;
        const token = generateToken(ip, user._id);

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            signed: true,
        });

        res.status(200).json({ message: 'Login Success', user, token });
    }

    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to login' });
    }
}

export const logout = (req, res) => {
    try {
        // req.logout();
        // req.session.destroy();
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    }

    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to logout' });
    }
}