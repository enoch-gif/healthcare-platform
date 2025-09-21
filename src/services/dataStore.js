// Comprehensive Data Store for Medical Platform - 2025 Edition
class DataStore {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Users Data - Real professional medical staff and patients
    if (!localStorage.getItem('users')) {
      const initialUsers = [
        // Medical Doctors
        {
          id: 'doc-001',
          name: 'Dr. Sarah Elizabeth Johnson',
          email: 'sarah.johnson@retinalmed.org',
          role: 'doctor',
          specialization: 'Retinal Specialist & Vitreoretinal Surgeon',
          license: 'MD-REF-2019-4521',
          phone: '+1-617-555-0147',
          department: 'Ophthalmology - Retinal Division',
          yearsExperience: 18,
          education: 'Harvard Medical School, Johns Hopkins Retinal Fellowship',
          certifications: ['American Board of Ophthalmology', 'Vitreoretinal Surgery Certification'],
          avatar: null,
          createdAt: new Date('2019-03-15').toISOString(),
          lastLogin: new Date('2025-01-20').toISOString(),
          status: 'active',
          workSchedule: {
            monday: '08:00-17:00',
            tuesday: '08:00-17:00',
            wednesday: '08:00-17:00',
            thursday: '08:00-17:00',
            friday: '08:00-15:00'
          }
        },
        {
          id: 'doc-002',
          name: 'Dr. Michael Chen Wang',
          email: 'michael.chen@retinalmed.org',
          role: 'doctor',
          specialization: 'Glaucoma Specialist & Neuro-Ophthalmologist',
          license: 'MD-GLU-2020-7834',
          phone: '+1-617-555-0189',
          department: 'Ophthalmology - Glaucoma Division',
          yearsExperience: 15,
          education: 'Stanford Medical School, UCSF Glaucoma Fellowship',
          certifications: ['American Board of Ophthalmology', 'Glaucoma Subspecialty Board'],
          avatar: null,
          createdAt: new Date('2020-06-20').toISOString(),
          lastLogin: new Date('2025-01-19').toISOString(),
          status: 'active',
          workSchedule: {
            monday: '07:30-16:30',
            tuesday: '07:30-16:30',
            wednesday: '07:30-16:30',
            thursday: '07:30-16:30',
            friday: '07:30-12:00'
          }
        },
        {
          id: 'doc-003',
          name: 'Dr. Priya Sharma Patel',
          email: 'priya.patel@retinalmed.org',
          role: 'doctor',
          specialization: 'Pediatric Ophthalmologist & Strabismus Specialist',
          license: 'MD-PED-2021-9156',
          phone: '+1-617-555-0234',
          department: 'Pediatric Ophthalmology',
          yearsExperience: 12,
          education: 'Yale Medical School, Boston Children\'s Hospital Fellowship',
          certifications: ['American Board of Ophthalmology', 'Pediatric Ophthalmology Subspecialty'],
          avatar: null,
          createdAt: new Date('2021-01-10').toISOString(),
          lastLogin: new Date('2025-01-18').toISOString(),
          status: 'active',
          workSchedule: {
            monday: '08:00-17:00',
            tuesday: '08:00-17:00',
            wednesday: '08:00-17:00',
            thursday: '08:00-17:00',
            friday: '08:00-14:00'
          }
        },
        
        // Administrative Staff
        {
          id: 'admin-001',
          name: 'Dr. Robert Mitchell Thompson',
          email: 'robert.thompson@retinalmed.org',
          role: 'admin',
          title: 'Chief Medical Information Officer',
          phone: '+1-617-555-0100',
          department: 'Medical Information Technology',
          permissions: ['system_admin', 'medical_oversight', 'ai_training', 'user_management'],
          education: 'MIT Computer Science, Harvard Medical School',
          specialization: 'Medical AI & Digital Health Systems',
          createdAt: new Date('2018-01-01').toISOString(),
          lastLogin: new Date('2025-01-20').toISOString(),
          status: 'active'
        },
        {
          id: 'admin-002',
          name: 'Jessica Marie Rodriguez',
          email: 'jessica.rodriguez@retinalmed.org',
          role: 'admin',
          title: 'Healthcare Data Analytics Director',
          phone: '+1-617-555-0110',
          department: 'Healthcare Analytics & Quality Assurance',
          permissions: ['analytics_admin', 'quality_control', 'reporting', 'training_oversight'],
          education: 'Stanford Healthcare Management, Johns Hopkins Public Health',
          specialization: 'Healthcare Analytics & AI Implementation',
          createdAt: new Date('2019-05-15').toISOString(),
          lastLogin: new Date('2025-01-19').toISOString(),
          status: 'active'
        },
        
        // Patients with realistic medical profiles
        {
          id: 'patient-001',
          name: 'Margaret Rose Wilson',
          email: 'margaret.wilson@email.com',
          role: 'user',
          dateOfBirth: '1958-11-22',
          age: 66,
          phone: '+1-781-555-2847',
          address: '456 Beacon Street, Boston, MA 02116',
          emergencyContact: {
            name: 'James Wilson (Husband)',
            phone: '+1-781-555-2848',
            relationship: 'Spouse'
          },
          medicalHistory: {
            diabetes: true,
            diabetesType: 'Type 2',
            diagnosisDate: '2015-03-10',
            hypertension: true,
            familyHistoryEyeDisease: true,
            allergies: ['Sulfa drugs', 'Shellfish'],
            currentMedications: [
              'Metformin 1000mg twice daily',
              'Lisinopril 10mg daily',
              'Atorvastatin 20mg daily'
            ],
            pastSurgeries: ['Cataract surgery OD (2020)', 'Cholecystectomy (2018)']
          },
          insuranceInfo: {
            provider: 'Blue Cross Blue Shield of Massachusetts',
            policyNumber: 'BCBS-MA-789456123',
            groupNumber: 'WIL-FAM-001',
            memberID: 'MW789456'
          },
          preferredDoctor: 'doc-001',
          createdAt: new Date('2022-03-10').toISOString(),
          lastVisit: new Date('2024-12-15').toISOString(),
          status: 'active'
        },
        {
          id: 'patient-002',
          name: 'David Alexander Martinez',
          email: 'david.martinez@email.com',
          role: 'user',
          dateOfBirth: '1975-07-18',
          age: 49,
          phone: '+1-508-555-3692',
          address: '89 Commonwealth Avenue, Cambridge, MA 02139',
          emergencyContact: {
            name: 'Maria Elena Martinez (Wife)',
            phone: '+1-508-555-3693',
            relationship: 'Spouse'
          },
          medicalHistory: {
            diabetes: false,
            hypertension: true,
            familyHistoryEyeDisease: false,
            allergies: ['Penicillin'],
            currentMedications: [
              'Losartan 50mg daily',
              'Multivitamin daily'
            ],
            pastSurgeries: []
          },
          insuranceInfo: {
            provider: 'Aetna Better Health',
            policyNumber: 'AET-BH-456789012',
            groupNumber: 'MAR-ENG-002',
            memberID: 'DM456789'
          },
          preferredDoctor: 'doc-002',
          createdAt: new Date('2023-06-20').toISOString(),
          lastVisit: new Date('2024-11-28').toISOString(),
          status: 'active'
        },
        {
          id: 'patient-003',
          name: 'Emily Charlotte Anderson',
          email: 'emily.anderson@email.com',
          role: 'user',
          dateOfBirth: '1992-04-03',
          age: 32,
          phone: '+1-617-555-4751',
          address: '234 Newbury Street, Boston, MA 02115',
          emergencyContact: {
            name: 'Robert Anderson (Father)',
            phone: '+1-617-555-4752',
            relationship: 'Father'
          },
          medicalHistory: {
            diabetes: false,
            hypertension: false,
            familyHistoryEyeDisease: true,
            allergies: [],
            currentMedications: ['Birth control pills'],
            pastSurgeries: []
          },
          insuranceInfo: {
            provider: 'Harvard Pilgrim Health Care',
            policyNumber: 'HPHC-123789456',
            groupNumber: 'AND-DES-003',
            memberID: 'EA123789'
          },
          preferredDoctor: 'doc-003',
          createdAt: new Date('2024-01-15').toISOString(),
          lastVisit: new Date('2024-10-22').toISOString(),
          status: 'active'
        },
        {
          id: 'patient-004',
          name: 'George William Thompson',
          email: 'george.thompson@email.com',
          role: 'user',
          dateOfBirth: '1945-09-12',
          age: 79,
          phone: '+1-857-555-6843',
          address: '567 Harvard Street, Brookline, MA 02446',
          emergencyContact: {
            name: 'Sarah Thompson (Daughter)',
            phone: '+1-857-555-6844',
            relationship: 'Daughter'
          },
          medicalHistory: {
            diabetes: true,
            diabetesType: 'Type 2',
            diagnosisDate: '2008-11-05',
            hypertension: true,
            familyHistoryEyeDisease: true,
            allergies: ['Latex', 'Aspirin'],
            currentMedications: [
              'Insulin Glargine 30 units bedtime',
              'Metformin 500mg twice daily',
              'Amlodipine 5mg daily',
              'Warfarin 5mg daily',
              'Omega-3 supplements'
            ],
            pastSurgeries: [
              'Cataract surgery OU (2019)',
              'Coronary bypass surgery (2016)',
              'Hip replacement (2020)'
            ]
          },
          insuranceInfo: {
            provider: 'Medicare + Supplemental (AARP)',
            policyNumber: 'MED-SUPP-987654321',
            groupNumber: 'AARP-001',
            memberID: 'GT987654'
          },
          preferredDoctor: 'doc-001',
          createdAt: new Date('2020-08-10').toISOString(),
          lastVisit: new Date('2024-12-20').toISOString(),
          status: 'active'
        }
      ];
      localStorage.setItem('users', JSON.stringify(initialUsers));
    }

