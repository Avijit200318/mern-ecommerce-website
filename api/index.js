import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO).then(()=> {
    console.log("mongodb is connected");
}).catch((error)=> {
    console.log(error);
})

app.listen(3000, ()=> {
    console.log("server is running at port 3000");
})