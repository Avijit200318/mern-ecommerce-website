import userModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signUp = async (req, res) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new userModel({username, email, password: hashedPassword});
    await newUser.save();
    res.status(201).json("user created successfully");
}