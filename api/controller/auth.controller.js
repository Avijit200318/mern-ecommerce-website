import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import {errorHandle} from "../utils/error.js";

export const signUp = async (req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new userModel({username, email, password: hashedPassword});
    try{
        await newUser.save();
        res.status(201).json("user created successfully");
    }catch(error){
        next(error);
    }
}

export const signIn = async (req, res, next) => {
    const {email, password} = req.body;
    try{
        const vaildUser = await userModel.findOne({email});
        if(!vaildUser) return next(errorHandle(404, "User not found"));
        const validPassword = bcryptjs.compareSync(password, vaildUser.password);
        if(!validPassword) return next(errorHandle(404, "Wrong Credentials"));
        const token = jwt.sign({id: vaildUser._id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = vaildUser._doc;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
    }catch(error){
        next(error);
    }
}

export const google = async (req, res, next) => {
    try{
        const user = await userModel.findOne({email: req.body.email});
        if(user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: pass, ...rest} = user._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        }else{
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatePassword, 10);
            const newUser = new userModel({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email:req.body.email, password: hashedPassword, avatar: req.body.photo});
            await newUser.save();
            const {password: pass, ...rest} = newUser._doc;
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(rest);
        }
    }catch(error){
        next(error);
    }
};

export const signOut = (req, res, next) => {
    try{
        res.clearCookie('access_token');
        res.status(200).json("User has been logged out");
    }catch(error){
        next(error);
    }
}