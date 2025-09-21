// File Upload Routes for Retinal-AI MongoDB Backend
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { GridFSBucket } = require('mongodb');
const multer = require('multer');
const router = express.Router();

module.exports = (models, authenticateToken, requireRole, upload, broadcastUpdate) => {
  const { User, Patient, RetinalAnalysis, MedicalReport, FileUpload, gfsBucket } = models;

  // Upload retinal image
  router.post('/image', authenticateToken, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      const { patientId } = req.body;
      
      if (!patientId) {
        return res.status(400).json({ error: 'Patient ID is required' });
      }

      // Verify patient access
      let patientQuery = { _id: patientId };

      if (req.user.role === 'doctor') {
        patientQuery.doctor_id = req.user.userId;
      } else if (req.user.role === 'patient') {
        patientQuery.user_id = req.user.userId;
      }

      const patient = await Patient.findOne(patientQuery);

      if (!patient) {
        // Clean up uploaded file
        await fs.unlink(req.file.path);
        return res.status(403).json({ error: 'Patient not found or access denied' });
      }

      // Save file information to database
      const newFileUpload = new FileUpload({
        user_id: req.user.userId,
        patient_id: patientId,
        file_name: req.file.filename,
        original_name: req.file.originalname,
        file_path: req.file.path,
        file_size: req.file.size,
        mime_type: req.file.mimetype,
        upload_type: 'retinal_image'
      });

      const savedFile = await newFileUpload.save();

      // Generate accessible URL
      const fileUrl = `${req.protocol}://${req.get('host')}/api/uploads/files/${req.file.filename}`;

      const fileInfo = {
        id: savedFile._id,
        fileName: req.file.filename,
        originalName: req.file.originalname,
        fileUrl: fileUrl,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        patientId: patientId,
        uploadedAt: savedFile.created_at
      };

      // Broadcast real-time update
      broadcastUpdate('image_uploaded', fileInfo);

      res.status(201).json({
        message: 'Image uploaded successfully',
        file: fileInfo
      });

    } catch (error) {
      // Clean up uploaded file on error
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      
      console.error('Image upload error:', error);
      res.status(500).json({ error: 'Failed to upload image' });
    }
  });

  // Get file by filename
  router.get('/files/:filename', authenticateToken, async (req, res) => {
    try {
      const filename = req.params.filename;

      // Get file information from database
      const file = await FileUpload.findOne({ file_name: filename })
        .populate('patient_id', 'doctor_id user_id');

      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Check access permissions
      let hasAccess = false;
      
      if (req.user.role === 'admin') {
        hasAccess = true;
      } else if (req.user.role === 'doctor') {
        hasAccess = (file.patient_id?.doctor_id?.toString() === req.user.userId) || 
                   (file.user_id?.toString() === req.user.userId);
      } else if (req.user.role === 'patient') {
        hasAccess = (file.patient_id?.user_id?.toString() === req.user.userId) || 
                   (file.user_id?.toString() === req.user.userId);
      }

      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied to this file' });
      }

      // Check if file exists on disk
      try {
        await fs.access(file.file_path);
      } catch (error) {
        return res.status(404).json({ error: 'File not found on disk' });
      }

      // Set appropriate headers
      res.setHeader('Content-Type', file.mime_type);
      res.setHeader('Content-Length', file.file_size);
      res.setHeader('Content-Disposition', `inline; filename="${file.original_name}"`);

      // Send file
      res.sendFile(path.resolve(file.file_path));

    } catch (error) {
      console.error('File retrieval error:', error);
      res.status(500).json({ error: 'Failed to retrieve file' });
    }
  });

  // Get file URL (for frontend use)
  router.get('/url/:filename', authenticateToken, async (req, res) => {
    try {
      const filename = req.params.filename;

      // Get file information and check access
      const file = await FileUpload.findOne({ file_name: filename })
        .populate('patient_id', 'doctor_id user_id');

      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Check access permissions
      let hasAccess = false;
      
      if (req.user.role === 'admin') {
        hasAccess = true;
      } else if (req.user.role === 'doctor') {
        hasAccess = (file.patient_id?.doctor_id?.toString() === req.user.userId) || 
                   (file.user_id?.toString() === req.user.userId);
      } else if (req.user.role === 'patient') {
        hasAccess = (file.patient_id?.user_id?.toString() === req.user.userId) || 
                   (file.user_id?.toString() === req.user.userId);
      }

      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied to this file' });
      }

      // Generate accessible URL
      const fileUrl = `${req.protocol}://${req.get('host')}/api/uploads/files/${filename}`;

      res.json({
        url: fileUrl,
        filename: file.file_name,
        originalName: file.original_name,
        fileSize: file.file_size,
        mimeType: file.mime_type
      });

    } catch (error) {
      console.error('File URL error:', error);
      res.status(500).json({ error: 'Failed to generate file URL' });
    }
  });

  // List files for a patient
  router.get('/patient/:patientId', authenticateToken, async (req, res) => {
    try {
      const patientId = req.params.patientId;

      // Verify patient access
      let patientQuery = { _id: patientId };

      if (req.user.role === 'doctor') {
        patientQuery.doctor_id = req.user.userId;
      } else if (req.user.role === 'patient') {
        patientQuery.user_id = req.user.userId;
      }

      const patient = await Patient.findOne(patientQuery);

      if (!patient) {
        return res.status(403).json({ error: 'Patient not found or access denied' });
      }

      // Get files for the patient
      const files = await FileUpload.find({ patient_id: patientId })
        .select('_id file_name original_name file_size mime_type upload_type created_at')
        .sort({ created_at: -1 });

      // Add file URLs
      const filesWithUrls = files.map(file => ({
        id: file._id,
        file_name: file.file_name,
        original_name: file.original_name,
        file_size: file.file_size,
        mime_type: file.mime_type,
        upload_type: file.upload_type,
        created_at: file.created_at,
        fileUrl: `${req.protocol}://${req.get('host')}/api/uploads/files/${file.file_name}`
      }));

      res.json({ files: filesWithUrls });

    } catch (error) {
      console.error('List patient files error:', error);
      res.status(500).json({ error: 'Failed to list patient files' });
    }
  });

  // Delete file
  router.delete('/:fileId', authenticateToken, async (req, res) => {
    try {
      const fileId = req.params.fileId;

      // Get file information
      const file = await FileUpload.findById(fileId)
        .populate('patient_id', 'doctor_id user_id');

      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }

      // Check delete permissions
      let canDelete = false;
      
      if (req.user.role === 'admin') {
        canDelete = true;
      } else if (req.user.role === 'doctor') {
        canDelete = (file.patient_id?.doctor_id?.toString() === req.user.userId) || 
                   (file.user_id?.toString() === req.user.userId);
      } else if (req.user.role === 'patient') {
        canDelete = file.user_id?.toString() === req.user.userId;
      }

      if (!canDelete) {
        return res.status(403).json({ error: 'Permission denied to delete this file' });
      }

      // Delete file from disk
      try {
        await fs.unlink(file.file_path);
      } catch (error) {
        console.warn('File not found on disk, continuing with database deletion');
      }

      // Delete file record from database
      await FileUpload.findByIdAndDelete(fileId);

      // Broadcast real-time update
      broadcastUpdate('file_deleted', { id: fileId, filename: file.file_name });

      res.json({ message: 'File deleted successfully' });

    } catch (error) {
      console.error('Delete file error:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  });

  return router;
};