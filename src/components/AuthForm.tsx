
import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password);
        if (!result.error) {
          setSuccess('Account created successfully! Please check your email to verify your account.');
        }
      } else {
        result = await signIn(email, password);
        if (!result.error) {
          navigate('/dashboard');
        }
      }

      if (result.error) {
        if (result.error.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before signing in.');
        } else if (result.error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (result.error.message.includes('User already registered')) {
          setError('An account with this email already exists. Try signing in instead.');
        } else {
          setError(result.error.message || 'An error occurred. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setFirstName('');
    setLastName('');
    setUsername('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="flex flex-col items-center justify-center gap-8">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">Superlist</span>
        </div>

        {/* Switch */}
        <div className="relative flex flex-col justify-center items-center gap-8 w-12 h-5 -translate-y-48">
          <label className="switch relative cursor-pointer">
            <input 
              type="checkbox" 
              className="toggle opacity-0 w-0 h-0"
              checked={isSignUp}
              onChange={handleToggle}
            />
            <span className="slider absolute top-0 left-0 right-0 bottom-0 bg-background border-2 border-foreground rounded-md shadow-[4px_4px_0_hsl(var(--foreground))] transition-all duration-300 before:content-[''] before:absolute before:h-5 before:w-5 before:left-[-2px] before:bottom-0.5 before:bg-background before:border-2 before:border-foreground before:rounded-md before:shadow-[0_3px_0_hsl(var(--foreground))] before:transition-all before:duration-300"></span>
            <span className="card-side before:content-['Log_in'] before:absolute before:left-[-70px] before:top-0 before:w-[100px] before:underline before:text-foreground before:font-semibold after:content-['Sign_up'] after:absolute after:left-[70px] after:top-0 after:w-[100px] after:no-underline after:text-foreground after:font-semibold"></span>
            
            {/* Flip Card */}
            <div className={`flip-card__inner w-[300px] h-[400px] relative bg-transparent transition-transform duration-700 preserve-3d ${isSignUp ? 'rotate-y-180' : ''}`}>
              {/* Front - Login */}
              <div className="flip-card__front absolute w-full h-full p-5 flex flex-col justify-center backface-hidden bg-background gap-5 rounded-md border-2 border-foreground shadow-[4px_4px_0_hsl(var(--foreground))]">
                <div className="title my-5 text-2xl font-black text-center text-foreground">
                  Log in
                </div>
                <form onSubmit={handleSubmit} className="flip-card__form flex flex-col items-center gap-5">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="flip-card__input w-[250px] h-10 rounded-md border-2 border-foreground bg-background shadow-[4px_4px_0_hsl(var(--foreground))] text-base font-semibold text-foreground px-2.5 py-1 outline-none placeholder:text-muted-foreground placeholder:opacity-80 focus:border-primary"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="flip-card__input w-[250px] h-10 rounded-md border-2 border-foreground bg-background shadow-[4px_4px_0_hsl(var(--foreground))] text-base font-semibold text-foreground px-2.5 py-1 outline-none placeholder:text-muted-foreground placeholder:opacity-80 focus:border-primary"
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flip-card__btn my-5 w-[120px] h-10 rounded-md border-2 border-foreground bg-background shadow-[4px_4px_0_hsl(var(--foreground))] text-base font-semibold text-foreground cursor-pointer active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                  >
                    {loading ? 'Processing...' : "Let's go!"}
                  </button>
                </form>
              </div>

              {/* Back - Sign Up */}
              <div className="flip-card__back absolute w-full h-full p-5 flex flex-col justify-center backface-hidden bg-background gap-5 rounded-md border-2 border-foreground shadow-[4px_4px_0_hsl(var(--foreground))] rotate-y-180">
                <div className="title my-5 text-2xl font-black text-center text-foreground">
                  Sign up
                </div>
                <form onSubmit={handleSubmit} className="flip-card__form flex flex-col items-center gap-5">
                  <input
                    type="text"
                    placeholder="Name"
                    value={`${firstName} ${lastName}`.trim()}
                    onChange={(e) => {
                      const names = e.target.value.split(' ');
                      setFirstName(names[0] || '');
                      setLastName(names.slice(1).join(' '));
                    }}
                    disabled={loading}
                    className="flip-card__input w-[250px] h-10 rounded-md border-2 border-foreground bg-background shadow-[4px_4px_0_hsl(var(--foreground))] text-base font-semibold text-foreground px-2.5 py-1 outline-none placeholder:text-muted-foreground placeholder:opacity-80 focus:border-primary"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="flip-card__input w-[250px] h-10 rounded-md border-2 border-foreground bg-background shadow-[4px_4px_0_hsl(var(--foreground))] text-base font-semibold text-foreground px-2.5 py-1 outline-none placeholder:text-muted-foreground placeholder:opacity-80 focus:border-primary"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="flip-card__input w-[250px] h-10 rounded-md border-2 border-foreground bg-background shadow-[4px_4px_0_hsl(var(--foreground))] text-base font-semibold text-foreground px-2.5 py-1 outline-none placeholder:text-muted-foreground placeholder:opacity-80 focus:border-primary"
                  />
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flip-card__btn my-5 w-[120px] h-10 rounded-md border-2 border-foreground bg-background shadow-[4px_4px_0_hsl(var(--foreground))] text-base font-semibold text-foreground cursor-pointer active:shadow-none active:translate-x-[3px] active:translate-y-[3px]"
                  >
                    {loading ? 'Processing...' : 'Confirm!'}
                  </button>
                </form>
              </div>
            </div>
          </label>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="w-[300px]">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500 text-green-600 w-[300px]">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
