import express, { urlencoded } from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
    'origin': '*',
    'methods': 'GET,POST,',
}));

app.use(express.json({
    limit: '5mb',
}));

app.use(express.urlencoded({
    extended: true,
}));

app.get('/', (req, res) => {
    res.status(200).json({'message': 'Working RBAC Backend'});
});

app.post('/', (req, res) => {
    res.status(200).json({'message': 'Post request for RBAC Backend'});
});

import usersRoute from './routes/users.js';

app.use('/user', usersRoute);

export default app;