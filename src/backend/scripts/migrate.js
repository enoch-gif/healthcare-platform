// Database Migration Script for Retinal-AI MySQL Backend
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'retinal_ai',
  multipleStatements: true
};

async function createDatabase() {
  console.log('📋 Starting database migration...');
  
  try {
    // Create connection without database first
    const tempConfig = { ...dbConfig };
    delete tempConfig.database;
    
    const connection = await mysql.createConnection(tempConfig);
    
    // Create database if it doesn't exist
    console.log(`🗄️  Creating database: ${dbConfig.database}`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.execute(`USE ${dbConfig.database}`);
    
    console.log('✅ Database created successfully');
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error creating database:', error);
    process.exit(1);
  }
}

async function createTables() {
  console.log('📊 Creating database tables...');
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Users table
    console.log('  👤 Creating users table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('patient', 'doctor', 'admin') DEFAULT 'patient',
        phone VARCHAR(20),
        date_of_birth DATE,
        medical_record_number VARCHAR(50),
        specialty VARCHAR(100),
        license_number VARCHAR(50),
        hospital_affiliation VARCHAR(255),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role),
        INDEX idx_active (is_active)
      ) ENGINE=InnoDB
    `);

    // Patients table
    console.log('  🏥 Creating patients table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        doctor_id INT,
        medical_record_number VARCHAR(50) UNIQUE,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        date_of_birth DATE NOT NULL,
        gender ENUM('male', 'female', 'other'),
        phone VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        emergency_contact_name VARCHAR(255),
        emergency_contact_phone VARCHAR(20),
        medical_history TEXT,
        current_medications TEXT,
        allergies TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_doctor (doctor_id),
        INDEX idx_user (user_id),
        INDEX idx_mrn (medical_record_number)
      ) ENGINE=InnoDB
    `);

    // Retinal analyses table
    console.log('  🔬 Creating retinal_analyses table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS retinal_analyses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        image_path VARCHAR(500),
        analysis_results JSON,
        ai_prediction VARCHAR(100),
        confidence_score DECIMAL(5,4),
        condition_detected VARCHAR(100),
        severity_level ENUM('mild', 'moderate', 'severe'),
        recommendations TEXT,
        additional_notes TEXT,
        voice_consultation_transcript TEXT,
        voice_consultation_duration INT,
        status ENUM('pending', 'completed', 'reviewed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_patient (patient_id),
        INDEX idx_doctor (doctor_id),
        INDEX idx_condition (condition_detected),
        INDEX idx_status (status),
        INDEX idx_created (created_at)
      ) ENGINE=InnoDB
    `);

    // Medical reports table
    console.log('  📋 Creating medical_reports table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS medical_reports (
        id INT PRIMARY KEY AUTO_INCREMENT,
        analysis_id INT NOT NULL,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        report_type ENUM('analysis', 'consultation', 'follow_up') DEFAULT 'analysis',
        report_content TEXT,
        diagnosis TEXT,
        treatment_plan TEXT,
        follow_up_required BOOLEAN DEFAULT FALSE,
        follow_up_date DATE,
        report_generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (analysis_id) REFERENCES retinal_analyses(id) ON DELETE CASCADE,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_analysis (analysis_id),
        INDEX idx_patient (patient_id),
        INDEX idx_doctor (doctor_id)
      ) ENGINE=InnoDB
    `);

    // System analytics table
    console.log('  📈 Creating system_analytics table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS system_analytics (
        id INT PRIMARY KEY AUTO_INCREMENT,
        metric_name VARCHAR(100) NOT NULL,
        metric_value DECIMAL(10,2),
        metric_data JSON,
        recorded_date DATE DEFAULT (CURRENT_DATE),
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_metric (metric_name),
        INDEX idx_date (recorded_date)
      ) ENGINE=InnoDB
    `);

    // AI model performance table
    console.log('  🤖 Creating ai_model_performance table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ai_model_performance (
        id INT PRIMARY KEY AUTO_INCREMENT,
        model_version VARCHAR(50),
        accuracy_rate DECIMAL(5,4),
        precision_rate DECIMAL(5,4),
        recall_rate DECIMAL(5,4),
        f1_score DECIMAL(5,4),
        total_predictions INT DEFAULT 0,
        correct_predictions INT DEFAULT 0,
        evaluation_date DATE DEFAULT (CURRENT_DATE),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_model_date (model_version, evaluation_date),
        INDEX idx_version (model_version),
        INDEX idx_date (evaluation_date)
      ) ENGINE=InnoDB
    `);

    // File uploads table
    console.log('  📁 Creating file_uploads table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS file_uploads (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        patient_id INT,
        file_name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INT,
        mime_type VARCHAR(100),
        upload_type ENUM('retinal_image', 'report', 'document') DEFAULT 'retinal_image',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_patient (patient_id),
        INDEX idx_type (upload_type)
      ) ENGINE=InnoDB
    `);

    console.log('✅ All tables created successfully');
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

async function insertDemoData() {
  console.log('🎭 Inserting demo data...');
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Create admin user
    console.log('  👨‍💼 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 12);
    await connection.execute(`
      INSERT INTO users (email, password_hash, name, role, phone, specialty) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
    `, ['admin@retinal-ai.com', adminPassword, 'System Administrator', 'admin', '+1-555-0001', 'System Administration']);

    // Create doctor user
    console.log('  👨‍⚕️ Creating doctor user...');
    const doctorPassword = await bcrypt.hash('doctor123', 12);
    await connection.execute(`
      INSERT INTO users (email, password_hash, name, role, phone, specialty, license_number, hospital_affiliation) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
    `, ['dr.smith@hospital.com', doctorPassword, 'Dr. John Smith', 'doctor', '+1-555-0002', 'Ophthalmology', 'MD123456', 'City General Hospital']);

    // Create patient user
    console.log('  🧑‍🦱 Creating patient user...');
    const patientPassword = await bcrypt.hash('patient123', 12);
    await connection.execute(`
      INSERT INTO users (email, password_hash, name, role, phone, date_of_birth) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
    `, ['patient@email.com', patientPassword, 'Sarah Johnson', 'patient', '+1-555-0003', '1980-05-15']);

    // Get user IDs
    const [adminUser] = await connection.execute('SELECT id FROM users WHERE email = ?', ['admin@retinal-ai.com']);
    const [doctorUser] = await connection.execute('SELECT id FROM users WHERE email = ?', ['dr.smith@hospital.com']);
    const [patientUser] = await connection.execute('SELECT id FROM users WHERE email = ?', ['patient@email.com']);

    const doctorId = doctorUser[0].id;
    const patientUserId = patientUser[0].id;

    // Create patient record
    console.log('  🏥 Creating patient record...');
    await connection.execute(`
      INSERT INTO patients (
        user_id, doctor_id, medical_record_number, first_name, last_name,
        date_of_birth, gender, phone, email, address,
        emergency_contact_name, emergency_contact_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
    `, [
      patientUserId, doctorId, 'MRN001', 'Sarah', 'Johnson',
      '1980-05-15', 'female', '+1-555-0003', 'patient@email.com', '123 Main St, City, State 12345',
      'John Johnson', '+1-555-0004'
    ]);

    // Insert AI model performance data
    console.log('  🤖 Creating AI model performance data...');
    await connection.execute(`
      INSERT INTO ai_model_performance (
        model_version, accuracy_rate, precision_rate, recall_rate, f1_score,
        total_predictions, correct_predictions, evaluation_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_DATE)
      ON DUPLICATE KEY UPDATE 
        accuracy_rate = VALUES(accuracy_rate),
        total_predictions = VALUES(total_predictions),
        correct_predictions = VALUES(correct_predictions)
    `, ['DeiT+ResNet18-v1.0', 0.9845, 0.9823, 0.9867, 0.9845, 10000, 9845]);

    // Insert system analytics sample data
    console.log('  📊 Creating system analytics data...');
    await connection.execute(`
      INSERT INTO system_analytics (metric_name, metric_value, recorded_date) 
      VALUES 
        ('total_users', 3, CURRENT_DATE),
        ('total_patients', 1, CURRENT_DATE),
        ('total_analyses', 0, CURRENT_DATE),
        ('ai_accuracy', 98.45, CURRENT_DATE)
      ON DUPLICATE KEY UPDATE metric_value = VALUES(metric_value)
    `);

    console.log('✅ Demo data inserted successfully');
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error inserting demo data:', error);
    process.exit(1);
  }
}

async function verifySetup() {
  console.log('🔍 Verifying database setup...');
  
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Check tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log(`  📋 Found ${tables.length} tables`);
    
    // Check users
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`  👥 Found ${users[0].count} users`);
    
    // Check patients
    const [patients] = await connection.execute('SELECT COUNT(*) as count FROM patients');
    console.log(`  🏥 Found ${patients[0].count} patients`);
    
    // Check AI model data
    const [models] = await connection.execute('SELECT COUNT(*) as count FROM ai_model_performance');
    console.log(`  🤖 Found ${models[0].count} AI model records`);
    
    console.log('✅ Database verification completed successfully');
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error verifying setup:', error);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Retinal-AI MySQL Database Migration');
  console.log('=====================================');
  
  try {
    await createDatabase();
    await createTables();
    await insertDemoData();
    await verifySetup();
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\nDemo Accounts Created:');
    console.log('📧 Admin: admin@retinal-ai.com (password: admin123)');
    console.log('👨‍⚕️ Doctor: dr.smith@hospital.com (password: doctor123)');
    console.log('🧑‍🦱 Patient: patient@email.com (password: patient123)');
    console.log('\n🚀 You can now start the backend server with: npm start');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if called directly
if (require.main === module) {
  main();
}

module.exports = { createDatabase, createTables, insertDemoData, verifySetup };