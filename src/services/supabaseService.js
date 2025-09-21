import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

class SupabaseService {
  constructor() {
    // Don't initialize Supabase client automatically to prevent multiple client warnings
    this.supabase = null;
    this.baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-73be656d`;
    this.currentUser = null;
    this.userProfile = null;
    this.authToken = null;
    this.isEnabled = false; // Disabled by default since we're using MySQL
    
    // Only initialize if explicitly enabled
    // this.initializeAuth();
  }

  // Method to enable Supabase if needed
  enableSupabase() {
    if (!this.supabase) {
      this.supabase = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey
      );
      this.isEnabled = true;
      this.initializeAuth();
    }
  }

  async initializeAuth() {
    try {
      if (!this.supabase || !this.isEnabled) {
        return; // Skip if Supabase is not enabled
      }
      
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session?.access_token) {
        this.authToken = session.access_token;
        this.currentUser = session.user;
        await this.fetchUserProfile();
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    }
  }

  // Authentication Methods
  async signUp(userData) {
    try {
      const response = await fetch(`${this.baseUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          userData: {
            name: userData.name,
            role: userData.role || 'patient',
            phone: userData.phone,
            dateOfBirth: userData.dateOfBirth,
            medicalRecordNumber: userData.medicalRecordNumber,
            specialty: userData.specialty,
            licenseNumber: userData.licenseNumber,
            hospitalAffiliation: userData.hospitalAffiliation
          }
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      return { user: result.user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      return { user: null, error: error.message };
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      this.authToken = data.session.access_token;
      this.currentUser = data.user;
      await this.fetchUserProfile();

      return { user: data.user, session: data.session, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, session: null, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;

      this.authToken = null;
      this.currentUser = null;
      this.userProfile = null;

      return { error: null };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error.message };
    }
  }

  async fetchUserProfile() {
    if (!this.authToken) {
      throw new Error('No authentication token available');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const result = await response.json();
      this.userProfile = result.profile;
      return this.userProfile;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  // Patient Management
  async getPatients() {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/patients`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch patients');
      }

      const result = await response.json();
      return result.patients;
    } catch (error) {
      console.error('Get patients error:', error);
      throw error;
    }
  }

  async getPatient(patientId) {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch patient');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get patient error:', error);
      throw error;
    }
  }

  // Analysis Management
  async saveAnalysis(analysisData) {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify(analysisData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save analysis');
      }

      const result = await response.json();
      return result.analysis;
    } catch (error) {
      console.error('Save analysis error:', error);
      throw error;
    }
  }

  async getAnalysis(analysisId) {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/analysis/${analysisId}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch analysis');
      }

      const result = await response.json();
      return result.analysis;
    } catch (error) {
      console.error('Get analysis error:', error);
      throw error;
    }
  }

  // File Storage
  async uploadRetinalImage(file, patientId) {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', patientId);

      const response = await fetch(`${this.baseUrl}/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        },
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Upload image error:', error);
      throw error;
    }
  }

  async getFileUrl(bucket, fileName) {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/file/${bucket}/${fileName}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get file URL');
      }

      const result = await response.json();
      return result.signedUrl;
    } catch (error) {
      console.error('Get file URL error:', error);
      throw error;
    }
  }

  // Analytics
  async getAnalyticsOverview() {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/analytics/overview`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch analytics');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }

  async getDoctorAnalytics(doctorId) {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/analytics/doctor/${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch doctor analytics');
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Get doctor analytics error:', error);
      throw error;
    }
  }

  // Real-time subscriptions
  async setupRealtimeSubscription(table, callback) {
    try {
      const subscription = this.supabase
        .channel(`realtime-${table}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: table
        }, callback)
        .subscribe();

      return subscription;
    } catch (error) {
      console.error('Realtime subscription error:', error);
      throw error;
    }
  }

  // Utility methods
  getCurrentUser() {
    return this.currentUser;
  }

  getUserProfile() {
    return this.userProfile;
  }

  getAuthToken() {
    return this.authToken;
  }

  isAuthenticated() {
    return !!this.authToken && !!this.currentUser;
  }

  hasRole(role) {
    return this.userProfile?.role === role;
  }

  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Health check error:', error);
      return { status: 'error', error: error.message };
    }
  }
}

export const supabaseService = new SupabaseService();