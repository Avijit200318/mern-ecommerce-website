import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";

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

// write all the routes here
app.use("/api/user", userRouter);