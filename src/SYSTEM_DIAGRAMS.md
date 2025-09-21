# Retinal-AI System Architecture Diagrams

This document contains comprehensive architectural diagrams for the Retinal-AI platform, including data flow, flowcharts, entity relationships, UML diagrams, and system architecture visualizations.

---

## 1. System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React TypeScript App]
        B[Tailwind CSS v4]
        C[ShadCN Components]
        D[Voice Service]
    end
    
    subgraph "Authentication"
        E[JWT Auth Service]
        F[Role-Based Access Control]
    end
    
    subgraph "Backend Layer"
        G[Express.js API Server]
        H[MySQL Database]
        I[File Upload Service]
    end
    
    subgraph "AI/ML Layer"
        J[TensorFlow/Keras Model]
        K[DeiT + ResNet18 Fusion]
        L[Fundus Analysis Engine]
        M[Voice Consultation AI]
    end
    
    subgraph "External Services"
        N[Email Service]
        O[File Storage]
    end
    
    A --> E
    E --> F
    F --> G
    G --> H
    A --> D
    G --> J
    J --> K
    K --> L
    L --> M
    G --> N
    G --> O
```

---

## 2. Data Flow Diagram

```mermaid
flowchart TD
    subgraph "User Input"
        A[Doctor Login] 
        B[Upload Fundus Image]
        C[Patient Data Input]
    end
    
    subgraph "Authentication Flow"
        D[JWT Token Generation]
        E[Role Verification]
        F[Session Management]
    end
    
    subgraph "Image Processing Pipeline"
        G[Image Validation]
        H[Preprocessing]
        I[AI Model Analysis]
        J[DeiT Feature Extraction]
        K[ResNet18 Classification]
        L[Fusion Algorithm]
        M[Confidence Scoring]
    end
    
    subgraph "Diagnosis Engine"
        N[CNV Detection]
        O[DME Detection] 
        P[Drusen Detection]
        Q[Normal Classification]
        R[Risk Assessment]
    end
    
    subgraph "Result Processing"
        S[Voice Synthesis]
        T[Report Generation]
        U[Database Storage]
        V[Notification System]
    end
    
    subgraph "User Interface"
        W[Dashboard Display]
        X[Voice Consultation]
        Y[Report Download]
        Z[Patient Communication]
    end
    
    A --> D
    D --> E
    E --> F
    B --> G
    G --> H
    H --> I
    I --> J
    I --> K
    J --> L
    K --> L
    L --> M
    M --> N
    M --> O
    M --> P
    M --> Q
    N --> R
    O --> R
    P --> R
    Q --> R
    R --> S
    R --> T
    R --> U
    S --> X
    T --> Y
    U --> V
    F --> W
    X --> Z
