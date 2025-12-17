import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



export const registerUser = async (req, res) => {

  try {


    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    if (email.trim() === "") {
      return res.status(400).json({ message: "Email is required" });
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    if (password.trim() === "") {
      return res.status(400).json({ message: "Password is required" });
    } else if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: "User registered" });

  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });

  }
};

export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Email is required" });
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!password || password.trim() === "") {
      return res.status(400).json({ message: "Password is required" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ token, name: user.name, message: "Login successful" });

  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });

  }
};

export const logoutUser = async (req, res) => {
  res.json({ message: "Logged out successfully" });
};