    // Appointments Data - 2025 realistic appointments
    if (!localStorage.getItem('appointments')) {
      const initialAppointments = [
        {
          id: 'apt-2025-001',
          patientId: 'patient-001',
          doctorId: 'doc-001',
          appointmentDate: '2025-01-25',
          appointmentTime: '10:00',
          duration: 60,
          type: 'Diabetic Retinopathy Follow-up',
          status: 'confirmed',
          symptoms: 'Slight decrease in central vision, occasional floaters',
          notes: 'Patient reports difficulty reading small print. Last HbA1c: 7.2%. Continue current diabetes management.',
          appointmentReason: 'Routine diabetic retinopathy screening and OCT assessment',
          createdAt: new Date('2025-01-15').toISOString(),
          updatedAt: new Date('2025-01-16').toISOString()
        },
        {
          id: 'apt-2025-002',
          patientId: 'patient-002',
          doctorId: 'doc-002',
          appointmentDate: '2025-01-28',
          appointmentTime: '14:30',
          duration: 45,
          type: 'Glaucoma Monitoring',
          status: 'confirmed',
          symptoms: 'Mild eye pressure sensation, no visual field changes noted',
          notes: 'IOP monitoring - last reading 18mmHg OD, 16mmHg OS. Continue Latanoprost.',
          appointmentReason: 'Quarterly glaucoma follow-up with visual field testing',
          createdAt: new Date('2025-01-10').toISOString(),
          updatedAt: new Date('2025-01-11').toISOString()
        },
        {
          id: 'apt-2025-003',
          patientId: 'patient-003',
          doctorId: 'doc-003',
          appointmentDate: '2025-02-02',
          appointmentTime: '09:15',
          duration: 30,
          type: 'Routine Eye Examination',
          status: 'pending',
          symptoms: 'Annual checkup, no specific complaints',
          notes: 'Family history of retinal detachment (maternal grandmother). Comprehensive exam requested.',
          appointmentReason: 'Annual comprehensive eye examination',
          createdAt: new Date('2025-01-18').toISOString(),
          updatedAt: new Date('2025-01-18').toISOString()
        },
        {
          id: 'apt-2025-004',
          patientId: 'patient-004',
          doctorId: 'doc-001',
          appointmentDate: '2025-02-05',
          appointmentTime: '11:00',
          duration: 75,
          type: 'Advanced Diabetic Retinopathy Assessment',
          status: 'confirmed',
          symptoms: 'Gradual vision changes, difficulty with night vision',
          notes: 'Long-standing diabetes (17 years). Previous laser photocoagulation (2021). Monitor for progression.',
          appointmentReason: 'Comprehensive retinal assessment with OCT and fluorescein angiography',
          createdAt: new Date('2025-01-12').toISOString(),
          updatedAt: new Date('2025-01-14').toISOString()
        },
        {
          id: 'apt-2025-005',
          patientId: 'patient-001',
          doctorId: 'doc-001',
          appointmentDate: '2025-02-15',
          appointmentTime: '15:30',
          duration: 30,
          type: 'OCT Follow-up',
          status: 'scheduled',
          symptoms: 'Post-treatment monitoring',
          notes: 'Follow-up after anti-VEGF injection. Monitor macular thickness.',
          appointmentReason: 'Post-injection monitoring and OCT assessment',
          createdAt: new Date('2025-01-20').toISOString(),
          updatedAt: new Date('2025-01-20').toISOString()
        }
      ];
      localStorage.setItem('appointments', JSON.stringify(initialAppointments));
    }

