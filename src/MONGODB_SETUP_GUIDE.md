# MongoDB Setup Guide for Retinal-AI Platform

This guide will help you set up MongoDB database integration for the Retinal-AI platform.

## Overview

The platform has been migrated from MySQL to MongoDB Atlas cloud database for better scalability and flexibility. The system uses Mongoose ODM for database operations and GridFS for file storage.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)
- Internet connection for cloud database access

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Account
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account or sign in
3. Create a new cluster (free M0 Sandbox cluster is sufficient for development)

### 2. Database Configuration
1. In your MongoDB Atlas dashboard, go to "Database Access"
2. Create a new database user with readWrite privileges
3. Note down the username and password
4. Go to "Network Access" and add your IP address (or 0.0.0.0/0 for development)

### 3. Get Connection String
1. In the Atlas dashboard, click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (it should look like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Backend Configuration

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb+srv://enochlebabo:2022@retina.3clhamb.mongodb.net/retinal_ai
   JWT_SECRET=your-secure-jwt-secret-key
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```

### 3. Start the Backend Server
```bash
# For development
npm run dev

# For production
npm start
```

## Database Schema

The MongoDB database includes the following collections:

### Collections:
- **users** - User accounts (doctors, patients, admins)
- **patients** - Patient records
- **retinalanalyses** - AI analysis results
- **medicalreports** - Generated medical reports
- **systemanalytics** - System metrics and analytics
- **aimodelperformances** - AI model performance tracking
- **fileuploads** - File upload metadata

### GridFS:
- **retinal_images** - Binary storage for retinal images

## Key Features

### 1. Authentication & Authorization
- JWT-based authentication
- Role-based access control (admin, doctor, patient)
- Secure password hashing with bcrypt

### 2. File Storage
- Local file storage for development
- GridFS for large file storage
- Secure file access with permission checks

### 3. Real-time Updates
- WebSocket support for live updates
- Real-time analytics dashboard
- Live training progress monitoring

### 4. AI Model Integration
- Model training lifecycle management
- Performance metrics tracking
- Confidence score analysis

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/signout` - User logout

### Patient Management
- `GET /api/patients` - List patients
- `GET /api/patients/:id` - Get patient details
- `POST /api/patients` - Create new patient

### Analysis
- `POST /api/analysis` - Save analysis results
- `GET /api/analysis/:id` - Get specific analysis
- `GET /api/analysis/patient/:patientId` - Get patient analyses
- `PUT /api/analysis/:id` - Update analysis
- `DELETE /api/analysis/:id` - Delete analysis

### File Uploads
- `POST /api/uploads/image` - Upload retinal image
- `GET /api/uploads/files/:filename` - Get file
- `GET /api/uploads/patient/:patientId` - List patient files
- `DELETE /api/uploads/:fileId` - Delete file

### Analytics
- `GET /api/analytics/overview` - System overview
- `GET /api/analytics/doctor/:doctorId` - Doctor analytics
- `GET /api/analytics/ai-performance` - AI model performance
- `GET /api/analytics/patients` - Patient analytics
- `POST /api/analytics/ai-performance` - Update model performance

### Model Training
- `POST /api/model-training/start` - Start training
- `GET /api/model-training/status/:jobId` - Get status
- `POST /api/model-training/stop/:jobId` - Stop training

## Security Considerations

### 1. Database Security
- Use MongoDB Atlas for built-in security features
- Enable authentication and authorization
- Use connection string with credentials
- Restrict network access to known IPs

### 2. API Security
- JWT token authentication
- Password hashing with bcrypt (12 rounds)
- Role-based access control
- Input validation and sanitization

### 3. File Security
- Secure file upload validation
- Permission-based file access
- File type restrictions
- Size limitations

## Troubleshooting

### Common Issues:

1. **Connection Timeout**
   - Check network access settings in MongoDB Atlas
   - Verify connection string format
   - Ensure IP address is whitelisted

2. **Authentication Failed**
   - Verify username and password in connection string
   - Check database user permissions
   - Ensure user has readWrite access

3. **Collection Not Found**
   - MongoDB will create collections automatically
   - Ensure proper schema definitions
   - Check database name in connection string

4. **File Upload Issues**
   - Verify uploads directory exists
   - Check file size limits
   - Ensure proper MIME type validation

## Development vs Production

### Development
- Use local MongoDB or MongoDB Atlas sandbox
- Enable detailed logging
- Use development environment variables
- Allow broader CORS origins

### Production
- Use dedicated MongoDB Atlas cluster
- Configure proper security groups
- Use environment-specific secrets
- Enable monitoring and alerting
- Set up backup strategies

## Monitoring and Maintenance

### 1. Database Monitoring
- Use MongoDB Atlas monitoring dashboard
- Set up alerts for performance issues
- Monitor connection pool usage
- Track query performance

### 2. Application Monitoring
- Implement logging for all operations
- Monitor API response times
- Track error rates
- Set up health checks

### 3. Backup Strategy
- MongoDB Atlas provides automatic backups
- Configure backup retention policies
- Test restore procedures regularly
- Document recovery processes

## Support

For issues related to:
- MongoDB Atlas: [MongoDB Support](https://support.mongodb.com/)
- Application Issues: Check application logs
- Performance: Use MongoDB Profiler
- Security: Review MongoDB Security Checklist

## Migration Notes

This platform has been migrated from MySQL to MongoDB. Key changes:
- Relational data model converted to document-based
- SQL queries replaced with MongoDB aggregation pipelines
- Foreign key relationships implemented with ObjectId references
- Complex joins replaced with population and aggregation
- GridFS used for large file storage instead of filesystem paths

The migration maintains all existing functionality while providing better scalability and flexibility for future enhancements.