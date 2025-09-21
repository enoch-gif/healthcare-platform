import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <AlertTriangle className="w-16 h-16 mx-auto text-accent-red mb-4" />
              <CardTitle className="text-medical-blue">Application Error</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Something went wrong while loading the application. This might be due to a 
                  missing backend connection or browser compatibility issues.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full bg-medical-blue hover:bg-medical-blue-light text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Application
                </Button>
                <Button 
                  onClick={() => this.setState({ hasError: false, error: null })}
                  variant="outline" 
                  className="w-full"
                >
                  Try Again
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                <p><strong>Troubleshooting:</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Try refreshing the page</li>
                  <li>Clear your browser cache</li>
                  <li>Ensure you have a stable internet connection</li>
                  <li>Check if the backend server is running</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;