    // Medical Reports Data - 2025 comprehensive reports
    if (!localStorage.getItem('medicalReports')) {
      const initialReports = [
        {
          id: 'report-2025-001',
          patientId: 'patient-001',
          doctorId: 'doc-001',
          appointmentId: 'apt-2025-001',
          reportDate: new Date('2024-12-15').toISOString(),
          scanType: 'OCT + Fundus Photography',
          findings: {
            condition: 'Moderate Non-Proliferative Diabetic Retinopathy with Mild Macular Edema',
            severity: 'Moderate',
            confidence: 94.7,
            description: 'OCT imaging reveals mild central macular thickening (298μm) with scattered microaneurysms and dot-blot hemorrhages in all four quadrants. No evidence of proliferative changes or neovascularization.',
            clinicalFindings: [
              'Central macular thickness: 298μm (normal: 250-275μm)',
              'Multiple microaneurysms in temporal arcade',
              'Scattered intraretinal hemorrhages',
              'No cotton wool spots identified',
              'Optic disc appears normal with clear margins',
              'No signs of proliferative diabetic retinopathy'
            ],
            recommendations: [
              'Continue intensive diabetes management (target HbA1c <7%)',
              'Blood pressure optimization (<130/80 mmHg)',
              'Consider anti-VEGF therapy if macular edema progresses',
              'Follow-up in 4 months with repeat OCT',
              'Immediate referral if sudden vision changes',
              'Ophthalmology consultation every 6 months'
            ],
            riskFactors: [
              'Duration of diabetes: 10 years',
              'Current HbA1c: 7.2%',
              'Hypertension (controlled)',
              'Age-related progression risk'
            ]
          },
          scansPerformed: [
            {
              eye: 'Right',
              imagePath: null,
              scanType: 'OCT Macular Cube',
              quality: 'Excellent',
              centralThickness: '295μm'
            },
            {
              eye: 'Left',
              imagePath: null,
              scanType: 'OCT Macular Cube',
              quality: 'Excellent',
              centralThickness: '301μm'
            },
            {
              eye: 'Right',
              imagePath: null,
              scanType: 'Fundus Photography',
              quality: 'Good',
              notes: 'Clear media, good pupil dilation'
            },
            {
              eye: 'Left',
              imagePath: null,
              scanType: 'Fundus Photography',
              quality: 'Good',
              notes: 'Clear media, adequate visualization'
            }
          ],
          vitalSigns: {
            bloodPressure: '142/88 mmHg',
            intraocularPressure: { OD: '14 mmHg', OS: '13 mmHg' },
            visualAcuity: { OD: '20/25', OS: '20/30' }
          },
          nextAppointment: '2025-04-15',
          status: 'completed',
          createdAt: new Date('2024-12-15').toISOString(),
          reportGenerated: new Date('2024-12-16').toISOString()
        },
        {
          id: 'report-2025-002',
          patientId: 'patient-004',
          doctorId: 'doc-001',
          appointmentId: 'apt-2025-004',
          reportDate: new Date('2024-12-20').toISOString(),
          scanType: 'Comprehensive Retinal Assessment + Fluorescein Angiography',
          findings: {
            condition: 'Severe Non-Proliferative Diabetic Retinopathy with Previous Laser Treatment',
            severity: 'Severe',
            confidence: 97.2,
            description: 'Extensive retinal changes consistent with long-standing diabetes. Previous panretinal photocoagulation scars visible. Current examination shows good response to treatment with no active neovascularization.',
            clinicalFindings: [
              'Multiple flame-shaped hemorrhages in all quadrants',
              'Venous beading in superior temporal arcade',
              'Cotton wool spots in nasal retina',
              'Panretinal photocoagulation scars well-healed',
              'No active neovascularization detected',
              'Vitreous clear without proliferation',
              'Optic disc shows mild pallor temporally'
            ],
            recommendations: [
              'Continue current anti-VEGF therapy protocol',
              'Maintain strict glycemic control (HbA1c <7%)',
              'Monitor for proliferative changes monthly',
              'Consider additional laser if progression occurs',
              'Cardiovascular risk assessment and management',
              'Nephrology consultation for diabetic kidney disease',
              'Emergency contact if sudden vision loss or flashing lights'
            ],
            riskFactors: [
              'Duration of diabetes: 17 years',
              'Previous cardiovascular disease',
              'Advanced age (79 years)',
              'History of poor glycemic control'
            ]
          },
          scansPerformed: [
            {
              eye: 'Right',
              imagePath: null,
              scanType: 'Ultra-wide Field Fundus Photography',
              quality: 'Excellent',
              coverage: '200°'
            },
            {
              eye: 'Left',
              imagePath: null,
              scanType: 'Ultra-wide Field Fundus Photography',
              quality: 'Excellent',
              coverage: '200°'
            },
            {
              eye: 'Right',
              imagePath: null,
              scanType: 'Fluorescein Angiography',
              quality: 'Good',
              phases: 'Early, Mid, Late'
            },
            {
              eye: 'Left',
              imagePath: null,
              scanType: 'Fluorescein Angiography',
              quality: 'Good',
              phases: 'Early, Mid, Late'
            }
          ],
          vitalSigns: {
            bloodPressure: '138/82 mmHg',
            intraocularPressure: { OD: '16 mmHg', OS: '15 mmHg' },
            visualAcuity: { OD: '20/40', OS: '20/50' }
          },
          nextAppointment: '2025-03-20',
          status: 'completed',
          createdAt: new Date('2024-12-20').toISOString(),
          reportGenerated: new Date('2024-12-21').toISOString()
        }
      ];
      localStorage.setItem('medicalReports', JSON.stringify(initialReports));
    }

