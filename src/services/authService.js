// Authentication Service for Retinal-AI Platform (MongoDB Backend)
import { mongodbService } from './mongodbService';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.currentSession = null;
    this.isInitialized = false;
    this.authCallbacks = [];
    
    // Initialize auth state
    this.initializeAuth();
  }

  async initializeAuth() {
    try {
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        console.warn('Running in non-browser environment, skipping localStorage auth');
        this.isInitialized = true;
        return;
      }

      // Check for stored session
      const storedToken = localStorage.getItem('retinal_ai_token');
      const storedUser = localStorage.getItem('retinal_ai_user');
      
      if (storedToken && storedUser) {
        try {
          this.currentUser = JSON.parse(storedUser);
          this.currentSession = { access_token: storedToken };
          
          // Don't validate session during initial load to prevent blocking
          // The session will be validated when needed
        } catch (error) {
          console.error('Session restoration failed:', error);
          this.clearSession();
        }
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Auth initialization error:', error);
      this.isInitialized = true;
    }
  }

  async validateSession() {
    try {
      const profile = await mongodbService.fetchUserProfile();
      if (profile) {
        this.currentUser = { ...this.currentUser, ...profile };
        return true;
      } else {
        this.clearSession();
        return false;
      }
    } catch (error) {
      this.clearSession();
      return false;
    }
  }

  clearSession() {
    this.currentUser = null;
    this.currentSession = null;
    
    // Check if localStorage is available
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('retinal_ai_token');
      localStorage.removeItem('retinal_ai_user');

    }
  }

  async signUp(userData) {
    try {
      // Attempt MongoDB backend signup
      const result = await mongodbService.signUp(userData);
      
      if (result.error) {
        throw new Error(result.error);
      }

      return {
        success: true,
        user: result.user,
        message: 'Registration successful. Please sign in with your credentials.'
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(`Signup failed: ${error.message}`);
    }
  }

  async signIn(email, password) {
    try {
      // Attempt MongoDB backend login
      const result = await mongodbService.signIn(email, password);
      
      if (result.error) {
        throw new Error(result.error);
      }

      this.currentSession = result.session;
      this.currentUser = result.user;

      // Store session in localStorage for persistence
      localStorage.setItem('retinal_ai_token', result.session.access_token);
      localStorage.setItem('retinal_ai_user', JSON.stringify(result.user));

      // Fetch complete user profile
      try {
        const profile = await mongodbService.fetchUserProfile();
        if (profile) {
          this.currentUser = { ...this.currentUser, ...profile };
        }
      } catch (profileError) {
        console.warn('Could not fetch user profile:', profileError);
      }

      this.notifyAuthChange();

      return { user: this.currentUser, session: result.session };
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error(`Sign in failed: ${error.message}`);
    }
  }

  async signOut() {
    try {
      // Call backend signout
      await mongodbService.signOut();
      
      // Clear local state
      this.clearSession();
      this.notifyAuthChange();
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if backend call fails, clear local session
      this.clearSession();
      this.notifyAuthChange();
      return { success: true };
    }
  }

  // Auth state management methods
  async login(email, password) {
    try {
      const result = await this.signIn(email, password);
      return {
        success: true,
        user: result.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async register(userData) {
    try {
      const result = await this.signUp(userData);
      return {
        success: true,
        user: result.user,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async logout() {
    try {
      await this.signOut();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  getCurrentUser() {
    // Try to get from memory first
    if (this.currentUser) {
      return this.currentUser;
    }

    // Check if localStorage is available
    if (typeof localStorage === 'undefined') {
      return null;
    }

    // Try to restore from localStorage
    const storedUser = localStorage.getItem('retinal_ai_user');
    const storedToken = localStorage.getItem('retinal_ai_token');
    
    if (storedUser && storedToken) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.currentSession = { access_token: storedToken };
        return this.currentUser;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.clearSession();
      }
    }

    return null;
  }

  getAccessToken() {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('retinal_ai_token');
      return token || this.currentSession?.access_token;
    }
    return this.currentSession?.access_token;
  }

  isAuthenticated() {
    return !!this.getCurrentUser() && !!this.getAccessToken();
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Auth change listeners
  onAuthChange(callback) {
    this.authCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.authCallbacks = this.authCallbacks.filter(cb => cb !== callback);
    };
  }

  notifyAuthChange() {
    this.authCallbacks.forEach(callback => {
      try {
        callback(this.currentUser, this.isAuthenticated());
      } catch (error) {
        console.error('Auth callback error:', error);
      }
    });
  }



  // Utility methods for form validation
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password) {
    return password && password.length >= 6;
  }

  validateUserData(userData) {
    const errors = [];

    if (!userData.email || !this.validateEmail(userData.email)) {
      errors.push('Valid email is required');
    }

    if (!userData.password || !this.validatePassword(userData.password)) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (userData.role === 'doctor') {
      if (!userData.specialty) {
        errors.push('Medical specialty is required for doctors');
      }
      if (!userData.licenseNumber) {
        errors.push('License number is required for doctors');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const authService = new AuthService();