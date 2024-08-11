const express = require("express"); // set up express
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express(); // create an instance of express app to do apis and middleware
const cookieParser = require("cookie-parser");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "ajfhjsdfhasjdkh";

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

// set up database connection
const username = encodeURIComponent(process.env.MONGODB_USERNAME);
const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
const cluster = process.env.MONGODB_CLUSTER;

const url = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(url);

// route to register a new user
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email }); // returns null if not found in db

    if (existingUser) {
      return res.status(400).json({ message: "Email in use" });
    }

    const hashedPassword = bcrypt.hashSync(password, bcryptSalt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Registration failed. Please try again" });
  }
});

// endpoint to verify account credentials
app.post("/login", async (req, res) => {
  const { email, password } = req.body; // don't need try since it will always contain info with request
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const userPassword = existingUser.password;
      const passwordVerified = bcrypt.compareSync(password, userPassword);

      if (passwordVerified) {
        // send a cookie
        jwt.sign(
          {
            name: existingUser.name,
            email: existingUser.email,
            id: existingUser._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) {
              console.error("JWT generation error: ", err);
              res
                .status(500)
                .json({ message: "Login failed. Please try again." });
            }
            res
              .status(201)
              .cookie("token", token, { httpOnly: true })
              .json(existingUser);
          }
        );
      } else {
        res
          .status(400)
          .json({ message: "Login unsuccessful. Invalid password." });
      }
    } else {
      res
        .status(401)
        .json({ message: "Login unsuccessful. Email not registered." });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed. Please try again." });
  }
});

// this endpoint will check if there is login information by checking the website's cookie
app.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  // if the token within the cookie exists, verify it and return the decrypted information (email and id)
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(cookieData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.listen(4000); // starts server at the specified port
