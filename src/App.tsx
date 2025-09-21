import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Alert, AlertDescription } from './components/ui/alert';
import { 
  Brain, 
  Eye, 
  Users, 
  Activity, 
  User, 
  Database,
  Cloud,
  Shield,
  CheckCircle,
  RefreshCw,
  Stethoscope,
  Volume2
} from 'lucide-react';

// Import components
import ErrorBoundary from './components/ErrorBoundary';
import PlaceholderPage from './components/PlaceholderPage';
import LandingPage from './components/LandingPage';
import LoginPage from './components/auth/LoginPage';
import SignupPage from './components/auth/SignupPage';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import PatientDashboard from './components/patient/PatientDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import FundusAnalysis from './components/doctor/FundusAnalysis';
import DoctorDirectory from './components/DoctorDirectory';
import AboutPage from './components/pages/AboutPage';
import FeaturesPage from './components/pages/FeaturesPage';
import AIAssistantPage from './components/pages/AIAssistantPage';

// Import services
import { authService } from './services/authService';
import { mongodbService } from './services/mongodbService';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('landing');
  const [isAuthInitialized, setIsAuthInitialized] = useState(false);
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setIsLoading(true);
      
      // Wait for auth service to initialize with timeout
      let attempts = 0;
      const maxAttempts = 50; // 5 seconds max wait
      
      while (!authService.isInitialized && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!authService.isInitialized) {
        console.warn('Auth service initialization timeout, continuing with limited functionality');
      }
      
      // Check authentication status
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setIsAuthInitialized(true);
      
      // Wait for MongoDB service to initialize
      attempts = 0;
      while (!mongodbService.isInitialized && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      // Check MongoDB backend connection
      setTimeout(async () => {
        try {
          // Don't check health if we're still initializing
          if (!mongodbService.isInitialized) {
            setBackendStatus({ status: 'error', message: 'MongoDB service not initialized' });
            return;
          }

          // Quick health check with short timeout
          const health = await mongodbService.checkHealth();
          
          if (health?.status === 'healthy' || health?.status === 'ok') {
            setBackendStatus({ status: 'healthy', message: 'Backend connected' });
          } else {
            setBackendStatus({ status: 'error', message: 'Backend unavailable' });
          }
        } catch (error) {
          console.error('Health check failed:', error.message);
          setBackendStatus({ status: 'error', message: 'Backend connection failed' });
        }
      }, 1000);

      // Set up auth state listener
      authService.onAuthChange((newUser, isAuthenticated) => {
        setUser(newUser);
        if (isAuthenticated && newUser) {
          // Navigate based on user role
          if (newUser.role === 'doctor') {
            setCurrentPage('doctor');
          } else if (newUser.role === 'patient') {
            setCurrentPage('patient');
          } else if (newUser.role === 'admin') {
            setCurrentPage('admin');
          }
        } else {
          setCurrentPage('landing');
        }
      });

      console.log('App initialized successfully');
      
    } catch (error) {
      console.error('App initialization error:', error);
      // Set a fallback status so the app can still function
      setBackendStatus({ status: 'error', error: 'Initialization failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const result = await authService.login(email, password);
      
      if (result.success) {
        console.log('Login successful:', result.user);
        return { success: true };
      } else {
        console.error('Login failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Login exception:', error);
      return { success: false, error: error.message };
    }
  };

  const handleSignup = async (userData) => {
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        console.log('Registration successful');
        return { success: true, message: result.message };
      } else {
        console.error('Registration failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Registration exception:', error);
      return { success: false, error: error.message };
    }
  };

  const handleLogout = async () => {
    try {
      const result = await authService.logout();
      
      if (result.success) {
        console.log('Logout successful');
        setUser(null);
        setCurrentPage('landing');
      } else {
        console.error('Logout failed:', result.error);
      }
    } catch (error) {
      console.error('Logout exception:', error);
    }
  };

  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-medical-blue rounded-full flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-white animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-medical-blue mb-2">Initializing Retinal-AI</h2>
            <p className="text-muted-foreground">Loading AI models and MongoDB backend...</p>
          </div>
          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Database className="w-4 h-4 mr-1" />
              MongoDB
            </div>
            <div className="flex items-center">
              <Brain className="w-4 h-4 mr-1" />
              AI Models
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              Authentication
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Status header for authenticated users
  const StatusHeader = () => (
    <div className="bg-medical-blue-lighter border-b border-medical-blue-light p-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-medical-blue" />
            <span className="font-semibold text-medical-blue">Retinal-AI Platform</span>
          </div>
          {user && (
            <Badge variant="outline" className="bg-health-green-lighter text-health-green">
              <User className="w-3 h-3 mr-1" />
              {user.role} - {user.name}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {backendStatus?.status === 'healthy' ? (
            <Badge variant="outline" className="bg-health-green-lighter text-health-green">
              <CheckCircle className="w-3 h-3 mr-1" />
              Backend Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-accent-red-lighter text-accent-red">
              <Database className="w-3 h-3 mr-1" />
              Backend Offline
            </Badge>
          )}
          
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Volume2 className="w-3 h-3 mr-1" />
            Voice Ready
          </Badge>
          
          {user && (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Main content rendering
  const renderContent = () => {
    // Show appropriate content based on current page and user state
    switch (currentPage) {
      case 'landing':
        return (
          <LandingPage 
            onNavigate={navigateTo}
            isAuthenticated={!!user}
            user={user}
          />
        );

      case 'login':
        return (
          <LoginPage 
            onLogin={handleLogin}
            onNavigate={navigateTo}
          />
        );

      case 'signup':
        return (
          <SignupPage 
            onSignup={handleSignup}
            onNavigate={navigateTo}
          />
        );

      case 'doctor':
        if (!user || user.role !== 'doctor') {
          // Redirect to login using state navigation
          setCurrentPage('login');
          return null;
        }
        return (
          <div>
            <StatusHeader />
            <div className="max-w-7xl mx-auto px-4 py-6">
              <FundusAnalysis user={user} />
            </div>
          </div>
        );

      case 'patient':
        if (!user || user.role !== 'patient') {
          // Redirect to login using state navigation
          setCurrentPage('login');
          return null;
        }
        return (
          <div>
            <StatusHeader />
            <div className="max-w-7xl mx-auto px-4 py-6">
              <PatientDashboard user={user} />
            </div>
          </div>
        );

      case 'admin':
        if (!user || user.role !== 'admin') {
          // Redirect to login using state navigation
          setCurrentPage('login');
          return null;
        }
        return (
          <div>
            <StatusHeader />
            <div className="max-w-7xl mx-auto px-4 py-6">
              <AdminDashboard user={user} />
            </div>
          </div>
        );

      case 'about':
        return (
          <AboutPage 
            onNavigate={navigateTo}
            user={user}
          />
        );

      case 'features':
        return (
          <FeaturesPage 
            onNavigate={navigateTo}
            user={user}
          />
        );

      case 'chatbot':
        return (
          <AIAssistantPage 
            onNavigate={navigateTo}
            user={user}
          />
        );

      case 'doctors':
        return (
          <div>
            <StatusHeader />
            <div className="max-w-7xl mx-auto px-4 py-6">
              <DoctorDirectory user={user} onNavigate={navigateTo} />
            </div>
          </div>
        );

      case 'education':
      case 'contact':
        return (
          <PlaceholderPage 
            title={`${currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} Page`}
            onNavigate={navigateTo}
            user={user}
          />
        );

      default:
        return (
          <LandingPage 
            onNavigate={navigateTo}
            isAuthenticated={!!user}
            user={user}
          />
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        {renderContent()}
        
        {/* Backend Status Alerts */}
        {backendStatus?.status === 'error' && currentPage !== 'landing' && (
          <div className="fixed bottom-4 right-4 max-w-sm">
            <Alert variant="destructive">
              <Database className="h-4 w-4" />
              <AlertDescription>
                <strong>MongoDB Backend Offline</strong><br/>
                Please start the MongoDB server using the provided scripts and refresh the page.
                <div className="mt-2 text-xs">
                  Run: <code>npm run dev</code> in the backend folder
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}
        
        {/* Success notification for MongoDB backend connection */}
        {backendStatus?.status === 'healthy' && currentPage !== 'landing' && (
          <div className="fixed bottom-4 right-4 max-w-sm">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                ✨ MongoDB backend connected! Real-time sync enabled with voice consultations.
              </AlertDescription>
            </Alert>
          </div>
        )}


      </div>
    </ErrorBoundary>
  );
}

export default App;