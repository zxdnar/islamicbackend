const express = require('express');
const router = express.Router();

// Mock data for notifications
let notifications = [
  {
    id: 1,
    title: "New Ruqya Video Added",
    message: "A powerful ruqya for protection has been added to the app",
    type: "content_update",
    priority: "normal",
    sentAt: new Date(),
    readBy: [],
    data: {
      contentType: "ruqya",
      contentId: 1
    }
  }
];

// Get all notifications
router.get('/', (req, res) => {
  try {
    const { type, limit = 20, offset = 0 } = req.query;
    let filteredNotifications = notifications;

    if (type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }

    // Pagination
    const paginatedNotifications = filteredNotifications
      .sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt))
      .slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    res.json({
      success: true,
      data: paginatedNotifications,
      count: filteredNotifications.length,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: filteredNotifications.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      message: error.message
    });
  }
});

// Send push notification
router.post('/send', (req, res) => {
  try {
    const { title, message, type = 'general', priority = 'normal', data = {} } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required'
      });
    }

    const newNotification = {
      id: notifications.length + 1,
      title,
      message,
      type,
      priority,
      sentAt: new Date(),
      readBy: [],
      data
    };

    notifications.push(newNotification);

    // TODO: Integrate with Firebase Cloud Messaging
    // For now, just log the notification
    console.log('Push notification sent:', newNotification);

    res.status(201).json({
      success: true,
      data: newNotification,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to send notification',
      message: error.message
    });
  }
});

// Send announcement to all users
router.post('/announcement', (req, res) => {
  try {
    const { title, message, priority = 'normal', expiresAt } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Title and message are required'
      });
    }

    const announcement = {
      id: notifications.length + 1,
      title,
      message,
      type: 'announcement',
      priority,
      sentAt: new Date(),
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      readBy: [],
      data: {
        isAnnouncement: true
      }
    };

    notifications.push(announcement);

    // TODO: Send to all registered devices via FCM
    console.log('Announcement sent to all users:', announcement);

    res.status(201).json({
      success: true,
      data: announcement,
      message: 'Announcement sent to all users'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to send announcement',
      message: error.message
    });
  }
});

// Mark notification as read
router.put('/:id/read', (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    if (!notification.readBy.includes(userId)) {
      notification.readBy.push(userId);
    }

    res.json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      message: error.message
    });
  }
});

// Get notification statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total: notifications.length,
      byType: {
        general: notifications.filter(n => n.type === 'general').length,
        content_update: notifications.filter(n => n.type === 'content_update').length,
        announcement: notifications.filter(n => n.type === 'announcement').length,
        prayer_reminder: notifications.filter(n => n.type === 'prayer_reminder').length
      },
      byPriority: {
        low: notifications.filter(n => n.priority === 'low').length,
        normal: notifications.filter(n => n.priority === 'normal').length,
        high: notifications.filter(n => n.priority === 'high').length,
        urgent: notifications.filter(n => n.priority === 'urgent').length
      },
      recent: notifications
        .filter(n => new Date(n.sentAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
        .length
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notification statistics',
      message: error.message
    });
  }
});

// Delete notification
router.delete('/:id', (req, res) => {
  try {
    const notificationId = parseInt(req.params.id);
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);

    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    const deletedNotification = notifications.splice(notificationIndex, 1)[0];

    res.json({
      success: true,
      data: deletedNotification,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification',
      message: error.message
    });
  }
});

module.exports = router; 