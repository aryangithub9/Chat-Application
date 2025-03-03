import { genrateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js'

export const signup=async(req,res)=>{
    const {fullName,email,password} = req.body;
    if(!fullName || !email || !password){
        return res.status(400).json({message:"Please fill all the fields"})
    }
    try {
        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 characters long"})
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"Email Already exits"});
        }

        const salt = await bcrypt.genSalt(10);
        const hassedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName,
            email,
            password:hassedPassword
        });

        if(newUser){
            genrateToken(newUser._id,res);
            await newUser.save();
            return res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            });
        }
        else{
            console.log(error.message);
            return res.status(500).json({message:"Internal Server Error"});
        }
        
    } catch (error) {
        
    }
}

export const login= async(req,res)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"Please fill all the fields"})
    }

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        else{
            genrateToken(user._id,res);
            return res.status(200).json({
                _id:user._id,
                fullName:user.fullName,
                email:user.email,
                profilePic:user.profilePic,
            });
        }
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal Server Error"});
    }
   
}

export const logout=(req,res)=>{
    try {
        res.cookie('jwt','',{maxAge:0});
        return res.status(200).json({message:"Logged Out Successfully"});
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({message:"Internal Server Error"});
    }
}

export const updateProfile = async(req,res)=>{
    try {
        const {profilePic} = req.body;
        const userId =req.user._id;
        if(!profilePic){
            return res.status(400).json({message: "Profile pic is required"})
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updateduser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
        res.status(200).json({updateduser});
    } catch (error) {
        console.log('error in updating profile',error);
        res.status(500).json({message:"Internal Server Error"});    
    }

}

export const checkAuth =(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log('Error in CheckAuth ', error.message);
        res.status(500).json({message:"Internal Server Error"});
        
    }

}