// Environment configuration for Retinal-AI Platform
// This file handles environment variables safely in both development and production

class EnvironmentConfig {
  constructor() {
    // Initialize configuration
    this.config = this.initializeConfig();
  }

  initializeConfig() {
    // Default configuration
    const defaults = {
      API_URL: 'http://localhost:3001/api',
      APP_ENV: 'development',
      APP_NAME: 'Retinal-AI',
      VERSION: '1.0.0'
    };

    // Try to get environment variables safely
    const envConfig = {};
    
    // Check if we're in Node.js environment (should not be the case for frontend)
    // Only access process.env if it exists and we're sure we're in the right environment
    try {
      if (typeof process !== 'undefined' && process?.env) {
        // Map process.env variables
        envConfig.API_URL = process.env.REACT_APP_API_URL;
        envConfig.APP_ENV = process.env.NODE_ENV;
        envConfig.VERSION = process.env.REACT_APP_VERSION;
      }
    } catch (error) {
      // Ignore process.env access errors in browser environment
      console.warn('Process environment not available, using defaults');
    }

    // Try Vite environment variables (for Vite-based builds)
    try {
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        envConfig.API_URL = import.meta.env.VITE_API_URL;
        envConfig.APP_ENV = import.meta.env.MODE;
        envConfig.VERSION = import.meta.env.VITE_VERSION;
      }
    } catch (error) {
      // Ignore import.meta errors in non-Vite environments
    }

    // Check for window-based environment variables (injected by build process)
    if (typeof window !== 'undefined' && window._env_) {
      Object.assign(envConfig, window._env_);
    }

    // Merge defaults with environment config
    return {
      ...defaults,
      ...Object.fromEntries(
        Object.entries(envConfig).filter(([key, value]) => value !== undefined)
      )
    };
  }

  get(key) {
    return this.config[key];
  }

  getApiUrl() {
    return this.get('API_URL');
  }

  getEnvironment() {
    return this.get('APP_ENV');
  }

  isProduction() {
    return this.getEnvironment() === 'production';
  }

  isDevelopment() {
    return this.getEnvironment() === 'development';
  }

  // Method to update configuration at runtime if needed
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Export singleton instance
export const env = new EnvironmentConfig();
export default env;