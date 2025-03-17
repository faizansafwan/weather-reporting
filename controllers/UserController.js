const UserSchema = require("../models/UserSchema");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  };

const createUser = async (req, res) => {
    try {
      const { name, country, city, email, password } = req.body;

      // Password validation
      const passwordIncludes = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (!passwordIncludes.test(password)) {
          return res.status(400).json({
              message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character."
          });
      }
  
      // Check if user already exists
      const existingUser = await UserSchema.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
  
      // Create new user
      const newUser = new UserSchema({ name, country, city, email, password });
      await newUser.save();
  
      res.status(201).json({ message: "User created successfully", 
        user: newUser,
         });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  const LoginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserSchema.findOne({email});

      if (!user) return res.status(400).json({ message: "User not found" });

      const authenticate = await bcrypt.compare(password, user.password);

      if (!authenticate) return res.status(400).json({ message: "Invalid credentials" });

      // Generate JWT token
      const token = generateToken(user);

      res.json({
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          country: user.country,
          city: user.city,
          token: token,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    
    }
  }


  const getUsers = async (req, res) => {
    try {
      const users = await UserSchema.find().select("-password"); // Exclude password field
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  const getUserById = async (req, res) => {
    try {
      const user = await UserSchema.findById(req.params.id).select("-password");
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };


  // Update User Location
const UpdateUserLocation = async (req, res) => {
  try {
      const { country, city } = req.body;
      const user = await UserSchema.findById(req.params.id);

      if (!user) return res.status(404).json({ message: "User not found" });

      // Update fields
      user.country = country || user.country;
      user.city = city || user.city;

      await user.save();

      res.json({ message: "Location updated successfully", user });
  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};


  
module.exports = { createUser, LoginUser, getUsers, getUserById, UpdateUserLocation };