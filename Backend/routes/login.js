import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if the password matches the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },  // Payload - can include any data you need
      process.env.JWT_SECRET,             // Secret key for signing the token (stored securely in .env)
      { expiresIn: '1h' }                // Expiration time (can be adjusted)
    );

     // Determine the redirect page based on user role
     let redirect = '/customerMainPage.html';
     if (user.role === 'employee') redirect = '/employee-dashboard.html';
     if (user.role === 'admin') redirect = '/adminMain.html';

    // console.log("Redirect page:", redirect);  // Log the redirect page


    // Return the token along with the user data (you can choose what to send)
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      redirect
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
