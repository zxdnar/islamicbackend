# Islamic Dashboard Backend API Documentation

## Base URL
```
https://your-project.railway.app
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Health Check
- **GET** `/health`
- **Description**: Check if the server is running
- **Response**:
```json
{
  "status": "OK",
  "message": "Islamic Dashboard Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Content Management

#### Duas
- **GET** `/api/content/duas`
  - **Query Parameters**:
    - `category` (optional): Filter by category
    - `search` (optional): Search in title or translation
  - **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Dua for Morning",
      "arabic": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
      "translation": "We have reached the morning...",
      "category": "morning",
      "audioUrl": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

- **GET** `/api/content/duas/:id`
  - **Response**: Single dua object

- **POST** `/api/content/duas`
  - **Body**:
```json
{
  "title": "Dua for Protection",
  "arabic": "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
  "translation": "I seek refuge in Allah from the accursed Satan",
  "category": "protection",
  "audioUrl": "https://example.com/audio.mp3"
}
```

#### Ruqya Videos
- **GET** `/api/content/ruqya`
  - **Query Parameters**:
    - `category` (optional): Filter by category
    - `search` (optional): Search in title or description
  - **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Ruqya for Protection",
      "description": "Powerful ruqya for protection...",
      "videoUrl": "https://example.com/video.mp4",
      "duration": "15:30",
      "category": "protection",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

- **POST** `/api/content/ruqya`
  - **Body**:
```json
{
  "title": "Ruqya for Healing",
  "description": "Ruqya for physical and spiritual healing",
  "videoUrl": "https://example.com/healing.mp4",
  "duration": "20:15",
  "category": "healing",
  "thumbnail": "https://example.com/thumbnail.jpg"
}
```

#### Books
- **GET** `/api/content/books`
  - **Query Parameters**:
    - `category` (optional): Filter by category
    - `search` (optional): Search in title, author, or description
  - **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "The Book of Tawheed",
      "author": "Muhammad ibn Abdul Wahhab",
      "description": "A comprehensive book about Islamic monotheism",
      "pdfUrl": "https://example.com/tawheed.pdf",
      "coverImage": "https://example.com/cover.jpg",
      "category": "aqeedah",
      "pages": 150,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

- **POST** `/api/content/books`
  - **Body**:
```json
{
  "title": "Islamic Etiquette",
  "author": "Imam Al-Ghazali",
  "description": "A guide to Islamic manners and etiquette",
  "pdfUrl": "https://example.com/etiquette.pdf",
  "coverImage": "https://example.com/cover.jpg",
  "category": "adab",
  "pages": 200
}
```

### Notifications

#### Get Notifications
- **GET** `/api/notifications`
  - **Query Parameters**:
    - `type` (optional): Filter by notification type
    - `limit` (optional): Number of notifications (default: 20)
    - `offset` (optional): Pagination offset (default: 0)
  - **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "New Ruqya Video Added",
      "message": "A powerful ruqya for protection has been added",
      "type": "content_update",
      "priority": "normal",
      "sentAt": "2024-01-01T00:00:00.000Z",
      "readBy": [],
      "data": {
        "contentType": "ruqya",
        "contentId": 1
      }
    }
  ],
  "count": 1,
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 1
  }
}
```

#### Send Notification
- **POST** `/api/notifications/send`
  - **Body**:
```json
{
  "title": "Prayer Time Reminder",
  "message": "It's time for Asr prayer",
  "type": "prayer_reminder",
  "priority": "high",
  "data": {
    "prayer": "asr",
    "time": "15:30"
  }
}
```

#### Send Announcement
- **POST** `/api/notifications/announcement`
  - **Body**:
```json
{
  "title": "Important Announcement",
  "message": "New features have been added to the app",
  "priority": "normal",
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

### Authentication

#### Admin Login
- **POST** `/api/auth/login`
  - **Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```
  - **Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "mock_jwt_token_1234567890",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@islamicdashboard.com",
      "role": "super_admin"
    }
  }
}
```

#### Register Device
- **POST** `/api/auth/register-device`
  - **Body**:
```json
{
  "userId": 123,
  "deviceToken": "fcm_token_here",
  "deviceType": "android"
}
```

### Admin Panel

#### Dashboard Stats
- **GET** `/api/admin/dashboard`
  - **Response**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 890,
    "totalContent": 45,
    "totalNotifications": 12,
    "systemHealth": "healthy",
    "lastBackup": "2024-01-01T00:00:00.000Z"
  }
}
```

#### System Health
- **GET** `/api/admin/health`
  - **Response**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 3600,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "1.0.0",
    "environment": "production",
    "memory": {
      "rss": 12345678,
      "heapTotal": 9876543,
      "heapUsed": 5432109
    },
    "cpu": {
      "user": 123456,
      "system": 78901
    }
  }
}
```

#### User Analytics
- **GET** `/api/admin/analytics/users`
  - **Response**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers": 890,
    "newUsersThisWeek": 45,
    "newUsersThisMonth": 180,
    "userGrowth": 12.5,
    "topCountries": [
      {
        "country": "United States",
        "users": 450
      }
    ],
    "deviceTypes": [
      {
        "type": "Android",
        "percentage": 65
      }
    ]
  }
}
```

## Error Responses

All endpoints return errors in the following format:
```json
{
  "success": false,
  "error": "Error title",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address. When exceeded, you'll receive:
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

## CORS

The API supports CORS for the following origins:
- `http://localhost:3000`
- `https://your-admin-panel.vercel.app`

## Testing

You can test the API using tools like:
- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- [curl](https://curl.se/)

Example curl command:
```bash
curl -X GET https://your-project.railway.app/health
``` 