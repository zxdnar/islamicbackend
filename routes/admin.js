const express = require('express');
const router = express.Router();

// Mock admin data
let adminStats = {
  totalUsers: 1250,
  activeUsers: 890,
  totalContent: 45,
  totalNotifications: 12,
  systemHealth: 'healthy',
  lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000)
};

// Get admin dashboard stats
router.get('/dashboard', (req, res) => {
  try {
    res.json({
      success: true,
      data: adminStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard stats',
      message: error.message
    });
  }
});

// Get system health
router.get('/health', (req, res) => {
  try {
    const health = {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    };

    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system health',
      message: error.message
    });
  }
});

// Get content management stats
router.get('/content/stats', (req, res) => {
  try {
    const contentStats = {
      duas: {
        total: 25,
        categories: ['morning', 'evening', 'protection', 'forgiveness'],
        recent: 3
      },
      ruqya: {
        total: 12,
        categories: ['protection', 'healing', 'general'],
        recent: 1
      },
      books: {
        total: 8,
        categories: ['aqeedah', 'fiqh', 'hadith', 'seerah'],
        recent: 2
      }
    };

    res.json({
      success: true,
      data: contentStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content stats',
      message: error.message
    });
  }
});

// Get user analytics
router.get('/analytics/users', (req, res) => {
  try {
    const userAnalytics = {
      totalUsers: 1250,
      activeUsers: 890,
      newUsersThisWeek: 45,
      newUsersThisMonth: 180,
      userGrowth: 12.5,
      topCountries: [
        { country: 'United States', users: 450 },
        { country: 'United Kingdom', users: 280 },
        { country: 'Canada', users: 180 },
        { country: 'Australia', users: 120 },
        { country: 'Germany', users: 95 }
      ],
      deviceTypes: [
        { type: 'Android', percentage: 65 },
        { type: 'iOS', percentage: 35 }
      ]
    };

    res.json({
      success: true,
      data: userAnalytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user analytics',
      message: error.message
    });
  }
});

// Get content analytics
router.get('/analytics/content', (req, res) => {
  try {
    const contentAnalytics = {
      mostViewed: [
        { title: 'Dua for Protection', views: 1250, type: 'dua' },
        { title: 'Ruqya for Evil Eye', views: 980, type: 'ruqya' },
        { title: 'Book of Tawheed', views: 750, type: 'book' }
      ],
      mostShared: [
        { title: 'Dua for Morning', shares: 450, type: 'dua' },
        { title: 'Ruqya for Healing', shares: 320, type: 'ruqya' },
        { title: 'Islamic Etiquette', shares: 280, type: 'book' }
      ],
      categories: {
        duas: { total: 25, views: 8500 },
        ruqya: { total: 12, views: 6200 },
        books: { total: 8, views: 3400 }
      }
    };

    res.json({
      success: true,
      data: contentAnalytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch content analytics',
      message: error.message
    });
  }
});

// Update system settings
router.put('/settings', (req, res) => {
  try {
    const { maintenanceMode, pushNotifications, contentApproval } = req.body;

    // TODO: Update actual system settings
    console.log('System settings updated:', { maintenanceMode, pushNotifications, contentApproval });

    res.json({
      success: true,
      message: 'System settings updated successfully',
      data: {
        maintenanceMode: maintenanceMode || false,
        pushNotifications: pushNotifications || true,
        contentApproval: contentApproval || false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update system settings',
      message: error.message
    });
  }
});

// Backup system data
router.post('/backup', (req, res) => {
  try {
    // TODO: Implement actual backup functionality
    const backupInfo = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      size: '2.5MB',
      status: 'completed',
      type: 'full'
    };

    adminStats.lastBackup = new Date();

    res.json({
      success: true,
      message: 'Backup completed successfully',
      data: backupInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create backup',
      message: error.message
    });
  }
});

// Get backup history
router.get('/backups', (req, res) => {
  try {
    const backups = [
      {
        id: 1,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        size: '2.5MB',
        status: 'completed',
        type: 'full'
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        size: '2.3MB',
        status: 'completed',
        type: 'full'
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        size: '2.4MB',
        status: 'completed',
        type: 'full'
      }
    ];

    res.json({
      success: true,
      data: backups
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch backup history',
      message: error.message
    });
  }
});

// Get system logs
router.get('/logs', (req, res) => {
  try {
    const { level = 'all', limit = 50, offset = 0 } = req.query;

    // Mock logs
    const logs = [
      {
        id: 1,
        level: 'info',
        message: 'Server started successfully',
        timestamp: new Date().toISOString(),
        source: 'server'
      },
      {
        id: 2,
        level: 'info',
        message: 'New user registered',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        source: 'auth'
      },
      {
        id: 3,
        level: 'warning',
        message: 'High memory usage detected',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        source: 'system'
      }
    ];

    let filteredLogs = logs;
    if (level !== 'all') {
      filteredLogs = logs.filter(log => log.level === level);
    }

    const paginatedLogs = filteredLogs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: filteredLogs.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system logs',
      message: error.message
    });
  }
});

module.exports = router; 