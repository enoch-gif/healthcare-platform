# Retinal-AI Platform - Comprehensive Technical Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [User Roles & Authentication](#user-roles--authentication)
4. [Core Features & Functionality](#core-features--functionality)
5. [AI & Machine Learning Components](#ai--machine-learning-components)
6. [Database Schema & Data Models](#database-schema--data-models)
7. [API Documentation](#api-documentation)
8. [UI/UX Design System](#uiux-design-system)
9. [Voice Consultation System](#voice-consultation-system)
10. [Demo Mode & Fallback System](#demo-mode--fallback-system)
11. [Security & Compliance](#security--compliance)
12. [Component Library](#component-library)
13. [State Management](#state-management)
14. [Error Handling](#error-handling)
15. [Development Setup](#development-setup)
16. [File Structure](#file-structure)
17. [Integration Guidelines for Flutter](#integration-guidelines-for-flutter)

## System Overview

### Platform Purpose
Retinal-AI is a comprehensive medical-grade platform for AI-powered retinal disease diagnosis. The system analyzes fundus images using advanced deep learning models to detect conditions including:
- **CNV** (Choroidal Neovascularization)
- **DME** (Diabetic Macular Edema)
- **Drusen** (Early AMD indicator)
- **Normal** retinal states

### Key Capabilities
- **98.45% Diagnostic Accuracy** (simulated for demo)
- **Real-time Image Analysis** with instant results
- **Voice-Powered Consultations** with medical explanations
- **Role-Based Access Control** for three user types
- **Medical-Grade UI/UX** with WCAG 2.1 AA compliance
- **Dual-Mode Operation** (Full functionality + Demo mode)
- **Real-time Synchronization** with MySQL backend

## Architecture & Technology Stack

### Frontend Architecture
```
React TypeScript Application
├── State-Based Navigation System
├── Component-Based Architecture
├── Service Layer Pattern
├── Error Boundary Implementation
└── Responsive Design Framework
```

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4 with custom medical theme
- **UI Components**: Custom shadcn/ui component library
- **Icons**: Lucide React
- **State Management**: React Hooks + Context API
- **Routing**: State-based navigation (no React Router)
- **Backend**: Express.js + MySQL
- **Authentication**: JWT-based with role management
- **Voice Technology**: Web Speech API
- **Image Processing**: Canvas API for fundus analysis

### System Architecture Pattern
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Express.js)  │◄──►│   (MySQL)       │
│                 │    │                 │    │                 │
│ - UI Components │    │ - JWT Auth      │    │ - User Data     │
│ - State Mgmt    │    │ - API Routes    │    │ - Analysis Data │
│ - Voice System  │    │ - File Upload   │    │ - Medical Records│
│ - Demo Mode     │    │ - Role Control  │    │ - Analytics     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## User Roles & Authentication

### User Types & Permissions

#### 1. Doctor Role (`role: 'doctor'`)
**Primary Interface**: `/doctor` - FundusAnalysis component
**Capabilities**:
- Upload and analyze fundus images
- Access AI diagnostic results
- Voice consultation with patients
- View detailed medical reports
- Patient management dashboard
- Appointment scheduling
- Email communication center

**Demo Account**: 
- Email: `dr.smith@hospital.com`
- Password: `doctor123`

#### 2. Patient Role (`role: 'patient'`)
**Primary Interface**: `/patient` - PatientDashboard component
**Capabilities**:
- View personal medical history
- Access diagnostic reports
- Chat with assigned doctors
- Health education resources
- Download medical documents
- Appointment booking

**Demo Account**:
- Email: `patient@email.com`  
- Password: `patient123`

#### 3. Admin Role (`role: 'admin'`)
**Primary Interface**: `/admin` - AdminDashboard component
**Capabilities**:
- System-wide analytics dashboard
- AI model management and training
- User management and role assignment
- Platform configuration settings
- Performance monitoring
- Data export and reporting

**Demo Account**:
- Email: `admin@retinal-ai.com`
- Password: `admin123`

### Authentication Flow

#### Login Process
```typescript
interface LoginFlow {
  1. User submits credentials (email/password)
  2. Frontend calls authService.login()
  3. Backend validates against MySQL database
  4. JWT token generated with user role
  5. Frontend stores authentication state
  6. User redirected to role-appropriate dashboard
  7. Subsequent requests include Bearer token
}
```

#### Session Management
- JWT tokens with role-based payload
- Automatic session validation on app initialization
- Graceful logout with state cleanup
- Protection against unauthorized access

#### Role-Based Routing
```typescript
// Route protection logic
const renderContent = () => {
  switch (currentPage) {
    case 'doctor':
      if (!user || user.role !== 'doctor') {
        setCurrentPage('login'); // Redirect to login
        return null;
      }
      return <FundusAnalysis user={user} />;
    
    case 'patient':
      if (!user || user.role !== 'patient') {
        setCurrentPage('login');
        return null;
      }
      return <PatientDashboard user={user} />;
    
    case 'admin':
      if (!user || user.role !== 'admin') {
        setCurrentPage('login');
        return null;
      }
      return <AdminDashboard user={user} />;
  }
};
```

## Core Features & Functionality

### 1. Fundus Image Analysis System

#### Image Upload & Processing
```typescript
interface ImageAnalysisFlow {
  step1: "User drags/selects fundus image (JPEG/PNG)"
  step2: "Frontend validates image format and size"
  step3: "Image displayed with loading overlay"
  step4: "AI analysis initiated (simulated processing time)"
  step5: "Results generated with confidence scores"
  step6: "Voice consultation automatically triggered"
}
```

#### AI Diagnostic Results Format
```typescript
interface DiagnosticResult {
  condition: 'CNV' | 'DME' | 'DRUSEN' | 'NORMAL'
  confidence: number // 0-100 percentage
  severity: 'Low' | 'Medium' | 'High'
  recommendations: string[]
  additionalNotes: string
  analysisDate: string
  processingTime: number // milliseconds
}
```

### 2. Voice Consultation System

#### Voice Features Overview
- **Automatic Activation**: Starts immediately after analysis completion
- **Medical Explanations**: Contextual information about diagnosed conditions
- **Retinal Doctor**: AI voice assistant (renamed from "Dr. AI")
- **Speech Rate**: 1.3x speed for efficiency
- **Duration**: Under 1 minute consultations
- **Control**: Single stop button for user control

#### Voice Content Structure
```typescript
interface VoiceConsultation {
  greeting: "Hello, this is your Retinal Doctor with your analysis results"
  diagnosis: "Based on the fundus image analysis, I have detected..."
  explanation: "This condition means..." // Condition-specific information
  recommendations: "I recommend the following next steps..."
  closing: "Please consult with your healthcare provider for further evaluation"
  totalDuration: "< 60 seconds"
}
```

### 3. Dashboard Systems

#### Doctor Dashboard Features
- **Analysis Center**: Primary fundus analysis interface
- **Patient Management**: List and search patient records
- **Appointment Scheduler**: Calendar-based booking system
- **Email Center**: Communication with patients
- **Medical Reports**: Detailed diagnostic reports
- **AI Assistant**: Intelligent decision support

#### Patient Dashboard Features  
- **Health Overview**: Personal medical summary
- **Report History**: Past diagnostic results
- **Doctor Communication**: Chat interface
- **Appointment Booking**: Schedule consultations
- **Health Education**: Condition information resources
- **Document Downloads**: PDF reports and certificates

#### Admin Dashboard Features
- **Analytics Overview**: System-wide performance metrics
- **AI Model Center**: Machine learning model management
- **User Management**: Role assignment and permissions
- **System Monitoring**: Platform health and usage
- **Data Export**: CSV/PDF report generation

### 4. Real-time Features

#### Backend Connectivity Indicator
```typescript
interface BackendStatus {
  status: 'healthy' | 'demo' | 'error'
  message: string
  lastChecked: Date
  features: {
    realTimeSync: boolean
    voiceConsultations: boolean
    dataBackup: boolean
  }
}
```

#### Demo Mode Capabilities
- **Automatic Fallback**: Seamless transition when backend unavailable
- **Predefined Data**: Sample patients, reports, and analytics
- **Full UI Functionality**: All interface elements remain interactive
- **Clear Indicators**: Status badges showing demo mode active
- **Demo Accounts**: Pre-configured users for testing

## AI & Machine Learning Components

### Model Architecture
```
Fusion Model: DeiT (Data-efficient Image Transformer) + ResNet18
├── DeiT Component
│   ├── Vision Transformer Architecture
│   ├── Self-Attention Mechanisms
│   └── Patch-based Image Processing
└── ResNet18 Component
    ├── Convolutional Neural Network
    ├── Residual Skip Connections
    └── Feature Extraction Layers
```

### Training Data Categories
```typescript
interface TrainingDataset {
  CNV: {
    samples: 15000
    augmentations: ['rotation', 'brightness', 'contrast']
    validationAccuracy: 97.8
  }
  DME: {
    samples: 12000
    augmentations: ['flip', 'zoom', 'noise']
    validationAccuracy: 98.2
  }
  DRUSEN: {
    samples: 18000
    augmentations: ['rotation', 'crop', 'color']
    validationAccuracy: 99.1
  }
  NORMAL: {
    samples: 20000
    augmentations: ['standard_set']
    validationAccuracy: 98.9
  }
}
```

### Performance Metrics (Simulated)
- **Overall Accuracy**: 98.45%
- **Sensitivity**: 97.2% (True Positive Rate)
- **Specificity**: 99.1% (True Negative Rate)
- **Processing Time**: 2-4 seconds per image
- **Confidence Threshold**: 85% minimum for recommendations

## Database Schema & Data Models

### Core Tables Structure

#### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role ENUM('doctor', 'patient', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL
);
```

#### Analysis Results Table
```sql
CREATE TABLE analysis_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  doctor_id INT NULL,
  image_filename VARCHAR(255) NOT NULL,
  condition ENUM('CNV', 'DME', 'DRUSEN', 'NORMAL') NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  severity ENUM('Low', 'Medium', 'High') NULL,
  recommendations TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
);
```

#### Appointments Table
```sql
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATETIME NOT NULL,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES users(id),
  FOREIGN KEY (doctor_id) REFERENCES users(id)
);
```

### Data Models for Frontend

#### User Model
```typescript
interface User {
  id: number
  email: string
  name: string
  role: 'doctor' | 'patient' | 'admin'
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
}
```

#### Analysis Result Model
```typescript
interface AnalysisResult {
  id: number
  userId: number
  doctorId?: number
  imageFilename: string
  condition: 'CNV' | 'DME' | 'DRUSEN' | 'NORMAL'
  confidence: number
  severity?: 'Low' | 'Medium' | 'High'
  recommendations?: string[]
  notes?: string
  createdAt: Date
  patientName?: string
  doctorName?: string
}
```

## API Documentation

### Base Configuration
- **Base URL**: `https://localhost:3001/api`
- **Authentication**: Bearer Token (JWT)
- **Content-Type**: `application/json`
- **CORS**: Enabled for frontend domain

### Authentication Endpoints

#### POST /api/auth/login
```typescript
// Request
{
  email: string
  password: string
}

// Response
{
  success: boolean
  user?: {
    id: number
    email: string
    name: string
    role: string
  }
  token?: string
  error?: string
}
```

#### POST /api/auth/register
```typescript
// Request
{
  name: string
  email: string
  password: string
  role: 'doctor' | 'patient' | 'admin'
}

// Response
{
  success: boolean
  message?: string
  error?: string
}
```

### Analysis Endpoints

#### POST /api/analysis/upload
```typescript
// Request (FormData)
{
  image: File
  userId: number
}

// Response
{
  success: boolean
  result?: AnalysisResult
  error?: string
}
```

#### GET /api/analysis/history/:userId
```typescript
// Response
{
  success: boolean
  results?: AnalysisResult[]
  error?: string
}
```

### User Management Endpoints (Admin Only)

#### GET /api/users
```typescript
// Response
{
  success: boolean
  users?: User[]
  error?: string
}
```

#### PUT /api/users/:id/role
```typescript
// Request
{
  role: 'doctor' | 'patient' | 'admin'
}

// Response
{
  success: boolean
  message?: string
  error?: string
}
```

## UI/UX Design System

### Medical Color Palette
```css
:root {
  /* Primary Colors */
  --medical-blue: #0A3D62;           /* Main brand color */
  --medical-blue-light: #1E5F8B;     /* Interactive elements */
  --medical-blue-lighter: #E3F2FD;   /* Backgrounds */
  
  /* Health & Status Colors */
  --health-green: #27AE60;           /* Success, healthy */
  --health-green-light: #52C882;     /* Hover states */
  --health-green-lighter: #E8F5E8;   /* Success backgrounds */
  
  /* Alert & Warning Colors */
  --accent-red: #E74C3C;             /* Critical conditions */
  --accent-red-light: #EC7063;       /* Warning states */
  --accent-red-lighter: #FADBD8;     /* Alert backgrounds */
  
  /* Neutral Colors */
  --medical-white: #FFFFFF;          /* Pure backgrounds */
  --medical-gray: #F8F9FA;           /* Light backgrounds */
  --medical-gray-dark: #6C757D;      /* Secondary text */
}
```

### Typography System
```css
/* Medical-grade typography hierarchy */
h1: 2rem, font-weight: 600, line-height: 1.2    /* Page titles */
h2: 1.5rem, font-weight: 600, line-height: 1.3  /* Section headers */
h3: 1.25rem, font-weight: 500, line-height: 1.4 /* Subsection headers */
body: 1rem, font-weight: 400, line-height: 1.6   /* Body text */
small: 0.875rem, font-weight: 400, line-height: 1.5 /* Helper text */

/* Medical data display */
.medical-data: 1.125rem, font-weight: 600, tabular-nums
.medical-disclaimer: 0.75rem, line-height: 1.4
```

### Component Design Principles

#### Accessibility (WCAG 2.1 AA)
- **Color Contrast**: Minimum 4.5:1 ratio for normal text
- **Focus Indicators**: 2px solid outline with offset
- **Keyboard Navigation**: Full tab order support
- **Screen Reader**: Semantic HTML with ARIA labels
- **Font Sizes**: Minimum 14px base with scalable rem units

#### Medical-Grade Standards
- **High Contrast**: Enhanced visibility for critical information
- **Clear Hierarchy**: Logical information flow
- **Error Prevention**: Validation and confirmation dialogs
- **Data Integrity**: Consistent formatting and display
- **Professional Aesthetic**: Clean, clinical appearance

### Responsive Breakpoints
```css
/* Mobile First Approach */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

## Voice Consultation System

### Technical Implementation
```typescript
class VoiceService {
  private synthesis: SpeechSynthesis
  private utterance: SpeechSynthesisUtterance | null = null
  
  constructor() {
    this.synthesis = window.speechSynthesis
  }
  
  startConsultation(result: AnalysisResult): void {
    const consultation = this.generateConsultation(result)
    
    this.utterance = new SpeechSynthesisUtterance(consultation)
    this.utterance.rate = 1.3  // 30% faster speech
    this.utterance.volume = 0.8
    this.utterance.pitch = 1.0
    
    this.synthesis.speak(this.utterance)
  }
  
  stopConsultation(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel()
    }
  }
}
```

### Voice Content Templates

#### CNV Consultation
```
"Hello, this is your Retinal Doctor. Based on your fundus image analysis, I have detected Choroidal Neovascularization, or CNV, with 94% confidence. CNV involves abnormal blood vessel growth beneath the retina, which can cause vision distortion and central vision loss if untreated. I recommend immediate consultation with a retinal specialist for potential anti-VEGF injection therapy. Early treatment can help preserve your vision."
```

#### DME Consultation  
```
"Hello, this is your Retinal Doctor. Your analysis shows Diabetic Macular Edema, or DME, with 91% confidence. This condition involves fluid accumulation in the macula, the central part of your retina responsible for sharp vision. DME is a common complication of diabetic retinopathy. I recommend urgent consultation with an ophthalmologist for evaluation and possible laser treatment or injection therapy."
```

#### DRUSEN Consultation
```
"Hello, this is your Retinal Doctor. I've detected Drusen deposits with 89% confidence. Drusen are yellow deposits under the retina and an early sign of age-related macular degeneration. While not immediately sight-threatening, regular monitoring is essential. I recommend annual comprehensive eye exams and maintaining a healthy diet rich in antioxidants."
```

#### NORMAL Consultation
```
"Hello, this is your Retinal Doctor. Excellent news! Your fundus analysis shows a normal, healthy retina with 96% confidence. No signs of diabetic retinopathy, macular degeneration, or other retinal conditions were detected. Continue regular eye checkups and maintain healthy lifestyle habits to preserve your vision."
```

### Voice System Features
- **Automatic Trigger**: Consultation begins immediately after analysis completion
- **Single Control**: Only stop button available during consultation
- **Professional Tone**: Medical terminology with patient-friendly explanations
- **Consistent Duration**: All consultations designed to complete within 60 seconds
- **Cross-Browser Support**: Fallback for browsers without Speech Synthesis API

## Demo Mode & Fallback System

### Demo Mode Architecture
```typescript
interface DemoModeConfig {
  trigger: 'Backend unavailable' | 'Network error' | 'Manual activation'
  indicator: 'Status badge in header'
  dataSource: 'Hardcoded objects and arrays'
  functionality: 'Full UI interaction with simulated responses'
  accounts: {
    doctor: 'dr.smith@hospital.com / doctor123'
    patient: 'patient@email.com / patient123'  
    admin: 'admin@retinal-ai.com / admin123'
  }
}
```

### Fallback Behavior
1. **Health Check Failure**: Automatic demo mode activation
2. **Graceful Degradation**: All features remain accessible with simulated data
3. **User Notification**: Clear status indicators and guidance messages
4. **Seamless Transition**: No page reloads or broken states
5. **Full Functionality**: Complete user experience with demo data

### Demo Data Structure
```typescript
// Sample demo patients for doctor dashboard
const demoPatients = [
  {
    id: 1,
    name: "Sarah Johnson",
    age: 45,
    condition: "DME",
    lastVisit: "2024-01-15",
    risk: "Medium"
  },
  {
    id: 2,
    name: "Robert Chen",
    age: 62,
    condition: "CNV",
    lastVisit: "2024-01-20",
    risk: "High"
  }
  // ... additional demo data
];
```

## Security & Compliance

### Authentication Security
- **Password Hashing**: bcrypt with salt rounds
- **JWT Security**: Signed tokens with expiration
- **Role Validation**: Server-side permission checks
- **Session Management**: Secure token storage and refresh

### Data Protection
- **Input Validation**: Sanitization of all user inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **File Upload Security**: Type and size validation

### Medical Compliance
- **Data Encryption**: In-transit and at-rest encryption
- **Audit Logging**: User action tracking
- **Access Controls**: Role-based permissions
- **Privacy Protection**: Minimal data collection

### WCAG 2.1 AA Compliance
- **Color Contrast**: 4.5:1 minimum ratio
- **Keyboard Navigation**: Full accessibility
- **Screen Reader Support**: Semantic HTML and ARIA
- **Focus Management**: Visible focus indicators

## Component Library

### Core UI Components

#### Button Component
```typescript
interface ButtonProps {
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  disabled?: boolean
  onClick?: () => void
  children: React.ReactNode
}
```

#### Card Component
```typescript
interface CardProps {
  className?: string
  children: React.ReactNode
}

// Sub-components
CardHeader, CardTitle, CardContent, CardFooter
```

#### Alert Component
```typescript
interface AlertProps {
  variant?: 'default' | 'destructive'
  className?: string
  children: React.ReactNode
}
```

### Medical-Specific Components

#### StatusBadge
```typescript
interface StatusBadgeProps {
  status: 'healthy' | 'demo' | 'error' | 'warning'
  icon?: LucideIcon
  text: string
}
```

#### AnalysisResultCard
```typescript
interface AnalysisResultCardProps {
  result: AnalysisResult
  showVoiceButton?: boolean
  onVoiceConsultation?: () => void
}
```

#### VoiceControlPanel
```typescript
interface VoiceControlPanelProps {
  isActive: boolean
  onStop: () => void
  consultation: string
}
```

## State Management

### Application State Structure
```typescript
interface AppState {
  // User Authentication
  user: User | null
  isAuthenticated: boolean
  isAuthInitialized: boolean
  
  // Navigation
  currentPage: string
  navigationHistory: string[]
  
  // Backend Status  
  backendStatus: BackendStatus | null
  showDemoModeInfo: boolean
  
  // Loading States
  isLoading: boolean
  isInitializing: boolean
}
```

### Service Layer Pattern
```typescript
// Auth Service
class AuthService {
  isInitialized: boolean
  currentUser: User | null
  
  async login(email: string, password: string): Promise<AuthResult>
  async register(userData: RegisterData): Promise<AuthResult>
  async logout(): Promise<void>
  onAuthChange(callback: AuthChangeCallback): void
}

// MySQL Service  
class MySQLService {
  isInitialized: boolean
  isConnected: boolean
  
  async checkHealth(): Promise<HealthStatus>
  async query(sql: string, params: any[]): Promise<QueryResult>
}
```

### Data Flow Pattern
```
User Action → Component Handler → Service Layer → Backend API → Database
    ↓              ↓                   ↓              ↓            ↓
State Update ← Component Update ← Service Response ← API Response ← Query Result
```

## Error Handling

### Error Boundary Implementation
```typescript
class ErrorBoundary extends React.Component {
  state: { hasError: boolean; error: Error | null }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application Error:', error, errorInfo)
    // Log to monitoring service in production
  }
}
```

### Service Error Handling
```typescript
// Graceful service degradation
try {
  const result = await mysqlService.query(sql, params)
  return { success: true, data: result }
} catch (error) {
  console.warn('Database query failed, using demo data:', error.message)
  return { success: true, data: getDemoData(), isDemo: true }
}
```

### User-Facing Error Messages
- **Network Errors**: "Connection issue - running in demo mode"
- **Authentication Errors**: "Invalid credentials - please try again"
- **Validation Errors**: Field-specific guidance messages
- **System Errors**: "Technical issue - please refresh and try again"

## Development Setup

### Prerequisites
```bash
Node.js >= 18.0.0
npm >= 9.0.0
MySQL >= 8.0.0
Git
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies  
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migrate

# Start backend server
npm start
```

### Environment Variables
```env
# Backend (.env)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=retinal_ai
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
UPLOAD_PATH=./uploads
PORT=3001
```

### Database Setup
```sql
-- Create database
CREATE DATABASE retinal_ai;

-- Run migration script
npm run migrate

-- Verify tables created
SHOW TABLES;
```

## File Structure

### Frontend Organization
```
components/
├── ui/              # shadcn/ui component library
├── auth/            # Authentication components
├── doctor/          # Doctor-specific components
├── patient/         # Patient-specific components
├── admin/           # Admin-specific components
├── figma/           # Utility components
└── [shared]/        # Common components

services/            # Business logic layer
├── authService.js   # Authentication handling
├── mysqlService.js  # Database communication
├── voiceService.js  # Speech synthesis
└── dataStore.js     # Local data management

styles/
└── globals.css      # Tailwind + custom medical theme
```

### Backend Organization
```
backend/
├── server.js        # Express.js application entry
├── routes/          # API endpoint definitions
│   ├── auth.js      # Authentication routes
│   ├── analysis.js  # Image analysis routes
│   └── users.js     # User management routes
├── middleware/      # Custom middleware
├── config/          # Configuration files
└── uploads/         # File storage directory
```

## Integration Guidelines for Flutter

### API Integration Strategy

#### HTTP Client Configuration
```dart
class ApiClient {
  static const String baseUrl = 'https://your-domain.com/api';
  static const Duration timeout = Duration(seconds: 30);
  
  static final Dio _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: timeout,
    receiveTimeout: timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  ));
  
  // Add JWT token interceptor
  static void setAuthToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }
}
```

#### Authentication Flow
```dart
class AuthService {
  Future<AuthResult> login(String email, String password) async {
    final response = await ApiClient._dio.post('/auth/login', data: {
      'email': email,
      'password': password,
    });
    
    if (response.data['success']) {
      final token = response.data['token'];
      final user = User.fromJson(response.data['user']);
      
      // Store token securely
      await SecureStorage.setToken(token);
      ApiClient.setAuthToken(token);
      
      return AuthResult.success(user);
    } else {
      return AuthResult.failure(response.data['error']);
    }
  }
}
```

### Data Models
```dart
// User model
class User {
  final int id;
  final String email;
  final String name;
  final UserRole role;
  final DateTime? lastLogin;
  
  User({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.lastLogin,
  });
  
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      email: json['email'],
      name: json['name'],
      role: UserRole.fromString(json['role']),
      lastLogin: json['lastLogin'] != null 
        ? DateTime.parse(json['lastLogin']) 
        : null,
    );
  }
}

// Analysis result model
class AnalysisResult {
  final int id;
  final String condition;
  final double confidence;
  final String severity;
  final List<String> recommendations;
  final DateTime createdAt;
  
  // Constructor and JSON serialization methods
}

enum UserRole {
  doctor,
  patient,
  admin;
  
  static UserRole fromString(String role) {
    switch (role) {
      case 'doctor': return UserRole.doctor;
      case 'patient': return UserRole.patient;  
      case 'admin': return UserRole.admin;
      default: throw ArgumentError('Invalid role: $role');
    }
  }
}
```

### State Management (Riverpod/Bloc)
```dart
// Using Riverpod for state management
final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});

class AuthState {
  final User? user;
  final bool isAuthenticated;
  final bool isLoading;
  
  AuthState({
    this.user,
    this.isAuthenticated = false,
    this.isLoading = false,
  });
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState());
  
  Future<void> login(String email, String password) async {
    state = state.copyWith(isLoading: true);
    
    try {
      final result = await AuthService.login(email, password);
      
      if (result.isSuccess) {
        state = AuthState(
          user: result.user,
          isAuthenticated: true,
          isLoading: false,
        );
      } else {
        state = AuthState(isLoading: false);
        // Handle error
      }
    } catch (e) {
      state = AuthState(isLoading: false);
      // Handle exception
    }
  }
}
```

### Image Analysis Implementation
```dart
class ImageAnalysisService {
  Future<AnalysisResult> analyzeImage(File imageFile) async {
    final formData = FormData.fromMap({
      'image': await MultipartFile.fromFile(
        imageFile.path,
        filename: 'fundus_image.jpg',
      ),
    });
    
    final response = await ApiClient._dio.post(
      '/analysis/upload',
      data: formData,
    );
    
    if (response.data['success']) {
      return AnalysisResult.fromJson(response.data['result']);
    } else {
      throw AnalysisException(response.data['error']);
    }
  }
}
```

### UI Implementation Strategy

#### Medical Color Scheme
```dart
class MedicalColors {
  static const Color primaryBlue = Color(0xFF0A3D62);
  static const Color primaryBlueLight = Color(0xFF1E5F8B);
  static const Color primaryBlueLighter = Color(0xFFE3F2FD);
  
