import bodyParser from "body-parser";
import express from "express";
import useRouter from "./routes/userRouter.js";
import dotenv from "dotenv";

// Set up Global configuration access
dotenv.config();

import cors from "cors";
const app = express();

//ENCODING DATA IN THE BODY SECURELY
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//ADDED TO SOLVE THE PROBLEM OF CROSS ORIGIN
app.use(cors());

//REDIRECTING TO THE USER ROUTE
app.use("/user", useRouter);

app.listen(3001);
console.log("server is activated at http://localhost:3001");
