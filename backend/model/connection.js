import mongoose from "mongoose";
const url = "mongodb://127.0.0.1:27017/collegemajor";
mongoose.connect(url);
console.log("mongodb has been connected successfully");