  static const Color healthGreen = Color(0xFF27AE60);
  static const Color healthGreenLight = Color(0xFF52C882);
  static const Color healthGreenLighter = Color(0xFFE8F5E8);
  
  static const Color accentRed = Color(0xFFE74C3C);
  static const Color accentRedLight = Color(0xFFEC7063);
  static const Color accentRedLighter = Color(0xFFFADBD8);
}
```

#### Component Architecture
```dart
// Reusable medical card component
class MedicalCard extends StatelessWidget {
  final String title;
  final Widget content;
  final VoidCallback? onTap;
  
  const MedicalCard({
    Key? key,
    required this.title,
    required this.content,
    this.onTap,
  }) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(8),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  color: MedicalColors.primaryBlue,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 12),
              content,
            ],
          ),
        ),
      ),
    );
  }
}
```

### Voice Integration (Flutter TTS)
```dart
class VoiceService {
  static final FlutterTts _tts = FlutterTts();
  
  static Future<void> initializeTts() async {
    await _tts.setSpeechRate(1.3); // Match web version speed
    await _tts.setVolume(0.8);
    await _tts.setPitch(1.0);
  }
  
  static Future<void> startConsultation(AnalysisResult result) async {
    final consultation = generateConsultation(result);
    await _tts.speak(consultation);
  }
  
