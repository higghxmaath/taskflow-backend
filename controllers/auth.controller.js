const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: {
          fields: ["Name, email and password are required"]
        }
      });
    }

    // 2. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists"
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // 5. Respond (NO PASSWORD)
    res.status(201).json({
      status: "success",
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email and password required"
      });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials"
      });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid credentials"
      });
    }

    // 4. Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 5. Respond
    res.status(200).json({
      status: "success",
      token,
      expires_in: process.env.JWT_EXPIRES_IN,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch {
    res.status(500).json({
      status: "error",
      message: "Server error"
    });
  }
};

exports.logout = async (req, res) => {
  res.json({
    status: "success",
    message: "Logged out"
  });
};



