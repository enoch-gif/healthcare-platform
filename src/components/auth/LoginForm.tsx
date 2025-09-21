import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  Loader2, 
  User, 
  Stethoscope, 
  Shield,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { authService } from '../../services/authService';

export default function LoginForm({ onLogin, onSwitchToSignup }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.signIn(formData.email, formData.password);
      
      if (result.success) {
        onLogin(result.user);
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (account) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await authService.signIn(account.email, account.password);
      
      if (result.success) {
        onLogin(result.user);
      }
    } catch (error) {
      console.error('Demo login error:', error);
      setError('Demo account login failed. Creating demo accounts...');
      
      // Try to create demo accounts if they don't exist
      try {
        await authService.createDemoAccounts();
        // Retry login
        const retryResult = await authService.signIn(account.email, account.password);
        if (retryResult.success) {
          onLogin(retryResult.user);
        }
      } catch (createError) {
        setError('Failed to initialize demo accounts. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = authService.getDemoAccounts();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-medical-blue">Sign In</CardTitle>
        <CardDescription>
          Access your Retinal-AI account with Supabase authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-medical-blue hover:bg-medical-blue-light"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
        </form>

        <Separator />

        {/* Demo Accounts Section */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
          >
            <Info className="mr-2 h-4 w-4" />
            {showDemoAccounts ? 'Hide' : 'Show'} Demo Accounts
          </Button>

          {showDemoAccounts && (
            <div className="space-y-3 p-4 bg-medical-blue-lighter rounded-lg">
              <p className="text-sm text-medical-blue font-medium">
                Try Retinal-AI with demo accounts:
              </p>
              
              {demoAccounts.map((account, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div className="flex items-center space-x-3">
                    {account.role === 'admin' && <Shield className="w-4 h-4 text-medical-blue" />}
                    {account.role === 'doctor' && <Stethoscope className="w-4 h-4 text-health-green" />}
                    {account.role === 'patient' && <User className="w-4 h-4 text-accent-red" />}
                    
                    <div>
                      <p className="text-sm font-medium">{account.name}</p>
                      <p className="text-xs text-muted-foreground">{account.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant="outline" 
                      className={
                        account.role === 'admin' ? 'text-medical-blue border-medical-blue' :
                        account.role === 'doctor' ? 'text-health-green border-health-green' :
                        'text-accent-red border-accent-red'
                      }
                    >
                      {account.role}
                    </Badge>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDemoLogin(account)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        'Login'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Demo accounts are automatically created with Supabase authentication. 
                  Each role provides different access levels and features.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-medical-blue"
              onClick={onSwitchToSignup}
            >
              Sign up here
            </Button>
          </p>
        </div>

        {/* Supabase Integration Badge */}
        <div className="text-center pt-4 border-t">
          <Badge variant="outline" className="bg-health-green-lighter text-health-green">
            <CheckCircle className="w-3 h-3 mr-1" />
            Powered by Supabase
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}