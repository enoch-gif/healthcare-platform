// Analysis Routes for Retinal-AI MongoDB Backend
const express = require('express');
const router = express.Router();

module.exports = (models, authenticateToken, requireRole, upload, broadcastUpdate) => {
  const { User, Patient, RetinalAnalysis, MedicalReport, FileUpload, SystemAnalytics, AIModelPerformance } = models;

  // Save retinal analysis
  router.post('/', authenticateToken, requireRole(['doctor']), async (req, res) => {
    try {
      const {
        patient_id, image_path, analysis_results, ai_prediction,
        confidence_score, condition_detected, severity_level,
        recommendations, additional_notes, voice_consultation_transcript,
        voice_consultation_duration
      } = req.body;

      if (!patient_id) {
        return res.status(400).json({ error: 'Patient ID is required' });
      }

      // Verify patient belongs to doctor
      const patient = await Patient.findOne({ 
        _id: patient_id, 
        doctor_id: req.user.userId 
      });

      if (!patient) {
        return res.status(403).json({ error: 'Patient not found or access denied' });
      }

      // Create analysis
      const newAnalysis = new RetinalAnalysis({
        patient_id,
        doctor_id: req.user.userId,
        image_path,
        analysis_results,
        ai_prediction,
        confidence_score,
        condition_detected,
        severity_level,
        recommendations,
        additional_notes,
        voice_consultation_transcript,
        voice_consultation_duration,
        status: 'completed'
      });

      const savedAnalysis = await newAnalysis.save();

      // Get the created analysis with patient info
      const analysis = await RetinalAnalysis.findById(savedAnalysis._id)
        .populate('patient_id', 'first_name last_name medical_record_number')
        .populate('doctor_id', 'name');

      // Update AI model performance metrics
      const existingPerformance = await AIModelPerformance.findOne({
        model_version: 'DeiT+ResNet18-v1.0',
        evaluation_date: { $gte: new Date().setHours(0, 0, 0, 0) }
      });

      if (existingPerformance) {
        existingPerformance.total_predictions += 1;
        await existingPerformance.save();
      } else {
        const newPerformance = new AIModelPerformance({
          model_version: 'DeiT+ResNet18-v1.0',
          accuracy_rate: confidence_score,
          total_predictions: 1,
          evaluation_date: new Date()
        });
        await newPerformance.save();
      }

      // Broadcast real-time update
      broadcastUpdate('analysis_completed', analysis);

      res.status(201).json({
        message: 'Analysis saved successfully',
        analysis
      });

    } catch (error) {
      console.error('Save analysis error:', error);
      res.status(500).json({ error: 'Failed to save analysis' });
    }
  });

  // Get specific analysis
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const analysisId = req.params.id;
      let query = { _id: analysisId };

      // Role-based access control
      if (req.user.role === 'doctor') {
        query.doctor_id = req.user.userId;
      } else if (req.user.role === 'patient') {
        // For patients, we need to check through the patient record
        const patient = await Patient.findOne({ user_id: req.user.userId });
        if (patient) {
          query.patient_id = patient._id;
        } else {
          return res.status(404).json({ error: 'Analysis not found or access denied' });
        }
      }

      const analysis = await RetinalAnalysis.findOne(query)
        .populate('patient_id', 'first_name last_name medical_record_number date_of_birth gender')
        .populate('doctor_id', 'name');

      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found or access denied' });
      }

      res.json({ analysis });

    } catch (error) {
      console.error('Get analysis error:', error);
      res.status(500).json({ error: 'Failed to fetch analysis' });
    }
  });

  // Get analyses by patient
  router.get('/patient/:patientId', authenticateToken, async (req, res) => {
    try {
      const patientId = req.params.patientId;
      let query = { patient_id: patientId };

      // Role-based access control
      if (req.user.role === 'doctor') {
        query.doctor_id = req.user.userId;
      } else if (req.user.role === 'patient') {
        // Verify the patient belongs to the user
        const patient = await Patient.findOne({ 
          _id: patientId, 
          user_id: req.user.userId 
        });
        if (!patient) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }

      const analyses = await RetinalAnalysis.find(query)
        .populate('patient_id', 'first_name last_name')
        .populate('doctor_id', 'name')
        .sort({ created_at: -1 });

      res.json({ analyses });

    } catch (error) {
      console.error('Get patient analyses error:', error);
      res.status(500).json({ error: 'Failed to fetch patient analyses' });
    }
  });

  // Get all analyses (for doctors and admins)
  router.get('/', authenticateToken, requireRole(['doctor', 'admin']), async (req, res) => {
    try {
      let query = {};

      // If doctor, only show their analyses
      if (req.user.role === 'doctor') {
        query.doctor_id = req.user.userId;
      }

      // Add filters if provided
      if (req.query.condition) {
        query.condition_detected = req.query.condition;
      }

      if (req.query.severity) {
        query.severity_level = req.query.severity;
      }

      if (req.query.status) {
        query.status = req.query.status;
      }

      // Add pagination
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const skip = (page - 1) * limit;

      const analyses = await RetinalAnalysis.find(query)
        .populate('patient_id', 'first_name last_name medical_record_number')
        .populate('doctor_id', 'name')
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const total = await RetinalAnalysis.countDocuments(query);

      res.json({
        analyses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });

    } catch (error) {
      console.error('Get analyses error:', error);
      res.status(500).json({ error: 'Failed to fetch analyses' });
    }
  });

  // Update analysis
  router.put('/:id', authenticateToken, requireRole(['doctor']), async (req, res) => {
    try {
      const analysisId = req.params.id;
      const {
        analysis_results, ai_prediction, confidence_score, condition_detected,
        severity_level, recommendations, additional_notes, status
      } = req.body;

      // Verify analysis belongs to doctor
      const analysis = await RetinalAnalysis.findOne({ 
        _id: analysisId, 
        doctor_id: req.user.userId 
      });

      if (!analysis) {
        return res.status(403).json({ error: 'Analysis not found or access denied' });
      }

      // Update fields that are provided
      const updateData = {};
      if (analysis_results !== undefined) updateData.analysis_results = analysis_results;
      if (ai_prediction !== undefined) updateData.ai_prediction = ai_prediction;
      if (confidence_score !== undefined) updateData.confidence_score = confidence_score;
      if (condition_detected !== undefined) updateData.condition_detected = condition_detected;
      if (severity_level !== undefined) updateData.severity_level = severity_level;
      if (recommendations !== undefined) updateData.recommendations = recommendations;
      if (additional_notes !== undefined) updateData.additional_notes = additional_notes;
      if (status !== undefined) updateData.status = status;

      const updatedAnalysis = await RetinalAnalysis.findByIdAndUpdate(
        analysisId,
        updateData,
        { new: true }
      )
        .populate('patient_id', 'first_name last_name')
        .populate('doctor_id', 'name');

      // Broadcast real-time update
      broadcastUpdate('analysis_updated', updatedAnalysis);

      res.json({
        message: 'Analysis updated successfully',
        analysis: updatedAnalysis
      });

    } catch (error) {
      console.error('Update analysis error:', error);
      res.status(500).json({ error: 'Failed to update analysis' });
    }
  });

  // Delete analysis
  router.delete('/:id', authenticateToken, requireRole(['doctor', 'admin']), async (req, res) => {
    try {
      const analysisId = req.params.id;
      let query = { _id: analysisId };

      if (req.user.role === 'doctor') {
        query.doctor_id = req.user.userId;
      }

      const analysis = await RetinalAnalysis.findOne(query);

      if (!analysis) {
        return res.status(403).json({ error: 'Analysis not found or access denied' });
      }

      // Delete analysis (will cascade to related records via middleware)
      await RetinalAnalysis.findByIdAndDelete(analysisId);

      // Broadcast real-time update
      broadcastUpdate('analysis_deleted', { id: analysisId });

      res.json({ message: 'Analysis deleted successfully' });

    } catch (error) {
      console.error('Delete analysis error:', error);
      res.status(500).json({ error: 'Failed to delete analysis' });
    }
  });

  return router;
};