// Retinal-AI MongoDB Backend Server
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const http = require('http');
const WebSocket = require('ws');
const GridFSBucket = require('mongodb').GridFSBucket;
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
async function ensureUploadsDir() {
  const uploadsDir = path.join(__dirname, 'uploads');
  try {
    await fs.access(uploadsDir);
  } catch (error) {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
}

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://enochlebabo:2022@retina.3clhamb.mongodb.net/retinal_ai';

let gfsBucket;

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
  phone: String,
  date_of_birth: Date,
  medical_record_number: String,
  specialty: { 
    type: String, 
    enum: [
      'Ophthalmology',
      'Retina Specialist',
      'Glaucoma Specialist',
      'Cornea Specialist',
      'Pediatric Ophthalmology',
      'Oculoplastics',
      'Neuro-Ophthalmology',
      'General Ophthalmology',
      'Vitreoretinal Surgery',
      'Cataract Surgery'
    ]
  },
  department: {
    type: String,
    enum: [
      'Retinal Diseases',
      'Glaucoma Care',
      'Cataract Surgery',
      'Corneal Disorders',
      'Pediatric Eye Care',
      'Emergency Eye Care',
      'Comprehensive Eye Care',
      'Surgical Services',
      'Low Vision Services',
      'Research & Development'
    ]
  },
  sub_specialty: String,
  license_number: String,
  hospital_affiliation: String,
  years_experience: Number,
  education: String,
  certifications: [String],
  consultation_hours: {
    monday: { start: String, end: String, available: { type: Boolean, default: true } },
    tuesday: { start: String, end: String, available: { type: Boolean, default: true } },
    wednesday: { start: String, end: String, available: { type: Boolean, default: true } },
    thursday: { start: String, end: String, available: { type: Boolean, default: true } },
    friday: { start: String, end: String, available: { type: Boolean, default: true } },
    saturday: { start: String, end: String, available: { type: Boolean, default: false } },
    sunday: { start: String, end: String, available: { type: Boolean, default: false } }
  },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const patientSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  medical_record_number: { type: String, unique: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  phone: String,
  email: String,
  address: String,
  emergency_contact_name: String,
  emergency_contact_phone: String,
  medical_history: String,
  current_medications: String,
  allergies: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const retinalAnalysisSchema = new mongoose.Schema({
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image_path: String,
  analysis_results: mongoose.Schema.Types.Mixed,
  ai_prediction: String,
  confidence_score: Number,
  condition_detected: String,
  severity_level: { type: String, enum: ['mild', 'moderate', 'severe'] },
  recommendations: String,
  additional_notes: String,
  voice_consultation_transcript: String,
  voice_consultation_duration: Number,
  status: { type: String, enum: ['pending', 'completed', 'reviewed'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const medicalReportSchema = new mongoose.Schema({
  analysis_id: { type: mongoose.Schema.Types.ObjectId, ref: 'RetinalAnalysis', required: true },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  report_type: { type: String, enum: ['analysis', 'consultation', 'follow_up'], default: 'analysis' },
  report_content: String,
  diagnosis: String,
  treatment_plan: String,
  follow_up_required: { type: Boolean, default: false },
  follow_up_date: Date,
  report_generated_at: { type: Date, default: Date.now }
});

const systemAnalyticsSchema = new mongoose.Schema({
  metric_name: { type: String, required: true },
  metric_value: Number,
  metric_data: mongoose.Schema.Types.Mixed,
  recorded_date: { type: Date, default: Date.now },
  recorded_at: { type: Date, default: Date.now }
});

const aiModelPerformanceSchema = new mongoose.Schema({
  model_version: String,
  accuracy_rate: Number,
  precision_rate: Number,
  recall_rate: Number,
  f1_score: Number,
  total_predictions: { type: Number, default: 0 },
  correct_predictions: { type: Number, default: 0 },
  evaluation_date: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now }
});

const fileUploadSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
  file_name: { type: String, required: true },
  original_name: { type: String, required: true },
  file_path: { type: String, required: true },
  file_size: Number,
  mime_type: String,
  upload_type: { type: String, enum: ['retinal_image', 'report', 'document'], default: 'retinal_image' },
  created_at: { type: Date, default: Date.now }
});

// Update timestamps middleware
userSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

patientSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

retinalAnalysisSchema.pre('save', function(next) {
  this.updated_at = Date.now();
  next();
});

// Models
const User = mongoose.model('User', userSchema);
const Patient = mongoose.model('Patient', patientSchema);
const RetinalAnalysis = mongoose.model('RetinalAnalysis', retinalAnalysisSchema);
const MedicalReport = mongoose.model('MedicalReport', medicalReportSchema);
const SystemAnalytics = mongoose.model('SystemAnalytics', systemAnalyticsSchema);
const AIModelPerformance = mongoose.model('AIModelPerformance', aiModelPerformanceSchema);
const FileUpload = mongoose.model('FileUpload', fileUploadSchema);

// Database Connection
async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('📦 Connected to MongoDB successfully');
    console.log(`🗄️  Database: ${mongoose.connection.db.databaseName}`);
    
    // Initialize GridFS
    gfsBucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'retinal_images'
    });
    
    console.log('🖼️  GridFS initialized for file storage');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'retinal-ai-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Role-based authorization middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'retinal-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and JPG images are allowed'));
    }
  }
});