  static Future<void> stopConsultation() async {
    await _tts.stop();
  }
  
  static String generateConsultation(AnalysisResult result) {
    // Same consultation templates as web version
    switch (result.condition) {
      case 'CNV':
        return "Hello, this is your Retinal Doctor..."; // CNV consultation
      case 'DME':
        return "Hello, this is your Retinal Doctor..."; // DME consultation
      // ... other cases
      default:
        return "Analysis complete. Please consult your healthcare provider.";
    }
  }
}
```

### Navigation Structure
```dart
// App routing configuration
class AppRouter {
  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => LandingPage());
      case '/login':
        return MaterialPageRoute(builder: (_) => LoginPage());
      case '/doctor-dashboard':
        return MaterialPageRoute(builder: (_) => DoctorDashboard());
      case '/patient-dashboard':
        return MaterialPageRoute(builder: (_) => PatientDashboard());
      case '/admin-dashboard':
        return MaterialPageRoute(builder: (_) => AdminDashboard());
      default:
        return MaterialPageRoute(builder: (_) => NotFoundPage());
    }
  }
}

// Route guards for role-based access
class RouteGuard {
  static bool canAccess(String route, UserRole userRole) {
    switch (route) {
      case '/doctor-dashboard':
        return userRole == UserRole.doctor;
      case '/patient-dashboard':
        return userRole == UserRole.patient;
      case '/admin-dashboard':
        return userRole == UserRole.admin;
      default:
        return true; // Public routes
    }
  }
}
```

### Error Handling & Demo Mode
```dart
class ErrorHandler {
  static void handleApiError(DioError error) {
    if (error.type == DioErrorType.connectTimeout ||
        error.type == DioErrorType.receiveTimeout) {
      // Enable demo mode
      DemoModeService.enable();
    }
  }
}

