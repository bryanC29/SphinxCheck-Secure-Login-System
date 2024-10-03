import dotenv from 'dotenv';

import app from './index.js';
import DBConnect from './configuration/DBConnect.js';

dotenv.config();

const serverPort = process.env.PORT || 2626;

await DBConnect().then(() => {
    app.listen(serverPort, () => {
        console.log(`Server running on ${serverPort}`);
    })
}).catch(() => {
    console.log('Error starting server');
})