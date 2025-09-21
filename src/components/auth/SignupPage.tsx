import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Eye, EyeOff, UserPlus, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function SignupPage({ onSignup, onNavigate }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    phone: '',
    dateOfBirth: '',
    specialty: '',
    department: '',
    subSpecialty: '',
    licenseNumber: '',
    hospitalAffiliation: '',
    yearsExperience: '',
    education: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        specialty: formData.role === 'doctor' ? formData.specialty : undefined,
        department: formData.role === 'doctor' ? formData.department : undefined,
        subSpecialty: formData.role === 'doctor' ? formData.subSpecialty : undefined,
        licenseNumber: formData.role === 'doctor' ? formData.licenseNumber : undefined,
        hospitalAffiliation: formData.role === 'doctor' ? formData.hospitalAffiliation : undefined,
        yearsExperience: formData.role === 'doctor' ? parseInt(formData.yearsExperience) : undefined,
        education: formData.role === 'doctor' ? formData.education : undefined
      };

      const result = await onSignup(userData);
      
      if (result.success) {
        setSuccess('Account created successfully! You can now sign in.');
        setTimeout(() => {
          onNavigate('login');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-medical-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-medical-blue">Create Account</CardTitle>
          <CardDescription>
            Join the Retinal-AI platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                disabled={isLoading}
              />
            </div>

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
              <Label htmlFor="role">Account Type</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.role === 'doctor' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Medical Specialty</Label>
                    <Select value={formData.specialty} onValueChange={(value) => setFormData({...formData, specialty: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                        <SelectItem value="Retina Specialist">Retina Specialist</SelectItem>
                        <SelectItem value="Glaucoma Specialist">Glaucoma Specialist</SelectItem>
                        <SelectItem value="Cornea Specialist">Cornea Specialist</SelectItem>
                        <SelectItem value="Pediatric Ophthalmology">Pediatric Ophthalmology</SelectItem>
                        <SelectItem value="Oculoplastics">Oculoplastics</SelectItem>
                        <SelectItem value="Neuro-Ophthalmology">Neuro-Ophthalmology</SelectItem>
                        <SelectItem value="General Ophthalmology">General Ophthalmology</SelectItem>
                        <SelectItem value="Vitreoretinal Surgery">Vitreoretinal Surgery</SelectItem>
                        <SelectItem value="Cataract Surgery">Cataract Surgery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Retinal Diseases">Retinal Diseases</SelectItem>
                        <SelectItem value="Glaucoma Care">Glaucoma Care</SelectItem>
                        <SelectItem value="Cataract Surgery">Cataract Surgery</SelectItem>
                        <SelectItem value="Corneal Disorders">Corneal Disorders</SelectItem>
                        <SelectItem value="Pediatric Eye Care">Pediatric Eye Care</SelectItem>
                        <SelectItem value="Emergency Eye Care">Emergency Eye Care</SelectItem>
                        <SelectItem value="Comprehensive Eye Care">Comprehensive Eye Care</SelectItem>
                        <SelectItem value="Surgical Services">Surgical Services</SelectItem>
                        <SelectItem value="Low Vision Services">Low Vision Services</SelectItem>
                        <SelectItem value="Research & Development">Research & Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="subSpecialty">Sub-Specialty (Optional)</Label>
                    <Input
                      id="subSpecialty"
                      type="text"
                      placeholder="e.g., Diabetic Retinopathy"
                      value={formData.subSpecialty}
                      onChange={(e) => setFormData({...formData, subSpecialty: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      placeholder="Years in practice"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({...formData, yearsExperience: e.target.value})}
                      disabled={isLoading}
                      min="0"
                      max="50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    type="text"
                    placeholder="Medical school and residency"
                    value={formData.education}
                    onChange={(e) => setFormData({...formData, education: e.target.value})}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      type="text"
                      placeholder="Medical license number"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hospitalAffiliation">Hospital/Clinic</Label>
                    <Input
                      id="hospitalAffiliation"
                      type="text"
                      placeholder="Hospital or clinic name"
                      value={formData.hospitalAffiliation}
                      onChange={(e) => setFormData({...formData, hospitalAffiliation: e.target.value})}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-medical-blue"
                onClick={() => onNavigate('login')}
              >
                Sign in here
              </Button>
            </p>
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto text-muted-foreground"
              onClick={() => onNavigate('landing')}
            >
              ← Back to home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}