    // Chat Messages Data - Professional medical communications
    if (!localStorage.getItem('chatMessages')) {
      const initialMessages = [
        {
          id: 'msg-2025-001',
          conversationId: 'conv-doc001-pat001',
          senderId: 'doc-001',
          receiverId: 'patient-001',
          message: 'Good morning Mrs. Wilson. Your recent OCT results are ready for review. The images show stable findings with your diabetic retinopathy. Please schedule your follow-up appointment within the next 2 weeks.',
          timestamp: new Date('2025-01-16').toISOString(),
          read: false,
          type: 'medical_update',
          priority: 'normal'
        },
        {
          id: 'msg-2025-002',
          conversationId: 'conv-doc001-pat001',
          senderId: 'patient-001',
          receiverId: 'doc-001',
          message: 'Thank you Dr. Johnson. I will call tomorrow to schedule the appointment. Should I continue with my current eye drops as prescribed?',
          timestamp: new Date('2025-01-16').toISOString(),
          read: true,
          type: 'patient_query',
          priority: 'normal'
        },
        {
          id: 'msg-2025-003',
          conversationId: 'conv-doc002-pat002',
          senderId: 'doc-002',
          receiverId: 'patient-002',
          message: 'Mr. Martinez, your latest visual field test shows excellent stability. Your glaucoma is well-controlled with current medications. Continue Latanoprost drops and we\'ll see you in 3 months.',
          timestamp: new Date('2025-01-14').toISOString(),
          read: true,
          type: 'medical_update',
          priority: 'normal'
        }
      ];
      localStorage.setItem('chatMessages', JSON.stringify(initialMessages));
    }

