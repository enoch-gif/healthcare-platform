import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { authService } from './authService';

class SupabaseDataService {
  constructor() {
    this.supabase = createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey
    );
    
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-73be656d`;
  }

  // Patient Management
  async getPatients() {
    try {
      const response = await fetch(`${this.baseUrl}/patients`, {
        headers: {
          'Authorization': `Bearer ${authService.getAccessToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch patients');
      }

      const result = await response.json();
      return result.patients;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  }

  async createPatient(patientData) {
    try {
      const response = await fetch(`${this.baseUrl}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getAccessToken()}`
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        throw new Error('Failed to create patient');
      }

      const result = await response.json();
      return result.patient;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }

  // Analysis Management
  async saveAnalysis(analysisData) {
    try {
      const response = await fetch(`${this.baseUrl}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authService.getAccessToken()}`
        },
        body: JSON.stringify(analysisData)
      });

      if (!response.ok) {
        throw new Error('Failed to save analysis');
      }

      const result = await response.json();
      return result.analysis;
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
  }

  async getAnalysisHistory(patientId) {
    try {
      const response = await fetch(`${this.baseUrl}/analysis/history/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${authService.getAccessToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analysis history');
      }

      const result = await response.json();
      return result.analyses;
    } catch (error) {
      console.error('Error fetching analysis history:', error);
      throw error;
    }
  }

  // File Storage
  async uploadRetinalImage(file, patientId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', patientId);

      const response = await fetch(`${this.baseUrl}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authService.getAccessToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      return result.file;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Real-time Analytics
  async getDashboardAnalytics() {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/dashboard`, {
        headers: {
          'Authorization': `Bearer ${authService.getAccessToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }

  // Real-time subscriptions for live updates
  subscribeToAnalytics(callback) {
    // Poll for updates every 30 seconds
    const interval = setInterval(async () => {
      try {
        const analytics = await this.getDashboardAnalytics();
        callback(analytics);
      } catch (error) {
        console.error('Analytics subscription error:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }

  // User Profile Management
  async getUserProfile(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${authService.getAccessToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const result = await response.json();
      return result.profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Health check
  async checkServerHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'unhealthy', error: error.message };
    }
  }

  // Utility methods for data formatting
  formatAnalysisForStorage(analysisResults, patientId, imageMetadata, clinicalNotes) {
    return {
      patientId,
      diagnosis: analysisResults.primaryDiagnosis,
      confidence: analysisResults.primaryDiagnosis.confidence,
      severity: analysisResults.primaryDiagnosis.severity,
      recommendations: analysisResults.recommendations,
      imageMetadata,
      clinicalNotes,
      secondaryFindings: analysisResults.secondaryFindings,
      anatomicalFeatures: analysisResults.anatomicalFeatures,
      modelDetails: analysisResults.aiModelDetails
    };
  }

  formatPatientData(formData) {
    return {
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      medicalHistory: formData.medicalHistory || [],
      emergencyContact: {
        name: formData.emergencyContactName,
        phone: formData.emergencyContactPhone,
        relationship: formData.emergencyContactRelationship
      }
    };
  }
}

export const supabaseDataService = new SupabaseDataService();