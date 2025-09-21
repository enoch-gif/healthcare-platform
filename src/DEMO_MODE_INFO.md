# Retinal-AI Demo Mode

## Current Status: Demo Mode Active

Your Retinal-AI application is running in **Demo Mode** because the MySQL backend server is not available. This is perfectly normal and allows you to explore all the features of the platform!

## Demo Mode Features

✅ **Full UI Experience** - All interfaces and components are fully functional  
✅ **Demo Authentication** - Use the built-in demo accounts  
✅ **Simulated Data** - Pre-populated with realistic medical data  
✅ **AI Analysis Demo** - Simulated retinal analysis results  
✅ **Voice Consultation** - Full voice interaction capabilities  

## Demo Accounts

### 🩺 Doctor Account
- **Email:** `dr.smith@hospital.com`
- **Password:** `doctor123`
- **Features:** Full diagnostic interface, patient management, AI analysis

### 👥 Patient Account  
- **Email:** `patient@email.com`
- **Password:** `patient123`
- **Features:** Patient dashboard, appointment booking, medical reports

### ⚙️ Admin Account
- **Email:** `admin@retinal-ai.com`  
- **Password:** `admin123`
- **Features:** System administration, user management, analytics

## Want Full Backend Functionality?

To enable real data persistence and the complete MySQL backend:

### Option 1: Quick Start (Recommended)
```bash
# On Windows
start-mysql-backend.bat

# On macOS/Linux  
./start-mysql-backend.sh
```

### Option 2: Manual Setup
1. Navigate to the `backend` folder
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` to `.env`)
4. Run the server: `npm start`

### Option 3: Full Setup Guide
See `MYSQL_SETUP_GUIDE.md` for complete installation instructions.

## No Backend Needed?

Demo mode provides a complete experience! You can:
- Test all user interfaces
- Experience the AI-powered analysis workflow  
- Explore voice consultation features
- Review the medical-grade design system
- Understand the complete user journey

## Switching Modes

The application automatically detects backend availability:
- **Green Badge:** Backend connected (full functionality)
- **Blue Badge:** Demo mode active (simulated data)
- **Red Badge:** Backend connection issues

---

**Note:** Demo mode data is not persistent and resets when you refresh the page. This is intentional for demonstration purposes.