    // Conversations Data - Chat conversations between doctors and patients
    if (!localStorage.getItem('conversations')) {
      const initialConversations = [
        {
          id: 'conv-doc001-pat001',
          doctorId: 'doc-001',
          patientId: 'patient-001',
          status: 'active',
          createdAt: new Date('2025-01-15').toISOString(),
          lastMessageTime: new Date('2025-01-16').toISOString(),
          lastMessage: 'Thank you Dr. Johnson. I will call tomorrow to schedule the appointment.'
        },
        {
          id: 'conv-doc002-pat002',
          doctorId: 'doc-002',
          patientId: 'patient-002',
          status: 'active',
          createdAt: new Date('2025-01-13').toISOString(),
          lastMessageTime: new Date('2025-01-14').toISOString(),
          lastMessage: 'Your glaucoma is well-controlled with current medications.'
        }
      ];
      localStorage.setItem('conversations', JSON.stringify(initialConversations));
    }

    // Messages Data - Individual messages within conversations
    if (!localStorage.getItem('messages')) {
      const initialMessages = [
        {
          id: 'message-001',
          conversationId: 'conv-doc001-pat001',
          senderId: 'doc-001',
          senderType: 'doctor',
          content: 'Good morning Mrs. Wilson. Your recent OCT results are ready for review. The images show stable findings with your diabetic retinopathy. Please schedule your follow-up appointment within the next 2 weeks.',
          messageType: 'text',
          timestamp: new Date('2025-01-16').toISOString(),
          readBy: [
            { userId: 'doc-001', readAt: new Date('2025-01-16').toISOString() }
          ]
        },
        {
          id: 'message-002',
          conversationId: 'conv-doc001-pat001',
          senderId: 'patient-001',
          senderType: 'user',
          content: 'Thank you Dr. Johnson. I will call tomorrow to schedule the appointment. Should I continue with my current eye drops as prescribed?',
          messageType: 'text',
          timestamp: new Date('2025-01-16').toISOString(),
          readBy: [
            { userId: 'patient-001', readAt: new Date('2025-01-16').toISOString() },
            { userId: 'doc-001', readAt: new Date('2025-01-16').toISOString() }
          ]
        },
        {
          id: 'message-003',
          conversationId: 'conv-doc002-pat002',
          senderId: 'doc-002',
          senderType: 'doctor',
          content: 'Mr. Martinez, your latest visual field test shows excellent stability. Your glaucoma is well-controlled with current medications. Continue Latanoprost drops and we\'ll see you in 3 months.',
          messageType: 'text',
          timestamp: new Date('2025-01-14').toISOString(),
          readBy: [
            { userId: 'doc-002', readAt: new Date('2025-01-14').toISOString() },
            { userId: 'patient-002', readAt: new Date('2025-01-14').toISOString() }
          ]
        }
      ];
      localStorage.setItem('messages', JSON.stringify(initialMessages));
    }

    // Email Data - Professional email communications
    if (!localStorage.getItem('emails')) {
      const initialEmails = [
        {
          id: 'email-001',
          senderId: 'doc-001',
          senderEmail: 'sarah.johnson@retinalmed.org',
          recipientEmail: 'margaret.wilson@email.com',
          subject: 'Test Results Available - Diabetic Retinopathy Follow-up',
          body: 'Dear Mrs. Wilson,\n\nYour recent OCT scan results are now available in your patient portal. The results show stable findings consistent with your ongoing diabetic retinopathy management.\n\nPlease schedule your next follow-up appointment within the next 2 weeks.\n\nBest regards,\nDr. Sarah Johnson',
          priority: 'normal',
          folder: 'sent',
          isRead: true,
          isStarred: false,
          sentAt: new Date('2025-01-16').toISOString(),
          attachments: []
        }
      ];
      localStorage.setItem('emails', JSON.stringify(initialEmails));
    }

    // AI Conversation History - For AI Assistant
    if (!localStorage.getItem('aiConversations')) {
      localStorage.setItem('aiConversations', JSON.stringify({}));
    }

