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
mongoose.connect('mongodb://localhost:27017/staygo');

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
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
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ message: 'All fields are required.' });
	}
	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials.' });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials.' });
		}
		const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
		res.json({ token, role: user.role });
	} catch (err) {
		res.status(500).json({ message: 'Server error.' });
	}
});
// Registration endpoint
app.post('/api/register', async (req, res) => {
	const { username, password, role, fullName, email } = req.body;
	if (!username || !password || !role || !fullName || !email) {
		return res.status(400).json({ message: 'All fields are required.' });
	}
	if (!['student', 'technitian', 'rider', 'admin'].includes(role)) {
		return res.status(400).json({ message: 'Invalid role.' });
	}
	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(409).json({ message: 'Username already exists.' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({ username, password: hashedPassword, role, fullName, email });
		await user.save();
		res.status(201).json({ message: 'User registered successfully.' });
	} catch (err) {
		res.status(500).json({ message: 'Server error.' });
	}
});
