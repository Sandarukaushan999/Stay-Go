const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const JWT_SECRET = 'your_jwt_secret_key'; // Use a strong secret in production!

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/hostelDB')
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.error(err));

// Start the server
app.listen(5000, () => {
	console.log('Server running on port 5000');
});
// Middleware to verify JWT and roles
function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) return res.sendStatus(401);
	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}

function authorizeRoles(...roles) {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ message: 'Access denied.' });
		}
		next();
	};
}

// Example protected route (admin only)
app.get('/api/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
	res.json({ message: 'Welcome, admin!' });
});
// Login endpoint
app.post('/api/login', async (req, res) => {
	try {
		const { email, username, password } = req.body;
		if (!password) {
			return res.status(400).json({ message: "Password is required" });
		}
		// Allow login by username or email
		let user = null;
		if (email) {
			user = await User.findOne({ email });
		} else if (username) {
			user = await User.findOne({ username });
		}
		if (!user) {
			return res.status(404).json({ message: "User not found. Please check your credentials." });
		}
		
		let passwordMatch = false;
		try {
			passwordMatch = await bcrypt.compare(password, user.password);
		} catch (bcryptErr) {
			// If bcrypt fails (e.g. not a valid hash), try plain text comparison
			passwordMatch = (password === user.password);
		}
		
		if (!passwordMatch) {
			return res.status(400).json({ message: "Password incorrect." });
		}
		
		res.json({
			token: "dummy-token",
			user: {
				_id: user._id,
				name: user.fullName || user.username,
				email: user.email || "",
				phone: user.phone || "",
				address: user.address || "",
				image: user.profileImage || "",
				profileImage: user.profileImage || "",
				role: user.role || ""
			}
		});
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ message: "Server error during login." });
	}
});
// Registration endpoint
app.post('/api/register', async (req, res) => {
	const { username, password, role, fullName, email, phone, address } = req.body;
	if (!username || !password || !role || !fullName) {
		return res.status(400).json({ message: 'Username, password, role, and full name are required.' });
	}
	if (!['student', 'technitian', 'technician', 'rider', 'admin'].includes(role)) {
		return res.status(400).json({ message: 'Invalid role.' });
	}
	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(409).json({ message: 'Username already exists.' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, password: hashedPassword, role, fullName, email, phone: phone || "", address: address || "" });
		await user.save();
		res.status(201).json({ message: 'User registered successfully.' });
	} catch (err) {
		res.status(500).json({ message: 'Server error.' });
	}
});

// Update user profile endpoint (no auth for simplicity)
app.put('/api/users/:id', async (req, res) => {
  console.log("Update ID:", req.params.id);
  
  const dataToUpdate = { ...req.body };
  if (dataToUpdate.name) {
    dataToUpdate.fullName = dataToUpdate.name;
  }
  if (dataToUpdate.image) {
    dataToUpdate.profileImage = dataToUpdate.image;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    dataToUpdate,
    { new: true }
  );

  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({
    _id: updatedUser._id,
    name: updatedUser.fullName || updatedUser.username,
    email: updatedUser.email || "",
    phone: updatedUser.phone || "",
    address: updatedUser.address || "",
    image: updatedUser.profileImage || "",
    profileImage: updatedUser.profileImage || "",
    role: updatedUser.role || ""
  });
});
