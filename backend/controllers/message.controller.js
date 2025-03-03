import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";


export const getUsersForSidebar=async(req,res)=>{
    try {
        const currentuser = req.user._id;
        const restallusers = await User.find({_id:{$ne:currentuser}}).select("-password");
        res.status(200).json(restallusers);
    } catch (error) {
        console.log('Error is finding user',error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const getMessages= async(req,res)=>{
    try {
        const {id:usertoChatId} = req.params;
        const myId = req.user._id;
        
        const messages= await Message.find({
            $or:[
                {senderId:myId,receiverId:usertoChatId},
                {senderId:usertoChatId,receiverId:myId}
            ]
        })
    
        res.status(200).json(messages);
    } catch (error) {
        console.log('Error is ',error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export const sendMessage=async(req,res)=>{
    try {
        const {text, Image} = req.body;
        const {id:receiverId}=req.params;
        const senderId = req.user._id;
        let imageUrl;
        if(Image){
            let uploadResponse = await cloudinary.uploader.upload(Image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        await newMessage.save();

        //socket/io
        res.status(201).json(newMessage);
    
    } catch (error) {
        console.log('Error is ',error.message);
        res.status(500).json({message:"Internal Server Error"});
    }

}
