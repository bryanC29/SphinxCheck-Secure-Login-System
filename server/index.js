import express, { urlencoded } from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'
import RedisClient from 'ioredis'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cookieParser(process.env.PRIVATE_PASSPHRASE));

app.use(cors({
    'origin': '*',
    'methods': 'GET,POST,',
}));

app.use(express.json({
    limit: '5mb',
}));

app.use(urlencoded({
    extended: true,
}));

const client = new RedisClient({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    connectTimeout: 10000,
})

const limiter = rateLimit({
	windowMs: 60 * 1000,
	max: 50,
	standardHeaders: true,
	legacyHeaders: false,
    store: new RedisStore({sendCommand: (...args) => client.call(...args),
	}),
    handler: (req, res) => {
        res.status(429).json({
            error: "Too many requests",
            message: "Too many requests to server has been made",
            statusCode: 429
        });
    },
})

app.use(limiter)

app.get('/', (req, res) => {
    res.status(200).json({'message': 'Working RBAC Backend'});
});

app.post('/', (req, res) => {
    res.status(200).json({'message': 'Post request for RBAC Backend'});
});

import usersRoute from './routes/users.js';

app.use('/user', usersRoute);

export default app;