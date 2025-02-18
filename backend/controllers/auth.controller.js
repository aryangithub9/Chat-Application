import { genrateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'

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