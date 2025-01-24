import mongoose from "mongoose"
export const ConnectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGODBURL);
        console.log('Database Connected Sucessfully')
    } catch (error) {
        console.log(error);
    }
}