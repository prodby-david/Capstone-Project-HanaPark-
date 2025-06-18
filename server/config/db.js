import mongoose from "mongoose";


const connectDB = async() => {
    try{
        const con = mongoose.connect(process.env.MONGO_URI);
        console.log('Database connected successfully');
    }
    catch(err){
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB;