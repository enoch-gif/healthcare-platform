# Retinal-AI MySQL Database Setup Guide

This guide will help you set up the MySQL database backend for the Retinal-AI platform, replacing the previous Supabase integration.

## Prerequisites

- Node.js (version 16 or higher)
- MySQL Server (version 8.0 or higher)
- npm or yarn package manager

## Step 1: Install MySQL Server

### For Windows:
1. Download MySQL Server from [MySQL official website](https://dev.mysql.com/downloads/mysql/)
2. Run the installer and follow the setup wizard
3. Set a strong root password
4. Start the MySQL service

### For macOS:
```bash
# Using Homebrew
brew install mysql
brew services start mysql

# Secure the installation
mysql_secure_installation
```

### For Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql

# Secure the installation
sudo mysql_secure_installation
```

## Step 2: Create Database and User

1. Log into MySQL as root:
```bash
mysql -u root -p
```

2. Create the database:
```sql
CREATE DATABASE retinal_ai;
```

3. Create a dedicated user (optional but recommended):
```sql
CREATE USER 'retinal_ai_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON retinal_ai.* TO 'retinal_ai_user'@'localhost';
FLUSH PRIVILEGES;
```

4. Exit MySQL:
```sql
EXIT;
```

## Step 3: Install Backend Dependencies

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

## Step 4: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=retinal_ai_user
DB_PASSWORD=your_secure_password
DB_NAME=retinal_ai

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Step 5: Configure Frontend Environment

Create a `.env` file in the root directory of your React app:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_DB_HOST=localhost
REACT_APP_DB_PORT=3306
REACT_APP_DB_USER=retinal_ai_user
REACT_APP_DB_PASSWORD=your_secure_password
REACT_APP_DB_NAME=retinal_ai
```

**⚠️ Important Security Note**: Never expose database credentials in the frontend environment variables in production. These should only be used for development purposes.

## Step 6: Start the Backend Server

```bash
cd backend
npm start
```

For development with auto-restart:
```bash
npm run dev
```

You should see output like:
```
🚀 Retinal-AI MySQL Backend Server running on port 3001
📡 WebSocket server ready for real-time updates
🗄️  Database: retinal_ai
🔒 JWT Secret: Configured
📁 Uploads directory: /path/to/backend/uploads
```

## Step 7: Start the Frontend Application

In a new terminal, navigate to your React app root and start it:

```bash
npm start
```

## Step 8: Verify the Connection

1. Open your browser and go to `http://localhost:3000`
2. You should see the Retinal-AI landing page
3. Check the status indicators - you should see "MySQL Backend Connected"
4. Try creating a demo account or logging in

## Database Schema

The backend automatically creates the following tables:

- `users` - User accounts and authentication
- `patients` - Patient records and information
- `retinal_analyses` - AI analysis results and reports
- `medical_reports` - Generated medical reports
- `system_analytics` - Platform analytics and metrics
- `ai_model_performance` - AI model performance tracking
- `file_uploads` - File storage metadata

## API Endpoints

The MySQL backend provides the following API endpoints:

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/profile` - Get user profile

### Patients
- `GET /api/patients` - List patients
- `GET /api/patients/:id` - Get specific patient
- `POST /api/patients` - Create new patient

### Analysis
- `GET /api/analysis` - List analyses
- `GET /api/analysis/:id` - Get specific analysis
- `POST /api/analysis` - Save new analysis
- `GET /api/analysis/patient/:patientId` - Get patient analyses

### File Uploads
- `POST /api/uploads/image` - Upload retinal image
- `GET /api/uploads/files/:filename` - Get uploaded file
- `GET /api/uploads/patient/:patientId` - List patient files

### Analytics
- `GET /api/analytics/overview` - Platform analytics overview
- `GET /api/analytics/doctor/:doctorId` - Doctor-specific analytics
- `GET /api/analytics/ai-performance` - AI model performance metrics

## Troubleshooting

### Connection Issues

1. **"Connection refused" error**:
   - Check if MySQL server is running: `sudo systemctl status mysql`
   - Verify the host and port in your configuration

2. **"Access denied" error**:
   - Verify username and password in `.env` file
   - Check user permissions in MySQL

3. **"Database does not exist" error**:
   - Make sure you created the `retinal_ai` database
   - Check the database name in your configuration

### Backend Issues

1. **Port already in use**:
   ```bash
   lsof -ti:3001
   kill -9 <PID>
   ```

2. **Missing dependencies**:
   ```bash
   cd backend
   npm install
   ```

### Frontend Issues

1. **Cannot connect to backend**:
   - Verify backend is running on port 3001
   - Check CORS settings in backend
   - Verify `REACT_APP_API_URL` in frontend `.env`

## Production Deployment

For production deployment:

1. **Database Security**:
   - Use strong passwords
   - Configure SSL/TLS connections
   - Set up proper firewall rules
   - Regular backups

2. **Backend Security**:
   - Use environment variables for all secrets
   - Enable HTTPS
   - Set up proper CORS policies
   - Implement rate limiting

3. **Environment Variables**:
   ```env
   NODE_ENV=production
   DB_HOST=your-production-db-host
   JWT_SECRET=your-production-jwt-secret
   FRONTEND_URL=https://your-domain.com
   ```

## Features Supported

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (Admin, Doctor, Patient)
- Secure password hashing

✅ **Patient Management**
- Complete patient records
- Medical history tracking
- Doctor-patient relationships

✅ **AI Analysis**
- Retinal image analysis storage
- AI prediction results
- Confidence scoring
- Voice consultation transcripts

✅ **File Management**
- Secure file uploads
- Image storage and retrieval
- Access control for patient files

✅ **Real-time Features**
- WebSocket connections
- Live updates for analysis completion
- Real-time notifications

✅ **Analytics & Reporting**
- Platform-wide analytics
- Doctor performance metrics
- AI model performance tracking
- Patient demographics

✅ **Data Security**
- Encrypted passwords
- Secure JWT tokens
- Role-based data access
- HIPAA-compliant data handling

## Next Steps

After successful setup, you can:

1. **Create demo accounts** using the built-in demo data
2. **Upload retinal images** for AI analysis
3. **Generate medical reports** based on analysis results
4. **Monitor system analytics** through the admin dashboard
5. **Customize AI models** and update performance metrics

For additional support or questions, refer to the main project documentation or contact the development team.