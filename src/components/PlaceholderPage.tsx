import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  ArrowLeft,
  Construction,
  Eye,
  Lightbulb
} from 'lucide-react';

const PlaceholderPage = ({ title, onNavigate, user }) => {
  const handleGoBack = () => {
    if (user?.role === 'doctor') {
      onNavigate('doctor');
    } else if (user?.role === 'admin') {
      onNavigate('admin');
    } else if (user?.role === 'patient') {
      onNavigate('patient');
    } else {
      onNavigate('landing');
    }
  };

  return (
    <div className="min-h-screen bg-medical-gradient flex items-center justify-center p-4">
      <Card className="max-w-md w-full medical-shadow">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-medical-blue-lighter rounded-full">
            <Construction className="w-8 h-8 text-medical-blue" />
          </div>
          <CardTitle className="text-medical-blue">
            {title || 'Page Under Construction'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span className="text-sm">Retinal-AI Platform</span>
            </div>
            <p className="text-muted-foreground">
              This section is currently being developed. We're working hard to bring you 
              more advanced features for better eye care management.
            </p>
          </div>

          <div className="bg-health-green-lighter p-4 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-health-green mb-2">
              <Lightbulb className="w-4 h-4" />
              <span className="font-medium text-sm">Coming Soon</span>
            </div>
            <ul className="text-sm text-health-green space-y-1">
              <li>• Enhanced AI diagnostics</li>
              <li>• Real-time collaboration tools</li>
              <li>• Advanced reporting features</li>
              <li>• Integration with medical devices</li>
            </ul>
          </div>

          <Button 
            onClick={handleGoBack}
            className="w-full bg-medical-blue hover:bg-medical-blue-light text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;