    // AI Model Training Data - 2025 Advanced Systems
    if (!localStorage.getItem('modelTraining')) {
      const initialTraining = {
        currentModel: {
          version: '3.2.0',
          accuracy: 97.3,
          lastTraining: new Date('2025-01-01').toISOString(),
          trainingDataSize: 45000,
          status: 'active',
          modelType: 'Deep Convolutional Neural Network',
          architecture: 'Vision Transformer + ResNet Hybrid',
          validationAccuracy: 96.8,
          sensitivity: 95.1,
          specificity: 98.2
        },
        trainingHistory: [
          {
            id: 'train-2025-001',
            version: '3.2.0',
            startDate: new Date('2024-12-01').toISOString(),
            endDate: new Date('2025-01-01').toISOString(),
            accuracy: 97.3,
            validationAccuracy: 96.8,
            datasetSize: 45000,
            epochs: 150,
            learningRate: 0.0001,
            batchSize: 64,
            status: 'completed',
            improvementNotes: 'Significant improvement in AMD detection and diabetic retinopathy staging'
          },
          {
            id: 'train-2024-003',
            version: '3.1.2',
            startDate: new Date('2024-09-15').toISOString(),
            endDate: new Date('2024-11-15').toISOString(),
            accuracy: 96.1,
            validationAccuracy: 95.7,
            datasetSize: 38000,
            epochs: 120,
            status: 'completed'
          }
        ],
        pendingDatasets: [
          {
            id: 'dataset-2025-001',
            name: 'International Diabetic Retinopathy Dataset 2025',
            size: '23.7 GB',
            imageCount: 15420,
            status: 'processing',
            uploadDate: '2025-01-15',
            source: 'Multi-center clinical collaboration'
          }
        ]
      };
      localStorage.setItem('modelTraining', JSON.stringify(initialTraining));
    }

