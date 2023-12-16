import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userSchemaModel from "../model/userModel.js";
import "../model/connection.js";
import sendMail from "./mailapi.js";
import sendOtpMail from "./otpmailapi.js";

export const save = async (req, res, next) => {
  const user = await userSchemaModel.find().sort({ _id: -1 });
  const id = user.length === 0 ? 1 : user[0]._id + 1;

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const userObj = {
    _id: id,
    status: 1,
    info: new Date(),
    role: "user",
    email: req.body.email,
    // Store the hashed password
    password: hashedPassword,
    // Add other properties from req.body as needed
    // ...
  };

  try {
    const isUserSaved = await userSchemaModel.create(userObj);
    if (isUserSaved) {
      // SENDING MAIL TO USER
      sendMail(isUserSaved.email, isUserSaved.password);

      res.status(200).json({
        status: true,
        msg: "Your details have been added successfully",
      });
    } else {
      res.status(400).json({ status: false, msg: "Server error......" });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      msg: "Given data already exists or there is an error.",
    });
  }
};

//api for login user -----------------------------------------------------------------------

export const login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ message: "Please enter your email and password" });
    }

    // Normalize and trim the email before using it in the query
    const normalizedEmail = req.body.email.trim().toLowerCase();

    const user = await userSchemaModel.findOne({
      email: normalizedEmail,
      status: 1,
    });
    console.log(process.env.JWT_SECRET_KEY);
    if (user) {
      // Compare the input password with the stored hashed password
      const isPasswordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isPasswordMatch) {
        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET_KEY, // Replace with your secret key
          { expiresIn: "1h" } // Set the expiration time for the token
        );

        return res.status(200).json({
          status: true,
          msg: "Logged in successfully...",
          token: token,
          userDetails: user,
        });
      } else {
        return res.status(401).json({ msg: "Invalid password" });
      }
    } else {
      return res.status(404).json({ msg: "User not found" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

//----------------------------------------------------------
//FOR SENDING OTP EMAIL

export const otpVerify = async (req, res, next) => {
  const otp = {
    ...req.body,
  };
  console.log(req.body);

  try {
    const isOtpSent = await sendOtpMail(otp.email, otp.otp);
    if (isOtpSent) {
      res.status(200).json({ msg: "otp sent successfully" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};

//---------------------------------------------
export const getUser = async (req, res, next) => {
  const user = await userSchemaModel.find();
  res.status(400).json({ user: user });
};
