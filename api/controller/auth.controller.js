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