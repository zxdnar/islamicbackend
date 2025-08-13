const express = require('express');
const router = express.Router();

// Mock admin users
let adminUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@islamicdashboard.com',
    password: '$2a$10$hashedpassword', // In real app, this would be bcrypt hashed
    role: 'super_admin',
    createdAt: new Date(),
    lastLogin: new Date()
  }
];

// Mock regular users
let users = [
  {
    id: 1,
    username: 'user1',
    email: 'user1@example.com',
    deviceToken: 'fcm_token_here',
    createdAt: new Date(),
    lastActive: new Date()
  }
];

// Admin login
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username and password are required'
      });
    }

    // Find admin user
    const admin = adminUsers.find(u => u.username === username);
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // In real app, verify password with bcrypt
    // For now, just check if password matches
    if (password !== 'admin123') { // Replace with actual password verification
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();

    // Generate JWT token (in real app)
    const token = 'mock_jwt_token_' + Date.now();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: error.message
    });
  }
});

// Register device for push notifications
router.post('/register-device', (req, res) => {
  try {
    const { userId, deviceToken, deviceType = 'android' } = req.body;

    if (!userId || !deviceToken) {
      return res.status(400).json({
        success: false,
        error: 'User ID and device token are required'
      });
    }

    // Find or create user
    let user = users.find(u => u.id === parseInt(userId));
    if (!user) {
      user = {
        id: parseInt(userId),
        username: `user${userId}`,
        email: `user${userId}@example.com`,
        deviceToken,
        deviceType,
        createdAt: new Date(),
        lastActive: new Date()
      };
      users.push(user);
    } else {
      user.deviceToken = deviceToken;
      user.deviceType = deviceType;
      user.lastActive = new Date();
    }

    res.json({
      success: true,
      message: 'Device registered successfully',
      data: {
        userId: user.id,
        deviceToken: user.deviceToken
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to register device',
      message: error.message
    });
  }
});

// Get user profile
router.get('/profile/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const user = users.find(u => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Remove sensitive data
    const { deviceToken, ...userProfile } = user;

    res.json({
      success: true,
      data: userProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { username, email, preferences } = req.body;

    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user data
    if (username) user.username = username;
    if (email) user.email = email;
    if (preferences) user.preferences = preferences;

    user.lastActive = new Date();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

// Get all users (admin only)
router.get('/users', (req, res) => {
  try {
    const { limit = 20, offset = 0, search } = req.query;
    let filteredUsers = users;

    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = users.filter(user => 
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const paginatedUsers = filteredUsers
      .sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
      .map(user => {
        const { deviceToken, ...userData } = user;
        return userData;
      });

    res.json({
      success: true,
      data: paginatedUsers,
      count: filteredUsers.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: filteredUsers.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

// Get user statistics
router.get('/users/stats', (req, res) => {
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const stats = {
      total: users.length,
      active: users.filter(u => new Date(u.lastActive) > oneWeekAgo).length,
      newThisWeek: users.filter(u => new Date(u.createdAt) > oneWeekAgo).length,
      newThisMonth: users.filter(u => new Date(u.createdAt) > oneMonthAgo).length,
      deviceTypes: {
        android: users.filter(u => u.deviceType === 'android').length,
        ios: users.filter(u => u.deviceType === 'ios').length
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user statistics',
      message: error.message
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  try {
    // In real app, invalidate JWT token
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Logout failed',
      message: error.message
    });
  }
});

module.exports = router; 