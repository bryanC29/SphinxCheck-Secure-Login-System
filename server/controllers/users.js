import Users from '../models/user.js';

import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
    const { name, password, email, role } = req.body;

    if (!name || !password || !email || !role)
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

        res.status(201).json({ message: "Successful request", newUser });
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

        res.status(200).json({ message: 'Login Success' });
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
        // res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
    }

    catch(err) {
        console.error(err);
        return res.status(500).json({ message: 'Failed to logout' });
    }
}