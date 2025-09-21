// MySQL API Service for Retinal-AI Platform (Browser-compatible)
// This service communicates with the backend API instead of connecting directly to MySQL
import { env } from '../config/environment.js';

class MySQLService {
  constructor() {
    // Use environment config with safe fallbacks
    this.baseUrl = env.getApiUrl();
    this.currentUser = null;
    this.userProfile = null;
    this.authToken = null;
    this.isInitialized = false;
    
    // Initialize authentication on construction
    this.initializeAuth();
  }

  async initializeDatabase() {
    try {
      // In browser environment, we don't create direct database connections
      // Instead, we verify the backend API is accessible
      const response = await fetch(`${this.baseUrl}/health`);
      if (response.ok) {
        console.log('Backend API connection verified');
        this.isInitialized = true;
      } else {
        throw new Error('Backend API not accessible');
      }
    } catch (error) {
      console.error('Backend API verification error:', error);
      this.isInitialized = false;
    }
  }

  async initializeAuth() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        console.warn('Running in non-browser environment, skipping localStorage auth');
        return;
      }

      const token = localStorage.getItem('retinal_ai_token');
      const user = localStorage.getItem('retinal_ai_user');
      
      if (token && user) {
        this.authToken = token;
        this.currentUser = JSON.parse(user);
        
        // Verify backend is available before fetching profile
        await this.initializeDatabase();
        
        if (this.isInitialized) {
          try {
            await this.fetchUserProfile();
          } catch (error) {
            console.warn('Failed to fetch user profile on init:', error);
            // Don't throw error, just log warning
          }
        }
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.isInitialized = true; // Set to true anyway to prevent blocking
    }
  }

  // Authentication Methods
  async signUp(userData) {
    try {
      // Add timeout for network requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${this.baseUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          name: userData.name,
          role: userData.role || 'patient',
          phone: userData.phone,
          dateOfBirth: userData.dateOfBirth,
          medicalRecordNumber: userData.medicalRecordNumber,
          specialty: userData.specialty,
          licenseNumber: userData.licenseNumber,
          hospitalAffiliation: userData.hospitalAffiliation
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Signup failed');
      }

      return { user: result.user, error: null };
    } catch (error) {
      console.error('Signup error:', error);
      
      // Return specific error messages for different failure types
      if (error.name === 'AbortError') {
        return { user: null, error: 'Connection timeout - Failed to fetch' };
      } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
        return { user: null, error: 'Network error - Failed to fetch' };
      } else {
        return { user: null, error: error.message };
      }
    }
  }

  async signIn(email, password) {
    try {
      // Add timeout for network requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`${this.baseUrl}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Sign in failed');
      }

      this.authToken = result.token;
      this.currentUser = result.user;
      
      // Store in localStorage for persistence
      localStorage.setItem('retinal_ai_token', result.token);
      localStorage.setItem('retinal_ai_user', JSON.stringify(result.user));
      
      await this.fetchUserProfile();

      return { user: result.user, session: { access_token: result.token }, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Return specific error messages for different failure types
      if (error.name === 'AbortError') {
        return { user: null, session: null, error: 'Connection timeout - Failed to fetch' };
      } else if (error.message.includes('Failed to fetch') || error.message.includes('fetch')) {
        return { user: null, session: null, error: 'Network error - Failed to fetch' };
      } else {
        return { user: null, session: null, error: error.message };
      }
    }
  }

  async signOut() {
    try {
      const response = await fetch(`${this.baseUrl}/auth/signout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      this.authToken = null;
      this.currentUser = null;
      this.userProfile = null;
      
      // Clear localStorage
      localStorage.removeItem('retinal_ai_token');
      localStorage.removeItem('retinal_ai_user');

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

  async createPatient(patientData) {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/patients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify(patientData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create patient');
      }

      const result = await response.json();
      return result.patient;
    } catch (error) {
      console.error('Create patient error:', error);
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

  async getAnalysisByPatient(patientId) {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/analysis/patient/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch patient analyses');
      }

      const result = await response.json();
      return result.analyses;
    } catch (error) {
      console.error('Get patient analyses error:', error);
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

  async getFileUrl(fileName) {
    if (!this.authToken) {
      throw new Error('Authentication required');
    }

    try {
      const response = await fetch(`${this.baseUrl}/files/${fileName}`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get file URL');
      }

      const result = await response.json();
      return result.url;
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

  // Health check with timeout and graceful error handling
  async checkHealth() {
    try {
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result?.status ? result : { status: 'unknown', message: 'Invalid response format' };
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Health check timed out');
        return { status: 'timeout', message: 'Connection timeout' };
      } else if (error.message.includes('fetch')) {
        console.warn('Health check network error:', error.message);
        return { status: 'network_error', message: 'Cannot connect to backend' };
      } else {
        console.warn('Health check error:', error.message);
        return { status: 'error', error: error.message };
      }
    }
  }

  // Real-time functionality (using WebSockets or Server-Sent Events)
  async setupRealtimeSubscription(table, callback) {
    try {
      // Check if WebSocket is available in browser
      if (typeof WebSocket === 'undefined') {
        console.warn('WebSocket not available in this environment');
        return { unsubscribe: () => {} };
      }

      // WebSocket connection for real-time updates
      const wsUrl = this.baseUrl.replace('http', 'ws').replace('https', 'wss') + `/realtime/${table}`;
      
      // Note: WebSocket constructor doesn't support headers in browser
      // Authorization should be handled via query params or connection protocol
      const ws = new WebSocket(`${wsUrl}?token=${encodeURIComponent(this.authToken || '')}`);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onopen = () => {
        console.log(`Connected to realtime updates for ${table}`);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = (event) => {
        console.log(`WebSocket closed for ${table}:`, event.code, event.reason);
      };

      return {
        unsubscribe: () => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.close();
          }
        }
      };
    } catch (error) {
      console.error('Realtime subscription error:', error);
      throw error;
    }
  }
}

export const mysqlService = new MySQLService();