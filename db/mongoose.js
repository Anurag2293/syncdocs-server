import mongoose from "mongoose";

const connectToDB = () => {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.log(err.message));
}

export default connectToDB;