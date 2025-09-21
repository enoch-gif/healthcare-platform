// Analytics Routes for Retinal-AI MongoDB Backend
const express = require('express');
const router = express.Router();

module.exports = (models, authenticateToken, requireRole, upload, broadcastUpdate) => {
  const { User, Patient, RetinalAnalysis, MedicalReport, SystemAnalytics, AIModelPerformance } = models;

  // Get analytics overview
  router.get('/overview', authenticateToken, requireRole(['admin', 'doctor']), async (req, res) => {
    try {
      const analytics = {};

      // Total patients
      let patientQuery = {};
      
      if (req.user.role === 'doctor') {
        patientQuery.doctor_id = req.user.userId;
      }

      const totalPatients = await Patient.countDocuments(patientQuery);
      analytics.totalPatients = totalPatients;

      // Total analyses
      let analysisQuery = {};
      
      if (req.user.role === 'doctor') {
        analysisQuery.doctor_id = req.user.userId;
      }

      const totalAnalyses = await RetinalAnalysis.countDocuments(analysisQuery);
      analytics.totalAnalyses = totalAnalyses;

      // Recent analyses (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let recentQuery = { created_at: { $gte: thirtyDaysAgo } };
      
      if (req.user.role === 'doctor') {
        recentQuery.doctor_id = req.user.userId;
      }

      const recentAnalyses = await RetinalAnalysis.countDocuments(recentQuery);
      analytics.recentAnalyses = recentAnalyses;

      // Condition distribution
      let conditionPipeline = [
        { $match: { condition_detected: { $ne: null } } }
      ];
      
      if (req.user.role === 'doctor') {
        conditionPipeline[0].$match.doctor_id = req.user.userId;
      }
      
      conditionPipeline.push(
        { $group: { _id: '$condition_detected', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { condition_detected: '$_id', count: 1, _id: 0 } }
      );

      const conditionDistribution = await RetinalAnalysis.aggregate(conditionPipeline);
      analytics.conditionDistribution = conditionDistribution;

      // Severity distribution
      let severityPipeline = [
        { $match: { severity_level: { $ne: null } } }
      ];
      
      if (req.user.role === 'doctor') {
        severityPipeline[0].$match.doctor_id = req.user.userId;
      }
      
      severityPipeline.push(
        { $group: { _id: '$severity_level', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { severity_level: '$_id', count: 1, _id: 0 } }
      );

      const severityDistribution = await RetinalAnalysis.aggregate(severityPipeline);
      analytics.severityDistribution = severityDistribution;

      // Monthly analysis trends (last 12 months)
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      let trendPipeline = [
        { $match: { created_at: { $gte: twelveMonthsAgo } } }
      ];
      
      if (req.user.role === 'doctor') {
        trendPipeline[0].$match.doctor_id = req.user.userId;
      }
      
      trendPipeline.push(
        {
          $group: {
            _id: {
              year: { $year: '$created_at' },
              month: { $month: '$created_at' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            month: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                { $cond: [
                  { $lt: ['$_id.month', 10] },
                  { $concat: ['0', { $toString: '$_id.month' }] },
                  { $toString: '$_id.month' }
                ]}
              ]
            },
            count: 1,
            _id: 0
          }
        }
      );

      const monthlyTrends = await RetinalAnalysis.aggregate(trendPipeline);
      analytics.monthlyTrends = monthlyTrends;

      // Average confidence score
      let confidencePipeline = [
        { $match: { confidence_score: { $ne: null } } }
      ];
      
      if (req.user.role === 'doctor') {
        confidencePipeline[0].$match.doctor_id = req.user.userId;
      }
      
      confidencePipeline.push(
        { $group: { _id: null, average: { $avg: '$confidence_score' } } }
      );

      const confidenceStats = await RetinalAnalysis.aggregate(confidencePipeline);
      analytics.averageConfidence = confidenceStats.length > 0 
        ? parseFloat(confidenceStats[0].average || 0).toFixed(4) 
        : '0.0000';

      // Most active doctors (admin only)
      if (req.user.role === 'admin') {
        const topDoctors = await RetinalAnalysis.aggregate([
          {
            $group: {
              _id: '$doctor_id',
              analysis_count: { $sum: 1 }
            }
          },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              foreignField: '_id',
              as: 'doctor'
            }
          },
          { $unwind: '$doctor' },
          {
            $match: {
              'doctor.role': 'doctor'
            }
          },
          {
            $project: {
              doctor_name: '$doctor.name',
              specialty: '$doctor.specialty',
              analysis_count: 1,
              _id: 0
            }
          },
          { $sort: { analysis_count: -1 } },
          { $limit: 10 }
        ]);
        analytics.topDoctors = topDoctors;

        // System-wide AI model performance
        const aiModelPerformance = await AIModelPerformance.aggregate([
          {
            $group: {
              _id: '$model_version',
              avg_accuracy: { $avg: '$accuracy_rate' },
              total_predictions: { $sum: '$total_predictions' },
              last_evaluation: { $max: '$evaluation_date' }
            }
          },
          {
            $project: {
              model_version: '$_id',
              avg_accuracy: 1,
              total_predictions: 1,
              last_evaluation: 1,
              _id: 0
            }
          },
          { $sort: { last_evaluation: -1 } }
        ]);
        analytics.aiModelPerformance = aiModelPerformance;
      }

      res.json(analytics);

    } catch (error) {
      console.error('Analytics overview error:', error);
      res.status(500).json({ error: 'Failed to fetch analytics overview' });
    }
  });

  // Get doctor-specific analytics
  router.get('/doctor/:doctorId?', authenticateToken, async (req, res) => {
    try {
      let doctorId = req.params.doctorId;

      // If no doctorId provided, use current user (if doctor)
      if (!doctorId) {
        if (req.user.role !== 'doctor') {
          return res.status(400).json({ error: 'Doctor ID is required for non-doctor users' });
        }
        doctorId = req.user.userId;
      }

      // Check permissions
      if (req.user.role === 'doctor' && doctorId !== req.user.userId) {
        return res.status(403).json({ error: 'Access denied to other doctor analytics' });
      }

      // Verify doctor exists
      const doctor = await User.findOne({ 
        _id: doctorId, 
        role: 'doctor' 
      }).select('_id name specialty license_number');

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }

      const analytics = { doctor };

      // Doctor's patient count
      const totalPatients = await Patient.countDocuments({ doctor_id: doctorId });
      analytics.totalPatients = totalPatients;

      // Doctor's analysis count
      const totalAnalyses = await RetinalAnalysis.countDocuments({ doctor_id: doctorId });
      analytics.totalAnalyses = totalAnalyses;

      // Recent analyses (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentAnalyses = await RetinalAnalysis.countDocuments({
        doctor_id: doctorId,
        created_at: { $gte: thirtyDaysAgo }
      });
      analytics.recentAnalyses = recentAnalyses;

      // Doctor's condition distribution
      const conditionDistribution = await RetinalAnalysis.aggregate([
        { $match: { doctor_id: doctorId, condition_detected: { $ne: null } } },
        { $group: { _id: '$condition_detected', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $project: { condition_detected: '$_id', count: 1, _id: 0 } }
      ]);
      analytics.conditionDistribution = conditionDistribution;

      // Doctor's average confidence score
      const confidenceStats = await RetinalAnalysis.aggregate([
        { $match: { doctor_id: doctorId, confidence_score: { $ne: null } } },
        { $group: { _id: null, average: { $avg: '$confidence_score' } } }
      ]);
      analytics.averageConfidence = confidenceStats.length > 0 
        ? parseFloat(confidenceStats[0].average || 0).toFixed(4) 
        : '0.0000';

      // Daily analysis count for the last 30 days
      const dailyAnalyses = await RetinalAnalysis.aggregate([
        { 
          $match: { 
            doctor_id: doctorId, 
            created_at: { $gte: thirtyDaysAgo }
          } 
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$created_at' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } },
        { $project: { date: '$_id', count: 1, _id: 0 } }
      ]);
      analytics.dailyAnalyses = dailyAnalyses;

      // Recent patients
      const recentPatients = await Patient.find({ doctor_id: doctorId })
        .select('_id first_name last_name medical_record_number created_at')
        .sort({ created_at: -1 })
        .limit(10);
      analytics.recentPatients = recentPatients;

      // Performance metrics
      const performanceMetrics = await RetinalAnalysis.aggregate([
        { $match: { doctor_id: doctorId } },
        {
          $group: {
            _id: null,
            total_analyses: { $sum: 1 },
            avg_confidence: { $avg: '$confidence_score' },
            avg_consultation_time: { $avg: '$voice_consultation_duration' },
            severe_cases: {
              $sum: { $cond: [{ $eq: ['$severity_level', 'severe'] }, 1, 0] }
            },
            moderate_cases: {
              $sum: { $cond: [{ $eq: ['$severity_level', 'moderate'] }, 1, 0] }
            },
            mild_cases: {
              $sum: { $cond: [{ $eq: ['$severity_level', 'mild'] }, 1, 0] }
            }
          }
        }
      ]);
      analytics.performanceMetrics = performanceMetrics.length > 0 ? performanceMetrics[0] : {};

      res.json(analytics);

    } catch (error) {
      console.error('Doctor analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch doctor analytics' });
    }
  });

  // Get AI model performance analytics
  router.get('/ai-performance', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      // Overall AI model performance
      const overallStats = await RetinalAnalysis.aggregate([
        { $match: { confidence_score: { $ne: null } } },
        {
          $group: {
            _id: null,
            total_predictions: { $sum: 1 },
            avg_confidence: { $avg: '$confidence_score' },
            high_confidence: {
              $sum: { $cond: [{ $gte: ['$confidence_score', 0.9] }, 1, 0] }
            },
            medium_confidence: {
              $sum: { $cond: [{ $and: [{ $gte: ['$confidence_score', 0.7] }, { $lt: ['$confidence_score', 0.9] }] }, 1, 0] }
            },
            low_confidence: {
              $sum: { $cond: [{ $lt: ['$confidence_score', 0.7] }, 1, 0] }
            }
          }
        }
      ]);

      // Performance by condition
      const conditionPerformance = await RetinalAnalysis.aggregate([
        { 
          $match: { 
            condition_detected: { $ne: null }, 
            confidence_score: { $ne: null } 
          } 
        },
        {
          $group: {
            _id: '$condition_detected',
            total_cases: { $sum: 1 },
            avg_confidence: { $avg: '$confidence_score' },
            min_confidence: { $min: '$confidence_score' },
            max_confidence: { $max: '$confidence_score' }
          }
        },
        { $sort: { total_cases: -1 } },
        {
          $project: {
            condition_detected: '$_id',
            total_cases: 1,
            avg_confidence: 1,
            min_confidence: 1,
            max_confidence: 1,
            _id: 0
          }
        }
      ]);

      // Monthly performance trends
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const monthlyPerformance = await RetinalAnalysis.aggregate([
        { 
          $match: { 
            created_at: { $gte: twelveMonthsAgo },
            confidence_score: { $ne: null }
          } 
        },
        {
          $group: {
            _id: {
              year: { $year: '$created_at' },
              month: { $month: '$created_at' }
            },
            total_predictions: { $sum: 1 },
            avg_confidence: { $avg: '$confidence_score' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            month: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                { $cond: [
                  { $lt: ['$_id.month', 10] },
                  { $concat: ['0', { $toString: '$_id.month' }] },
                  { $toString: '$_id.month' }
                ]}
              ]
            },
            total_predictions: 1,
            avg_confidence: 1,
            _id: 0
          }
        }
      ]);

      // Model version performance from dedicated collection
      const modelVersions = await AIModelPerformance.find()
        .select('model_version accuracy_rate precision_rate recall_rate f1_score total_predictions correct_predictions evaluation_date')
        .sort({ evaluation_date: -1 });

      res.json({
        overallPerformance: overallStats.length > 0 ? overallStats[0] : {},
        conditionPerformance,
        monthlyTrends: monthlyPerformance,
        modelVersions
      });

    } catch (error) {
      console.error('AI performance analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch AI performance analytics' });
    }
  });

  // Get patient analytics
  router.get('/patients', authenticateToken, requireRole(['admin', 'doctor']), async (req, res) => {
    try {
      let matchStage = {};

      // Apply doctor filter if not admin
      if (req.user.role === 'doctor') {
        matchStage.doctor_id = req.user.userId;
      }

      // Patient demographics - Age distribution
      const ageStats = await Patient.aggregate([
        { $match: matchStage },
        {
          $addFields: {
            age: {
              $floor: {
                $divide: [
                  { $subtract: [new Date(), '$date_of_birth'] },
                  365.25 * 24 * 60 * 60 * 1000
                ]
              }
            }
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lt: ['$age', 18] }, then: 'Under 18' },
                  { case: { $and: [{ $gte: ['$age', 18] }, { $lte: ['$age', 30] }] }, then: '18-30' },
                  { case: { $and: [{ $gte: ['$age', 31] }, { $lte: ['$age', 50] }] }, then: '31-50' },
                  { case: { $and: [{ $gte: ['$age', 51] }, { $lte: ['$age', 70] }] }, then: '51-70' }
                ],
                default: 'Over 70'
              }
            },
            count: { $sum: 1 }
          }
        },
        { $project: { age_group: '$_id', count: 1, _id: 0 } },
        { $sort: { age_group: 1 } }
      ]);

      // Gender distribution
      const genderStats = await Patient.aggregate([
        { $match: { ...matchStage, gender: { $ne: null } } },
        { $group: { _id: '$gender', count: { $sum: 1 } } },
        { $project: { gender: '$_id', count: 1, _id: 0 } }
      ]);

      // Patient registration trends
      const twelveMonthsAgo = new Date();
      twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

      const registrationTrends = await Patient.aggregate([
        { 
          $match: { 
            ...matchStage, 
            created_at: { $gte: twelveMonthsAgo } 
          } 
        },
        {
          $group: {
            _id: {
              year: { $year: '$created_at' },
              month: { $month: '$created_at' }
            },
            new_patients: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        {
          $project: {
            month: {
              $concat: [
                { $toString: '$_id.year' },
                '-',
                { $cond: [
                  { $lt: ['$_id.month', 10] },
                  { $concat: ['0', { $toString: '$_id.month' }] },
                  { $toString: '$_id.month' }
                ]}
              ]
            },
            new_patients: 1,
            _id: 0
          }
        }
      ]);

      // Analysis statistics
      const analysisStats = await Patient.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: 'retinalanalyses',
            localField: '_id',
            foreignField: 'patient_id',
            as: 'analyses'
          }
        },
        {
          $group: {
            _id: null,
            total_patients: { $sum: 1 },
            patients_with_analysis: {
              $sum: { $cond: [{ $gt: [{ $size: '$analyses' }, 0] }, 1, 0] }
            }
          }
        }
      ]);

      // Most recent patients
      const recentPatients = await Patient.find(matchStage)
        .populate('user_id', 'name')
        .select('first_name last_name medical_record_number created_at')
        .sort({ created_at: -1 })
        .limit(10);

      const recentPatientsFormatted = recentPatients.map(patient => ({
        id: patient._id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        medical_record_number: patient.medical_record_number,
        created_at: patient.created_at,
        user_name: patient.user_id?.name || null
      }));

      res.json({
        demographics: {
          ageDistribution: ageStats,
          genderDistribution: genderStats
        },
        registrationTrends,
        analysisStats: analysisStats.length > 0 ? analysisStats[0] : { total_patients: 0, patients_with_analysis: 0 },
        recentPatients: recentPatientsFormatted
      });

    } catch (error) {
      console.error('Patient analytics error:', error);
      res.status(500).json({ error: 'Failed to fetch patient analytics' });
    }
  });

  // Update AI model performance (admin only)
  router.post('/ai-performance', authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const {
        modelVersion, accuracyRate, precisionRate, recallRate, f1Score,
        totalPredictions, correctPredictions
      } = req.body;

      if (!modelVersion || !accuracyRate) {
        return res.status(400).json({ error: 'Model version and accuracy rate are required' });
      }

      // Update or create model performance record
      const filter = { 
        model_version: modelVersion,
        evaluation_date: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999)
        }
      };

      const update = {
        model_version: modelVersion,
        accuracy_rate: accuracyRate,
        precision_rate: precisionRate,
        recall_rate: recallRate,
        f1_score: f1Score,
        total_predictions: totalPredictions,
        correct_predictions: correctPredictions,
        evaluation_date: new Date()
      };

      await AIModelPerformance.findOneAndUpdate(
        filter,
        update,
        { upsert: true, new: true }
      );

      // Broadcast real-time update
      broadcastUpdate('ai_performance_updated', {
        modelVersion, accuracyRate, precisionRate, recallRate, f1Score
      });

      res.json({ message: 'AI model performance updated successfully' });

    } catch (error) {
      console.error('Update AI performance error:', error);
      res.status(500).json({ error: 'Failed to update AI performance' });
    }
  });

  return router;
};