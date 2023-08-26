import mongoose from "mongoose";

const connectToDB = () => {
    mongoose
        .connect('mongodb://127.0.0.1:27017/google-docs-clone')
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.log(err.message));
}

export default connectToDB;