```

---

## 3. Entity Relationship (ER) Diagram

```mermaid
erDiagram
    USERS {
        int id PK
        string email UK
        string password_hash
        string name
        enum role
        datetime created_at
        datetime updated_at
        boolean is_active
        text profile_data
    }
    
    PATIENTS {
        int id PK
        int user_id FK
        string patient_id UK
        date date_of_birth
        enum gender
        text medical_history
        text current_medications
        text allergies
        text emergency_contact
        datetime created_at
        datetime updated_at
    }
    
    DOCTORS {
        int id PK
        int user_id FK
        string license_number UK
        string specialization
        text credentials
        text hospital_affiliation
        datetime created_at
        datetime updated_at
    }
    
    ANALYSES {
        int id PK
        int doctor_id FK
        int patient_id FK
        string analysis_id UK
        string image_path
        text image_metadata
        json ai_results
        text diagnosis
        float confidence_score
        enum status
        datetime analysis_date
        datetime created_at
        datetime updated_at
    }
    
    DIAGNOSIS_RESULTS {
        int id PK
        int analysis_id FK
        enum condition_type
        float probability
        text description
        json model_output
        text recommendations
        datetime created_at
    }
    
    VOICE_CONSULTATIONS {
        int id PK
        int analysis_id FK
        text consultation_text
        string audio_path
        float duration
        json voice_metadata
        datetime consultation_date
        datetime created_at
    }
    
    REPORTS {
        int id PK
        int analysis_id FK
        string report_type
        text content
        string file_path
        json metadata
        datetime generated_at
        datetime created_at
    }
    
    APPOINTMENTS {
        int id PK
        int doctor_id FK
        int patient_id FK
        datetime appointment_date
        text purpose
        enum status
        text notes
        datetime created_at
        datetime updated_at
    }
    
    MEDICAL_RECORDS {
        int id PK
        int patient_id FK
        int analysis_id FK
        text record_type
        json record_data
        datetime record_date
        datetime created_at
        datetime updated_at
    }
    
    AUDIT_LOGS {
        int id PK
        int user_id FK
        string action
        string resource
        json old_values
        json new_values
        string ip_address
        string user_agent
        datetime created_at
    }
    
    USERS ||--o{ PATIENTS : "has profile"
    USERS ||--o{ DOCTORS : "has profile" 
    USERS ||--o{ AUDIT_LOGS : "generates"
    DOCTORS ||--o{ ANALYSES : "performs"
    PATIENTS ||--o{ ANALYSES : "receives"
    DOCTORS ||--o{ APPOINTMENTS : "schedules"
    PATIENTS ||--o{ APPOINTMENTS : "books"
    ANALYSES ||--o{ DIAGNOSIS_RESULTS : "produces"
    ANALYSES ||--o{ VOICE_CONSULTATIONS : "includes"
    ANALYSES ||--o{ REPORTS : "generates"
    PATIENTS ||--o{ MEDICAL_RECORDS : "owns"
    ANALYSES ||--o{ MEDICAL_RECORDS : "creates"
```

---

## 4. Application Flowchart

```mermaid
flowchart TD
    A[User Access Application] --> B{User Authenticated?}
    B -->|No| C[Login/Signup Page]
    B -->|Yes| D{Check User Role}
    
    C --> E[Enter Credentials]
    E --> F{Validate Credentials}
    F -->|Invalid| G[Show Error Message]
    F -->|Valid| H[Generate JWT Token]
    G --> C
    H --> D
    
    D -->|Doctor| I[Doctor Dashboard]
    D -->|Patient| J[Patient Dashboard]
    D -->|Admin| K[Admin Dashboard]
    
    subgraph "Doctor Workflow"
        I --> L[Fundus Analysis Center]
        L --> M[Upload Fundus Image]
        M --> N{Image Valid?}
        N -->|No| O[Show Validation Error]
        N -->|Yes| P[Process with AI Model]
        O --> M
        P --> Q[DeiT + ResNet18 Analysis]
        Q --> R[Generate Diagnosis]
        R --> S{Confidence > 85%?}
        S -->|Yes| T[High Confidence Result]
        S -->|No| U[Low Confidence Warning]
        T --> V[Start Voice Consultation]
        U --> V
        V --> W[Generate Medical Report]
        W --> X[Store Results in Database]
        X --> Y[Send Notification]
    end
    
    subgraph "Patient Workflow"
        J --> Z[View Analysis Results]
        J --> AA[Download Reports]
        J --> BB[Chat with Doctor]
        J --> CC[Health Education]
        Z --> DD[Listen to Voice Consultation]
        AA --> EE[PDF Report Generation]
        BB --> FF[Real-time Messaging]
    end
    
    subgraph "Admin Workflow"
        K --> GG[User Management]
        K --> HH[AI Model Analytics]
        K --> II[System Analytics]
        K --> JJ[Model Training Center]
        HH --> KK[View Model Performance]
        II --> LL[Usage Statistics]
        JJ --> MM[Train New Models]
        GG --> NN[Manage Users/Roles]
    end
```

---

## 5. UML Class Diagram

```mermaid
classDiagram
    class User {
        +int id
        +string email
        +string passwordHash
        +string name
        +UserRole role
        +DateTime createdAt
        +boolean isActive
        +login(email, password)
        +logout()
        +updateProfile(data)
        +validateRole()
    }
    
    class Doctor {
        +int userId
        +string licenseNumber
        +string specialization
        +string credentials
        +performAnalysis(image)
        +generateReport(analysis)
        +reviewDiagnosis(analysisId)
        +scheduleAppointment(patientId)
    }
    
    class Patient {
        +int userId
        +string patientId
        +Date dateOfBirth
        +Gender gender
        +string medicalHistory
        +viewAnalysisResults()
        +downloadReports()
        +bookAppointment(doctorId)
        +updateMedicalHistory()
    }
    
    class Admin {
        +int userId
        +string permissions
        +manageUsers()
        +viewAnalytics()
        +configureSystem()
        +trainAIModel()
    }
    
    class Analysis {
        +int id
        +string analysisId
        +string imagePath
        +JSON aiResults
        +string diagnosis
        +float confidenceScore
        +AnalysisStatus status
        +DateTime analysisDate
        +processImage()
        +runAIModel()
        +generateDiagnosis()
        +calculateConfidence()
    }
    
    class AIModel {
        +string modelName
        +string version
        +float accuracy
        +JSON architecture
        +predict(image)
        +preprocess(image)
        +extractFeatures()
        +classify()
    }
    
    class DeiTModel {
        +string transformerConfig
        +int patchSize
        +int attentionHeads
        +extractVisionTransformerFeatures()
        +applyAttention()
    }
    
    class ResNet18Model {
        +int layers
        +string architecture
        +extractCNNFeatures()
        +applyConvolution()
    }
    
    class FusionEngine {
        +JSON fusionConfig
        +combineFeatures(deitFeatures, resnetFeatures)
        +weightFeatures()
        +makeFinalPrediction()
    }
    
    class VoiceConsultation {
        +int analysisId
        +string consultationText
        +string audioPath
        +float duration
        +generateConsultation(analysis)
        +synthesizeSpeech()
        +playAudio()
    }
    
    class Report {
        +int analysisId
        +string reportType
        +string content
        +string filePath
        +generatePDFReport()
        +includeVoiceConsultation()
        +addDiagnosticImages()
    }
    
    class DatabaseService {
        +Connection connection
        +saveAnalysis(analysis)
        +getUserData(userId)
        +updatePatientRecord(patientId)
        +getAnalysisHistory(patientId)
    }
    
    class AuthService {
        +string jwtSecret
        +generateToken(user)
        +validateToken(token)
        +checkPermissions(user, resource)
        +refreshToken(token)
    }
    
    User <|-- Doctor
    User <|-- Patient
    User <|-- Admin
    Doctor "1" --> "*" Analysis
    Patient "1" --> "*" Analysis
    Analysis "1" --> "1" VoiceConsultation
    Analysis "1" --> "*" Report
    AIModel <|-- DeiTModel
    AIModel <|-- ResNet18Model
    Analysis --> FusionEngine
    FusionEngine --> DeiTModel
    FusionEngine --> ResNet18Model
    Analysis --> DatabaseService
    User --> AuthService
```

---

## 6. UML Sequence Diagram - Fundus Analysis Process

```mermaid
sequenceDiagram
    participant D as Doctor
    participant UI as Frontend
    participant Auth as Auth Service
    participant API as Express API
    participant AI as AI Engine
    participant DB as MySQL Database
    participant Voice as Voice Service
    
    D->>UI: Upload fundus image
    UI->>Auth: Validate doctor token
    Auth-->>UI: Token valid
    UI->>API: POST /api/analysis/upload
    API->>API: Validate image format
    API->>AI: Process image
    
    Note over AI: DeiT + ResNet18 Fusion Processing
    AI->>AI: Preprocess image
    AI->>AI: Extract DeiT features
    AI->>AI: Extract ResNet18 features
    AI->>AI: Fuse features
    AI->>AI: Classify condition
    AI->>AI: Calculate confidence
    
    AI-->>API: Return analysis results
    API->>DB: Save analysis results
    DB-->>API: Analysis saved
    
    alt Confidence > 85%
        API->>Voice: Generate high-confidence consultation
    else Confidence <= 85%
        API->>Voice: Generate cautionary consultation
    end
    
    Voice->>Voice: Create consultation text
    Voice->>Voice: Synthesize speech
    Voice-->>API: Return voice consultation
    
    API->>DB: Save voice consultation
    API-->>UI: Return complete analysis
    UI->>UI: Display results
    UI->>Voice: Auto-play consultation
    Voice->>D: Play voice diagnosis
    
    D->>UI: Request PDF report
    UI->>API: GET /api/reports/generate
    API->>API: Generate PDF report
    API-->>UI: Return report URL
    UI->>D: Display/Download report
```

---

## 7. Component Architecture Diagram

```mermaid
graph TB
    subgraph "App.tsx - Main Application"
        A[App Component]
        B[Router Configuration]
        C[Authentication State]
        D[Global State Management]
    end
    
    subgraph "Authentication Components"
        E[LoginPage]
        F[SignupPage]
        G[ProtectedRoute]
        H[AuthService]
    end
    
    subgraph "Doctor Components"
        I[DoctorDashboard]
        J[FundusAnalysis]
        K[AnalysisCenter]
        L[AIAssistant]
        M[VoiceControlPanel]
        N[MedicalReports]
        O[PatientChat]
        P[AppointmentManagement]
        Q[DiagnosticResults]
        R[EmailCenter]
    end
    
    subgraph "Patient Components"
        S[PatientDashboard]
        T[UserReports]
        U[ChatWithDoctor]
        V[HealthEducation]
        W[DownloadCenter]
    end
    
    subgraph "Admin Components"
        X[AdminDashboard]
        Y[AIModelCenter]
        Z[AnalyticsDashboard]
        AA[AIModelAnalytics]
        BB[ModelArchitecture]
        CC[TrainingControls]
        DD[TrainingProgress]
    end
    
    subgraph "Shared UI Components"
        EE[Card Components]
        FF[Button Components]
        GG[Form Components]
        HH[Chart Components]
        II[Navigation Components]
        JJ[Alert Components]
    end
    
    subgraph "Services Layer"
        KK[AuthService]
        LL[MySQLService]
        MM[VoiceService]
        NN[DataStore]
    end
    
    A --> B
    A --> C
    A --> D
    B --> E
    B --> F
    B --> G
    C --> H
    
    G --> I
    I --> J
    I --> K
    I --> L
    I --> M
    I --> N
    I --> O
    I --> P
    I --> Q
    I --> R
    
    G --> S
    S --> T
    S --> U
    S --> V
    S --> W
    
    G --> X
    X --> Y
    X --> Z
    X --> AA
    Y --> BB
    Y --> CC
    Y --> DD
    
    A --> EE
    A --> FF
    A --> GG
    A --> HH
    A --> II
    A --> JJ
    
    A --> KK
    A --> LL
    A --> MM
    A --> NN
```

---

## 8. Database Schema Relationships

```mermaid
erDiagram
    USERS ||--|| DOCTORS : extends
    USERS ||--|| PATIENTS : extends
    USERS ||--|| ADMINS : extends
    DOCTORS ||--o{ ANALYSES : performs
    PATIENTS ||--o{ ANALYSES : receives
    ANALYSES ||--|| DIAGNOSIS_RESULTS : produces
    ANALYSES ||--o| VOICE_CONSULTATIONS : includes
    ANALYSES ||--o{ REPORTS : generates
    PATIENTS ||--o{ MEDICAL_RECORDS : owns
    ANALYSES ||--o{ MEDICAL_RECORDS : updates
    DOCTORS ||--o{ APPOINTMENTS : provides
    PATIENTS ||--o{ APPOINTMENTS : books
    USERS ||--o{ AUDIT_LOGS : generates
    ANALYSES ||--o{ NOTIFICATIONS : triggers
    DOCTORS ||--o{ EMAIL_LOGS : sends
    PATIENTS ||--o{ EMAIL_LOGS : receives
```

---

## 9. AI Model Architecture Flow

```mermaid
graph TB
    subgraph "Input Layer"
        A[Fundus Image Input]
        B[Image Preprocessing]
        C[Normalization]
        D[Augmentation Pipeline]
    end
    
    subgraph "DeiT Branch"
        E[Vision Transformer]
        F[Patch Embedding]
        G[Multi-Head Attention]
        H[Transformer Blocks]
        I[Classification Token]
    end
    
    subgraph "ResNet18 Branch"
        J[Convolutional Layers]
        K[Residual Blocks]
        L[Batch Normalization]
        M[ReLU Activation]
        N[Global Average Pooling]
    end
    
    subgraph "Fusion Layer"
        O[Feature Concatenation]
        P[Weighted Combination]
        Q[Attention Mechanism]
        R[Dropout Regularization]
    end
    
    subgraph "Classification Head"
        S[Dense Layer 512]
        T[Dense Layer 256]
        U[Dense Layer 128]
        V[Output Layer 4 Classes]
    end
    
    subgraph "Output Processing"
        W[Softmax Activation]
        X[Confidence Calculation]
        Y[Multi-class Prediction]
        Z[Result Validation]
    end
    
    A --> B
    B --> C
    C --> D
    
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    
    D --> J
    J --> K
    K --> L
    L --> M
    M --> N
    
    I --> O
    N --> O
    O --> P
    P --> Q
    Q --> R
    
    R --> S
    S --> T
    T --> U
    U --> V
    
    V --> W
    W --> X
    X --> Y
    Y --> Z
```

---

## 10. Voice Consultation System Flow

```mermaid
stateDiagram-v2
    [*] --> AnalysisComplete
    AnalysisComplete --> TextGeneration : Generate consultation text
    TextGeneration --> ContentValidation : Validate medical content
    ContentValidation --> ContentValidation : Content validation failed
    ContentValidation --> SpeechSynthesis : Content validated
    SpeechSynthesis --> AudioProcessing : Generate audio
    AudioProcessing --> QualityCheck : Check audio quality
    QualityCheck --> SpeechSynthesis : Quality insufficient
    QualityCheck --> AudioStorage : Quality approved
    AudioStorage --> VoicePlayback : Store and prepare playback
    VoicePlayback --> UserInteraction : Auto-play to user
    UserInteraction --> VoicePlayback : User replays
    UserInteraction --> ConsultationComplete : User stops
    ConsultationComplete --> [*]
    
    note right of TextGeneration : Generate essential diagnostic info\nTarget: <60 seconds
    note right of SpeechSynthesis : Speech rate: 1.3x speed\nVoice: Professional medical tone
    note right of UserInteraction : Only stop button available\nNo pause/rewind controls
```

---

## 11. Authentication & Authorization Flow

```mermaid
flowchart TD
    A[User Login Request] --> B{Credentials Valid?}
    B -->|No| C[Return Authentication Error]
    B -->|Yes| D[Generate JWT Token]
    D --> E[Set Token Expiration]
    E --> F[Return Token to Client]
    F --> G[Store Token in LocalStorage]
    
    G --> H[User Makes Request]
    H --> I[Attach JWT Token to Header]
    I --> J{Token Valid?}
    J -->|No| K[Return 401 Unauthorized]
    J -->|Yes| L[Decode Token]
    L --> M[Extract User Role]
    M --> N{Role Authorized for Resource?}
    N -->|No| O[Return 403 Forbidden]
    N -->|Yes| P[Process Request]
    P --> Q[Return Response]
    
    K --> R[Redirect to Login]
    O --> S[Show Access Denied]
    
    subgraph "Role Permissions"
        T[Doctor: Analysis, Reports, Patients]
        U[Patient: Own Reports, Chat, Education]
        V[Admin: All Users, Analytics, AI Models]
    end
    
    M --> T
    M --> U
    M --> V
```

---

## 12. System Deployment Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Mobile Browser]
        C[Progressive Web App]
    end
    
    subgraph "CDN & Load Balancer"
        D[Content Delivery Network]
        E[Load Balancer]
        F[SSL/TLS Termination]
    end
    
    subgraph "Application Layer"
        G[React Frontend Server]
        H[Express.js API Server]
        I[Authentication Service]
    end
    
    subgraph "AI/ML Services"
        J[TensorFlow Serving]
        K[Model Inference Engine]
        L[Voice Synthesis Service]
    end
    
    subgraph "Data Layer"
        M[MySQL Primary Database]
        N[MySQL Read Replica]
        O[Redis Cache]
        P[File Storage Service]
    end
    
    subgraph "Monitoring & Logging"
        Q[Application Monitoring]
        R[Database Monitoring]
        S[Error Tracking]
        T[Audit Logging]
    end
    
    A --> D
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    F --> H
    H --> I
    H --> J
    J --> K
    H --> L
    H --> M
    H --> N
    H --> O
    H --> P
    
    G --> Q
    H --> Q
    M --> R
    H --> S
    I --> T
```

---

## Technical Implementation Notes

### Database Considerations
- **Primary Key Strategy**: Auto-incrementing integers for performance
- **Foreign Key Constraints**: Enforced for data integrity
- **Indexing**: Optimized for common query patterns
- **Audit Trail**: Complete logging of all medical data changes

### Security Measures
- **JWT Authentication**: Stateless token-based auth
- **Role-Based Access Control**: Granular permissions
- **Data Encryption**: At rest and in transit
- **HIPAA Compliance**: Medical data protection standards

### Performance Optimizations
- **Database Connection Pooling**: Efficient MySQL connections
- **Redis Caching**: Fast access to frequently used data
- **Image Optimization**: Compressed storage and processing
- **Lazy Loading**: On-demand component loading

### AI Model Integration
- **Model Versioning**: Track and deploy model updates
- **A/B Testing**: Compare model performance
- **Fallback Mechanisms**: Graceful degradation
- **Confidence Thresholds**: Quality assurance for predictions

### Voice System Architecture
- **Real-time Generation**: On-demand voice synthesis
- **Medical Vocabulary**: Specialized pronunciation
- **Quality Control**: Audio validation pipeline
- **Accessibility**: WCAG 2.1 AA compliance

---

*This documentation provides a comprehensive view of the Retinal-AI system architecture and can be used for development, maintenance, and system understanding purposes.*