// WebSocket Real-time Updates
const activeConnections = new Map();

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection established');
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'authenticate' && data.token) {
        jwt.verify(data.token, process.env.JWT_SECRET || 'retinal-ai-secret-key', (err, user) => {
          if (!err) {
            activeConnections.set(ws, user);
          }
        });
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  });

  ws.on('close', () => {
    activeConnections.delete(ws);
  });
});

// Broadcast function for real-time updates
function broadcastUpdate(eventType, data, userRole = null) {
  activeConnections.forEach((user, ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      if (!userRole || user.role === userRole) {
        ws.send(JSON.stringify({ type: eventType, data }));
      }
    }
  });
}

// API Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: 'connected',
    service: 'Retinal-AI MongoDB Backend' 
  });
});

// Authentication Routes

// User Registration
app.post('/api/auth/signup', async (req, res) => {
  try {
    const {
      email, password, name, role, phone, dateOfBirth,
      medicalRecordNumber, specialty, department, subSpecialty,
      licenseNumber, hospitalAffiliation, yearsExperience, education
    } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new User({
      email,
      password_hash: passwordHash,
      name,
      role: role || 'patient',
      phone,
      date_of_birth: dateOfBirth,
      medical_record_number: medicalRecordNumber,
      specialty,
      department,
      sub_specialty: subSpecialty,
      license_number: licenseNumber,
      hospital_affiliation: hospitalAffiliation,
      years_experience: yearsExperience,
      education
    });

    const savedUser = await newUser.save();

    // If role is patient, create patient record
    if (role === 'patient') {
      const newPatient = new Patient({
        user_id: savedUser._id,
        medical_record_number: medicalRecordNumber,
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' '),
        date_of_birth: dateOfBirth,
        phone,
        email
      });
      await newPatient.save();
    }

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
        role: savedUser.role
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// User Login
app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(401).json({ error: 'Account has been deactivated' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'retinal-ai-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Get User Profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password_hash');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ profile: user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Logout (mainly for logging purposes)
app.post('/api/auth/signout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Patient Management Routes

// Get all patients (for doctors and admins)
app.get('/api/patients', authenticateToken, requireRole(['doctor', 'admin']), async (req, res) => {
  try {
    let query = {};
    
    // If doctor, only show their patients
    if (req.user.role === 'doctor') {
      query.doctor_id = req.user.userId;
    }

    const patients = await Patient.find(query)
      .populate('user_id', 'name email')
      .populate('doctor_id', 'name')
      .sort({ created_at: -1 });

    res.json({ patients });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

// Get specific patient
app.get('/api/patients/:id', authenticateToken, async (req, res) => {
  try {
    const patientId = req.params.id;
    let query = { _id: patientId };

    // Role-based access control
    if (req.user.role === 'doctor') {
      query.doctor_id = req.user.userId;
    } else if (req.user.role === 'patient') {
      query.user_id = req.user.userId;
    }

    const patient = await Patient.findOne(query)
      .populate('user_id', 'name email')
      .populate('doctor_id', 'name');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found or access denied' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
});

// Create new patient
app.post('/api/patients', authenticateToken, requireRole(['doctor', 'admin']), async (req, res) => {
  try {
    const {
      first_name, last_name, date_of_birth, gender, phone, email,
      address, emergency_contact_name, emergency_contact_phone,
      medical_history, current_medications, allergies, medical_record_number
    } = req.body;

    if (!first_name || !last_name || !date_of_birth) {
      return res.status(400).json({ error: 'First name, last name, and date of birth are required' });
    }

    const newPatient = new Patient({
      doctor_id: req.user.userId,
      first_name,
      last_name,
      date_of_birth,
      gender,
      phone,
      email,
      address,
      emergency_contact_name,
      emergency_contact_phone,
      medical_history,
      current_medications,
      allergies,
      medical_record_number
    });

    const savedPatient = await newPatient.save();
    const patient = await Patient.findById(savedPatient._id).populate('doctor_id', 'name');

    // Broadcast real-time update
    broadcastUpdate('patient_created', patient, 'admin');

    res.status(201).json({
      message: 'Patient created successfully',
      patient
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
});

// Doctor specialization routes
app.get('/api/doctors', authenticateToken, async (req, res) => {
  try {
    const { specialty, department, available } = req.query;
    
    let query = { role: 'doctor', is_active: true };
    
    if (specialty) {
      query.specialty = specialty;
    }
    
    if (department) {
      query.department = department;
    }
    
    const doctors = await User.find(query)
      .select('-password_hash')
      .sort({ name: 1 });
    
    // Group doctors by department if requested
    if (req.query.grouped === 'true') {
      const groupedDoctors = doctors.reduce((acc, doctor) => {
        const dept = doctor.department || 'General';
        if (!acc[dept]) {
          acc[dept] = [];
        }
        acc[dept].push(doctor);
        return acc;
      }, {});
      
      return res.json({ groupedDoctors });
    }
    
    res.json({ doctors });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// Get departments and specialties
app.get('/api/doctors/categories', authenticateToken, async (req, res) => {
  try {
    const departments = await User.distinct('department', { role: 'doctor', is_active: true });
    const specialties = await User.distinct('specialty', { role: 'doctor', is_active: true });
    
    res.json({ 
      departments: departments.filter(d => d), 
      specialties: specialties.filter(s => s) 
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Import route modules
const analysisRoutes = require('./routes/analysis');
const uploadRoutes = require('./routes/uploads');
const analyticsRoutes = require('./routes/analytics');
const modelTrainingRoutes = require('./routes/model-training');

// Use routes with MongoDB models
app.use('/api/analysis', analysisRoutes({ 
  User, Patient, RetinalAnalysis, MedicalReport, FileUpload 
}, authenticateToken, requireRole, upload, broadcastUpdate));

app.use('/api/uploads', uploadRoutes({ 
  User, Patient, RetinalAnalysis, MedicalReport, FileUpload, gfsBucket 
}, authenticateToken, requireRole, upload, broadcastUpdate));

app.use('/api/analytics', analyticsRoutes({ 
  User, Patient, RetinalAnalysis, MedicalReport, SystemAnalytics, AIModelPerformance 
}, authenticateToken, requireRole, upload, broadcastUpdate));

app.use('/api/model-training', modelTrainingRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = { 
  app, server, 
  models: { User, Patient, RetinalAnalysis, MedicalReport, SystemAnalytics, AIModelPerformance, FileUpload },
  gfsBucket,
  authenticateToken, requireRole, upload, broadcastUpdate 
};

// Start server
const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    await ensureUploadsDir();
    await connectDatabase();
    
    server.listen(PORT, () => {
      console.log(`🚀 Retinal-AI MongoDB Backend Server running on port ${PORT}`);
      console.log(`📡 WebSocket server ready for real-time updates`);
      console.log(`🗄️  Database: ${mongoose.connection.db.databaseName}`);
      console.log(`🔒 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Using default'}`);
      console.log(`📁 Uploads directory: ${__dirname}/uploads`);
      console.log(`🖼️  GridFS bucket: retinal_images`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();