
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Mail, Lock, User, Building, Phone, Globe, MapPin, Briefcase } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
}

const COUNTRIES = [
  { code: 'us', name: 'United States', flag: '🇺🇸' },
  { code: 'gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'au', name: 'Australia', flag: '🇦🇺' },
  { code: 'de', name: 'Germany', flag: '🇩🇪' },
  { code: 'fr', name: 'France', flag: '🇫🇷' },
  { code: 'es', name: 'Spain', flag: '🇪🇸' },
  { code: 'it', name: 'Italy', flag: '🇮🇹' },
  { code: 'nl', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'ch', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'se', name: 'Sweden', flag: '🇸🇪' },
  { code: 'no', name: 'Norway', flag: '🇳🇴' },
  { code: 'dk', name: 'Denmark', flag: '🇩🇰' },
  { code: 'fi', name: 'Finland', flag: '🇫🇮' },
  { code: 'jp', name: 'Japan', flag: '🇯🇵' },
  { code: 'kr', name: 'South Korea', flag: '🇰🇷' },
  { code: 'sg', name: 'Singapore', flag: '🇸🇬' },
  { code: 'hk', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'ae', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'il', name: 'Israel', flag: '🇮🇱' },
  // Add more countries as needed
];

const BUSINESS_TYPES = [
  { value: 'cryptocurrency-exchange', label: 'Cryptocurrency Exchange' },
  { value: 'payment-processor', label: 'Payment Processor' },
  { value: 'digital-wallet-provider', label: 'Digital Wallet Provider' },
  { value: 'defi-protocol', label: 'DeFi Protocol' },
  { value: 'banking-institution', label: 'Banking Institution' },
  { value: 'fintech-startup', label: 'Fintech Startup' },
  { value: 'compliance-firm', label: 'Compliance Firm' },
  { value: 'other', label: 'Other' }
];

const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA' },
  { code: '+44', country: 'UK' },
  { code: '+49', country: 'DE' },
  { code: '+33', country: 'FR' },
  { code: '+34', country: 'ES' },
  { code: '+39', country: 'IT' },
  { code: '+31', country: 'NL' },
  { code: '+41', country: 'CH' },
  { code: '+46', country: 'SE' },
  { code: '+47', country: 'NO' },
  { code: '+45', country: 'DK' },
  { code: '+358', country: 'FI' },
  { code: '+81', country: 'JP' },
  { code: '+82', country: 'KR' },
  { code: '+65', country: 'SG' },
  { code: '+852', country: 'HK' },
  { code: '+971', country: 'AE' },
  { code: '+972', country: 'IL' },
];

const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [website, setWebsite] = useState('');

  const validateWebsite = (url: string) => {
    if (!url) return true; // Optional field
    return url.startsWith('https://') || url.startsWith('http://www.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'signup') {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      
      if (website && !validateWebsite(website)) {
        toast.error('Website must start with https:// or www.');
        return;
      }
      
      if (!firstName || !lastName || !companyName || !jobTitle || !phoneNumber || !country || !businessType) {
        toast.error('Please fill in all required fields');
        return;
      }
    }

    setLoading(true);
    
    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Welcome back!');
      } else {
        const fullPhone = `${countryCode}${phoneNumber}`;
        const { error } = await signUp(email, password, {
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
          job_title: jobTitle,
          phone: fullPhone,
          country: country,
          business_type: businessType,
          website: website || null
        });
        if (error) throw error;
        toast.success('Account created successfully! Please check your email to verify your account.');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {mode === 'signin' 
            ? 'Sign in to access your API dashboard'
            : 'Get started with our AML-compliant relay API'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              {/* Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Company & Job Title Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Enter your company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Job Title *
                  </Label>
                  <Input
                    id="jobTitle"
                    type="text"
                    placeholder="Enter your job title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    required
                  />
                </div>
              </div>
            </>
          )}

          {/* Email Row */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {mode === 'signup' && (
            <>
              {/* Phone Number Row */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number *
                </Label>
                <div className="flex gap-2">
                  <Select value={countryCode} onValueChange={setCountryCode}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_CODES.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.code} ({item.country})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1"
                    required
                  />
                </div>
              </div>

              {/* Country & Business Type Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Country *
                  </Label>
                  <Select value={country} onValueChange={setCountry} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Business Type *
                  </Label>
                  <Select value={businessType} onValueChange={setBusinessType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Website Row */}
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Website (Optional)
                </Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://yourcompany.com or www.yourcompany.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Must start with https:// or www.
                </p>
              </div>
            </>
          )}

          {/* Password Row */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Password *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Confirm Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : (mode === 'signin' ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={onToggleMode}
              className="text-primary hover:underline font-medium"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;
