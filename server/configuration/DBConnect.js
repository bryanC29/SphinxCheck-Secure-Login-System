import mongoose from "mongoose";

const DBConnect = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log(`Database Connected to ${mongoose.connection.host}`);
        })
        .catch((err) => {
            console.log(`Error connecting to DB`);
        })
    }
    catch(err) {
        console.log(`Error occured ${err}`);
    }
}

export default DBConnect;