    // System Analytics - 2025 Performance Data
    if (!localStorage.getItem('systemAnalytics')) {
      const initialAnalytics = {
        performance: {
          overallAccuracy: 97.3,
          sensitivity: 95.1,
          specificity: 98.2,
          casesProcessed: 8947,
          monthlyGrowth: 23.5,
          lastUpdated: new Date().toISOString()
        },
        usage: {
          totalUsers: 1247,
          activeDoctors: 67,
          totalPatients: 1156,
          appointmentsThisMonth: 342,
          scansThisMonth: 891,
          reportGenerated: 823,
          systemUptime: '99.97%'
        },
        qualityMetrics: {
          patientSatisfaction: 4.8,
          diagnosticAccuracy: 97.3,
          reportTurnaroundTime: '2.3 hours',
          averageConsultationTime: '32 minutes'
        }
      };
      localStorage.setItem('systemAnalytics', JSON.stringify(initialAnalytics));
    }
  }

  // Enhanced User Management with search and filtering
  getUsers(filters = {}) {
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (filters.role) {
      users = users.filter(user => user.role === filters.role);
    }
    if (filters.status) {
      users = users.filter(user => user.status === filters.status);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      users = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }
    
    return users;
  }

  getUserById(id) {
    const users = this.getUsers();
    return users.find(user => user.id === id);
  }

  getUsersByRole(role) {
    return this.getUsers({ role });
  }

  createUser(userData) {
    const users = this.getUsers();
    const newUser = {
      id: `${userData.role}-${Date.now()}`,
      ...userData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return newUser;
  }

  updateUser(id, userData) {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData, updatedAt: new Date().toISOString() };
      localStorage.setItem('users', JSON.stringify(users));
      return users[index];
    }
    return null;
  }

  deleteUser(id) {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    return true;
  }

  // Enhanced Appointment Management
  getAppointments(filters = {}) {
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    if (filters.doctorId) {
      appointments = appointments.filter(apt => apt.doctorId === filters.doctorId);
    }
    if (filters.patientId) {
      appointments = appointments.filter(apt => apt.patientId === filters.patientId);
    }
    if (filters.status) {
      appointments = appointments.filter(apt => apt.status === filters.status);
    }
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      appointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= startDate && aptDate <= endDate;
      });
    }
    
    return appointments.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  }

  getAppointmentsByDoctor(doctorId) {
    return this.getAppointments({ doctorId });
  }

  getAppointmentsByPatient(patientId) {
    return this.getAppointments({ patientId });
  }

  createAppointment(appointmentData) {
    const appointments = this.getAppointments();
    const newAppointment = {
      id: `apt-${Date.now()}`,
      ...appointmentData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    appointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    return newAppointment;
  }

  updateAppointment(id, data) {
    const appointments = this.getAppointments();
    const index = appointments.findIndex(apt => apt.id === id);
    if (index !== -1) {
      appointments[index] = { 
        ...appointments[index], 
        ...data, 
        updatedAt: new Date().toISOString() 
      };
      localStorage.setItem('appointments', JSON.stringify(appointments));
      return appointments[index];
    }
    return null;
  }

  deleteAppointment(id) {
    const appointments = this.getAppointments();
    const filtered = appointments.filter(apt => apt.id !== id);
    localStorage.setItem('appointments', JSON.stringify(filtered));
    return true;
  }

  // Enhanced Medical Reports Management
  getMedicalReports(filters = {}) {
    let reports = JSON.parse(localStorage.getItem('medicalReports') || '[]');
    
    if (filters.patientId) {
      reports = reports.filter(report => report.patientId === filters.patientId);
    }
    if (filters.doctorId) {
      reports = reports.filter(report => report.doctorId === filters.doctorId);
    }
    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      reports = reports.filter(report => {
        const reportDate = new Date(report.reportDate);
        return reportDate >= startDate && reportDate <= endDate;
      });
    }
    
    return reports.sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate));
  }

  getReportsByPatient(patientId) {
    return this.getMedicalReports({ patientId });
  }

  getReportsByDoctor(doctorId) {
    return this.getMedicalReports({ doctorId });
  }

  createMedicalReport(reportData) {
    const reports = this.getMedicalReports();
    const newReport = {
      id: `report-${Date.now()}`,
      ...reportData,
      createdAt: new Date().toISOString(),
      status: 'completed'
    };
    reports.push(newReport);
    localStorage.setItem('medicalReports', JSON.stringify(reports));
    return newReport;
  }

  // Enhanced Chat Management
  getChatMessages(filters = {}) {
    let messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    
    if (filters.conversationId) {
      messages = messages.filter(msg => msg.conversationId === filters.conversationId);
    }
    
    return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  getConversation(userId1, userId2) {
    const messages = this.getChatMessages();
    return messages.filter(msg => 
      (msg.senderId === userId1 && msg.receiverId === userId2) ||
      (msg.senderId === userId2 && msg.receiverId === userId1)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  sendMessage(senderId, receiverId, message, type = 'message') {
    const messages = this.getChatMessages();
    const newMessage = {
      id: `msg-${Date.now()}`,
      conversationId: `conv-${Math.min(senderId, receiverId)}-${Math.max(senderId, receiverId)}`,
      senderId,
      receiverId,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    messages.push(newMessage);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    return newMessage;
  }

  markMessageAsRead(messageId) {
    const messages = this.getChatMessages();
    const index = messages.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      messages[index].read = true;
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }

  // Enhanced Analytics
  getSystemAnalytics() {
    return JSON.parse(localStorage.getItem('systemAnalytics'));
  }

  updateSystemAnalytics(data) {
    const analytics = this.getSystemAnalytics();
    const updated = { ...analytics, ...data, lastUpdated: new Date().toISOString() };
    localStorage.setItem('systemAnalytics', JSON.stringify(updated));
    return updated;
  }

  // Enhanced Model Training
  getModelTraining() {
    return JSON.parse(localStorage.getItem('modelTraining'));
  }

  startModelTraining(trainingData) {
    const training = this.getModelTraining();
    const newTraining = {
      id: `train-${Date.now()}`,
      version: `3.${training.trainingHistory.length + 2}.0`,
      startDate: new Date().toISOString(),
      status: 'training',
      ...trainingData
    };
    training.trainingHistory.push(newTraining);
    localStorage.setItem('modelTraining', JSON.stringify(training));
    return newTraining;
  }

  completeModelTraining(trainingId, results) {
    const training = this.getModelTraining();
    const index = training.trainingHistory.findIndex(t => t.id === trainingId);
    if (index !== -1) {
      training.trainingHistory[index] = {
        ...training.trainingHistory[index],
        ...results,
        endDate: new Date().toISOString(),
        status: 'completed'
      };
      // Update current model if this training was successful
      if (results.accuracy > training.currentModel.accuracy) {
        training.currentModel = {
          ...training.currentModel,
          ...results,
          lastTraining: new Date().toISOString()
        };
      }
      localStorage.setItem('modelTraining', JSON.stringify(training));
    }
  }

  // Utility Methods
  generateDashboardStats(userId, userRole) {
    const stats = {};
    
    if (userRole === 'doctor') {
      const appointments = this.getAppointmentsByDoctor(userId);
      const reports = this.getReportsByDoctor(userId);
      const today = new Date().toDateString();
      
      stats.todayAppointments = appointments.filter(apt => 
        new Date(apt.appointmentDate).toDateString() === today
      ).length;
      stats.pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
      stats.totalReports = reports.length;
      stats.thisMonthReports = reports.filter(r => {
        const reportDate = new Date(r.createdAt);
        const currentMonth = new Date().getMonth();
        return reportDate.getMonth() === currentMonth;
      }).length;
    }
    
    if (userRole === 'user') {
      const appointments = this.getAppointmentsByPatient(userId);
      const reports = this.getReportsByPatient(userId);
      
      stats.upcomingAppointments = appointments.filter(apt => 
        new Date(apt.appointmentDate) >= new Date() && apt.status === 'confirmed'
      ).length;
      stats.totalReports = reports.length;
      stats.pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
    }
    
    if (userRole === 'admin') {
      const users = this.getUsers();
      const appointments = this.getAppointments();
      const reports = this.getMedicalReports();
      
      stats.totalUsers = users.length;
      stats.activeDoctors = users.filter(u => u.role === 'doctor' && u.status === 'active').length;
      stats.totalPatients = users.filter(u => u.role === 'user').length;
      stats.monthlyAppointments = appointments.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        const currentMonth = new Date().getMonth();
        return aptDate.getMonth() === currentMonth;
      }).length;
    }
    
    return stats;
  }

  // ===== CONVERSATION AND MESSAGING METHODS =====
  
  // Get conversations by doctor
  getConversationsByDoctor(doctorId) {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    return conversations.filter(conv => conv.doctorId === doctorId);
  }

  // Get conversations by patient
  getConversationsByPatient(patientId) {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    return conversations.filter(conv => conv.patientId === patientId);
  }

  // Get last message from a conversation
  getLastMessage(conversationId) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const conversationMessages = messages.filter(msg => msg.conversationId === conversationId);
    if (conversationMessages.length === 0) return null;
    
    // Sort by timestamp and get the last one
    conversationMessages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    return conversationMessages[0];
  }

  // Get unread message count
  getUnreadCount(conversationId, userRole) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const conversationMessages = messages.filter(msg => msg.conversationId === conversationId);
    
    // Count messages not read by the current user role
    return conversationMessages.filter(msg => {
      if (userRole === 'doctor' && msg.senderType === 'user') {
        // For doctors, count unread messages from patients
        return !msg.readBy.some(read => read.userId && this.getUserById(read.userId)?.role === 'doctor');
      } else if (userRole === 'user' && msg.senderType === 'doctor') {
        // For patients, count unread messages from doctors
        return !msg.readBy.some(read => read.userId && this.getUserById(read.userId)?.role === 'user');
      }
      return false;
    }).length;
  }

  // Get messages by conversation
  getMessagesByConversation(conversationId) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const conversationMessages = messages.filter(msg => msg.conversationId === conversationId);
    // Sort by timestamp (oldest first)
    return conversationMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // Create a new message
  createMessage(messageData) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const newMessage = {
      id: `message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...messageData,
      timestamp: messageData.timestamp || new Date().toISOString()
    };
    messages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(messages));
    return newMessage;
  }

  // Mark messages as read
  markMessagesAsRead(conversationId, userRole) {
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const updated = messages.map(msg => {
      if (msg.conversationId === conversationId) {
        // Add read status for the current user role
        const readBy = msg.readBy || [];
        const userId = userRole === 'doctor' ? msg.conversationId.split('-')[1] : msg.conversationId.split('-')[2];
        
        if (!readBy.some(read => read.userId === userId)) {
          readBy.push({
            userId: userId,
            readAt: new Date().toISOString()
          });
        }
        
        return { ...msg, readBy };
      }
      return msg;
    });
    localStorage.setItem('messages', JSON.stringify(updated));
  }

  // Update conversation
  updateConversation(conversationId, updateData) {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const updated = conversations.map(conv => 
      conv.id === conversationId 
        ? { ...conv, ...updateData, updatedAt: new Date().toISOString() }
        : conv
    );
    localStorage.setItem('conversations', JSON.stringify(updated));
  }

  // Create a new conversation
  createConversation(conversationData) {
    const conversations = JSON.parse(localStorage.getItem('conversations') || '[]');
    const newConversation = {
      id: `conv-${conversationData.doctorId}-${conversationData.patientId}-${Date.now()}`,
      ...conversationData,
      createdAt: conversationData.createdAt || new Date().toISOString(),
      lastMessageTime: conversationData.createdAt || new Date().toISOString()
    };
    conversations.push(newConversation);
    localStorage.setItem('conversations', JSON.stringify(conversations));
    return newConversation;
  }

  // ===== EMAIL METHODS =====

  // Get emails by doctor
  getEmailsByDoctor(doctorId, folder = 'inbox') {
    const emails = JSON.parse(localStorage.getItem('emails') || '[]');
    return emails.filter(email => 
      (email.senderId === doctorId && folder === 'sent') ||
      (email.recipientId === doctorId && folder === 'inbox') ||
      (email.folder === folder)
    );
  }

  // Create email
  createEmail(emailData) {
    const emails = JSON.parse(localStorage.getItem('emails') || '[]');
    const newEmail = {
      id: `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...emailData,
      sentAt: emailData.sentAt || new Date().toISOString()
    };
    emails.push(newEmail);
    localStorage.setItem('emails', JSON.stringify(emails));
    return newEmail;
  }

  // Update email
  updateEmail(emailId, updateData) {
    const emails = JSON.parse(localStorage.getItem('emails') || '[]');
    const updated = emails.map(email =>
      email.id === emailId 
        ? { ...email, ...updateData, updatedAt: new Date().toISOString() }
        : email
    );
    localStorage.setItem('emails', JSON.stringify(updated));
  }

  // ===== AI ASSISTANT METHODS =====

  // Get AI conversation history
  getAIConversationHistory(userId) {
    const aiConversations = JSON.parse(localStorage.getItem('aiConversations') || '{}');
    return aiConversations[userId] || [];
  }

  // Save AI conversation
  saveAIConversation(userId, messages) {
    const aiConversations = JSON.parse(localStorage.getItem('aiConversations') || '{}');
    if (!aiConversations[userId]) {
      aiConversations[userId] = [];
    }
    aiConversations[userId] = aiConversations[userId].concat(messages);
    localStorage.setItem('aiConversations', JSON.stringify(aiConversations));
  }
}

// Export singleton instance
export const dataStore = new DataStore();