import mongoose from "mongoose";

const connectDB = async() => {
    try {
        mongoose.connection.on('connected', ()=>{
            console.log("MongoDB connected successfully!")
        });
        await mongoose.connect(`${process.env.MONGO_DB_URI}/GreenCart`)
    } catch (error) {
        console.error(error.message)
    }
}

export default connectDB;