class DemoModeService {
  static bool _isDemoMode = false;
  static bool get isDemoMode => _isDemoMode;
  
  static void enable() {
    _isDemoMode = true;
    // Notify listeners of demo mode activation
  }
  
  static List<User> getDemoPatients() {
    return [
      User(id: 1, name: "Sarah Johnson", email: "sarah@demo.com", role: UserRole.patient),
      User(id: 2, name: "Robert Chen", email: "robert@demo.com", role: UserRole.patient),
      // ... more demo data
    ];
  }
}
```

### Testing Strategy
```dart
// Unit tests for services
void main() {
  group('AuthService', () {
    test('login success returns user data', () async {
      final result = await AuthService.login('test@email.com', 'password');
      expect(result.isSuccess, true);
      expect(result.user?.email, 'test@email.com');
    });
    
    test('login failure returns error', () async {
      final result = await AuthService.login('invalid@email.com', 'wrong');
      expect(result.isSuccess, false);
      expect(result.error, isNotNull);
    });
  });
}

// Widget tests for UI components
void main() {
  testWidgets('MedicalCard displays title and content', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: MedicalCard(
          title: 'Test Title',
          content: Text('Test Content'),
        ),
      ),
    );
    
    expect(find.text('Test Title'), findsOneWidget);
    expect(find.text('Test Content'), findsOneWidget);
  });
}
```

### Performance Optimization
```dart
// Image optimization for analysis
class ImageOptimizer {
  static Future<File> optimizeForAnalysis(File originalImage) async {
    final bytes = await originalImage.readAsBytes();
    final image = img.decodeImage(bytes);
    
    if (image == null) throw Exception('Invalid image');
    
    // Resize to optimal dimensions for AI analysis
    final resized = img.copyResize(image, width: 512, height: 512);
    
    // Compress for upload
    final compressed = img.encodeJpg(resized, quality: 90);
    
    // Save optimized image
    final optimizedFile = File('${originalImage.path}_optimized.jpg');
    await optimizedFile.writeAsBytes(compressed);
    
    return optimizedFile;
  }
}
```

This comprehensive documentation provides Flutter developers with all the necessary information to recreate the Retinal-AI platform, including architectural patterns, API specifications, UI/UX guidelines, and specific implementation details for maintaining feature parity between the React web application and the Flutter mobile application.