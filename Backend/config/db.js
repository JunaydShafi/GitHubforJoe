import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // process code 1 code means exit with failure, 0 means success
    }
};

/*
{//Overview of MongoDB Setup
    "_id": "64395f47f9a1b34788de1234",
    "email": "customer@example.com",
    "password": "hashedpassword",
    "role": "customer"
  }

  {// Sign-up / Login
    "_id": ObjectId,
    "email": "user@example.com",
    "password": "hashed_password",
    "role": "customer", // or "mechanic", "admin"
    "name": "John Doe"
  }

  {//Vehicles Linked to Accounts
    "_id": ObjectId,
    "ownerId": ObjectId, // reference to user
    "make": "Toyota",
    "model": "Camry",
    "year": 2021,
    "vin": "123456789ABCDEFG"
  }

  {//appointments
    "_id": ObjectId,
    "customerId": ObjectId,
    "vehicleId": ObjectId,
    "datetime": "2025-04-10T10:00:00Z",
    "status": "pending", // or "approved", "denied"
    "adminId": ObjectId // for who approved it
  }

  {// Jobs / Mechanic Dashboard
    "_id": ObjectId,
    "vehicleId": ObjectId,
    "mechanicId": ObjectId,
    "appointmentId": ObjectId,
    "status": "in-progress",
    "progress": 65, // percent
    "notes": [
      {
        "timestamp": "2025-04-08T12:00:00Z",
        "message": "Diagnosed engine issue"
      }
    ]
  }

  // How to use bcrypt in Node.js
  npm install bcrypt

   // when user signes in
   const bcrypt = require('bcrypt');

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
};

// Example usage
const plainPassword = 'mySecurePassword';
const hashedPassword = await hashPassword(plainPassword);
// Store hashedPassword in MongoDB

// when user logs in
const bcrypt = require('bcrypt');

const login = async (inputPassword, storedHashedPassword) => {
  const match = await bcrypt.compare(inputPassword, storedHashedPassword);
  if (match) {
    // Login successful
  } else {
    // Invalid credentials
  }
};

//Using JWT (JSON Web Tokens) for Login Sessions
npm install jsonwebtoken

//When login is successful
const jwt = require('jsonwebtoken');

const createToken = (userId) => {
  const payload = { id: userId };
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(payload, secret, { expiresIn: '2h' });
  return token;
};

//To protect routes
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
*/