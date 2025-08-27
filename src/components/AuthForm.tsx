
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import IntlTelInput from "intl-tel-input/react";
import "intl-tel-input/build/css/intlTelInput.css";
import CustomDropdown from './CustomDropdown';
import { COUNTRIES, BUSINESS_TYPES } from '@/constants/formData';

const AuthForm = () => {
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [website, setWebsite] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (isSignUp) {
      // Additional validation for signup
      if (!firstName || !lastName || !companyName || !jobTitle || !country || !businessType) {
        toast({
          title: "Missing Fields",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (!isPhoneValid) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
    }

    try {
      if (isSignUp) {
        const metadata = {
          first_name: firstName,
          last_name: lastName,
          company_name: companyName,
          job_title: jobTitle,
          phone,
          country,
          business_type: businessType,
          website
        };
        
        const { error } = await signUp(email, password, metadata);
        if (error) throw error;
        
        toast({
          title: "Sign Up Successful",
          description: "You have successfully signed up. Redirecting...",
        });
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        toast({
          title: "Sign In Successful",
          description: "You have successfully signed in. Redirecting...",
        });
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate. Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    // Reset all form fields
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFirstName('');
    setLastName('');
    setCompanyName('');
    setJobTitle('');
    setPhone('');
    setCountry('');
    setBusinessType('');
    setWebsite('');
    setIsPhoneValid(false);
  };

  // Simplified form validation
  const isSignUpFormValid = isSignUp ? (
    firstName.trim() && 
    lastName.trim() && 
    companyName.trim() && 
    jobTitle.trim() && 
    email.trim() && 
    password.trim() && 
    confirmPassword.trim() && 
    country.trim() && 
    businessType.trim() && 
    isPhoneValid &&
    password === confirmPassword
  ) : true;

  const isSignInFormValid = !isSignUp ? (email.trim() && password.trim()) : true;

  const isFormValid = isSignUpFormValid && isSignInFormValid;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-color)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Fredoka One', cursive, sans-serif",
      }}
    >
      <style>{`
        :root {
          --input-focus: #666;
          --font-color: #323232;
          --font-color-sub: #666;
          --bg-color: #fff;
          --bg-color-alt: #666;
          --main-color: #323232;
        }
        .flip-card__back {
          width: 550px;
          min-width: 320px;
          max-width: 95vw;
          height: auto;
          padding: 20px 18px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--bg-color);
          gap: 16px;
          border-radius: 5px;
          border: 2px solid var(--main-color);
          box-shadow: 4px 4px var(--main-color);
          color: var(--font-color);
          box-sizing: border-box;
          margin: 0 auto;
        }
        .title {
          margin: 20px 0;
          font-size: 25px;
          font-weight: 900;
          text-align: center;
          color: var(--main-color);
        }
        form {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          width: 100%;
        }
        .row-top {
          display: flex;
          gap: 12px;
          justify-content: center;
          width: 100%;
        }
        .phone-country-row {
          display: flex;
          gap: 12px;
          justify-content: center;
          width: 100%;
          align-items: center;
        }
        .flip-card__input, .phone-number {
          height: 40px;
          border-radius: 5px;
          border: 2px solid var(--main-color);
          background-color: var(--bg-color);
          box-shadow: 4px 4px var(--main-color);
          font-size: 15px;
          font-weight: 600;
          color: var(--font-color);
          padding: 5px 10px;
          outline: none;
          box-sizing: border-box;
          flex: 1;
          min-width: 0;
          max-width: 250px;
        }
        .flip-card__input::placeholder, .phone-number::placeholder {
          color: var(--font-color-sub);
          opacity: 0.8;
        }
        .flip-card__input:focus, .phone-number:focus {
          border: 2px solid var(--input-focus);
          outline: none;
        }
        .button-confirm {
          margin: 18px auto 6px auto;
          width: 120px;
          height: 40px;
          border-radius: 5px;
          border: 2px solid var(--main-color);
          background-color: var(--bg-color);
          box-shadow: 4px 4px var(--main-color);
          font-size: 17px;
          font-weight: 600;
          color: var(--font-color);
          cursor: pointer;
          display: block;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .button-confirm:active {
          box-shadow: 0 0 var(--main-color);
          transform: translate(3px, 3px);
        }
        .button-confirm:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .signin-signup-link {
          text-align: center;
          margin-top: 2px;
          margin-bottom: 2px;
          font-size: 16px;
        }
        .signin-signup-link span {
          color: #666;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
        }
        @media (max-width: 700px) {
          .flip-card__back {
            width: 98vw;
            min-width: 0;
            padding: 12px;
          }
          .button-confirm {
            width: 100%;
          }
        }
      `}</style>
      
      {isSignUp ? (
        <div className="flip-card__back" role="region" aria-label="Sign up form">
          <h1 className="title">Sign up</h1>
          <form onSubmit={handleSubmit}>
            <div className="row-top">
              <input
                type="text"
                placeholder="First Name"
                className="flip-card__input"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="flip-card__input"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="row-top">
              <input
                type="text"
                placeholder="Company Name"
                className="flip-card__input"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                style={{ maxWidth: 250 }}
              />
              <input
                type="text"
                placeholder="Job Title"
                className="flip-card__input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                style={{ maxWidth: 250 }}
              />
            </div>
            <div className="row-top">
              <input
                type="email"
                placeholder="Email"
                className="flip-card__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ maxWidth: 250 }}
              />
              <IntlTelInput
                initialValue={phone}
                onChangeNumber={(num) => {
                  const formatted = num.replace(/(?!^\+)\D/g, "");
                  setPhone(formatted);
                }}
                onChangeValidity={setIsPhoneValid}
                initOptions={{
                  initialCountry: "in",
                  utilsScript:
                    "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/utils.js",
                } as any}
                inputProps={{
                  name: "phone",
                  required: true,
                  className: "phone-number",
                  style: { maxWidth: 250 },
                  placeholder: "+91 9876543210",
                }}
              />
            </div>
            <div className="row-top">
              <input
                type="password"
                placeholder="Password"
                className="flip-card__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ maxWidth: 250 }}
              />
              <input
                type="password"
                placeholder="Confirm password"
                className="flip-card__input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{ maxWidth: 250 }}
              />
            </div>
            <div className="phone-country-row" aria-label="Country and business type selection">
              <CustomDropdown
                options={[
                  { value: "", label: "Select country" },
                  ...COUNTRIES.map((c) => ({
                    value: c.code,
                    label: c.name,
                  })),
                ]}
                placeholder="Select country"
                value={country}
                onChange={setCountry}
                required
              />
              <CustomDropdown
                options={[
                  { value: "", label: "Select business type" },
                  ...BUSINESS_TYPES.map((b) => ({
                    value: b.toLowerCase().replace(/\s+/g, "-"),
                    label: b,
                  })),
                ]}
                placeholder="Select business type"
                value={businessType}
                onChange={setBusinessType}
                required
              />
            </div>
            <div className="row-top">
              <input
                type="url"
                placeholder="Website (optional)"
                className="flip-card__input"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ maxWidth: 250 }}
              />
            </div>
            <button 
              type="submit" 
              className="button-confirm" 
              disabled={loading || !isFormValid}
            >
              {loading ? "Loading..." : "Confirm!"}
            </button>
          </form>
          <div className="signin-signup-link">
            Existing user? <span onClick={handleToggle}>Sign in</span>
          </div>
        </div>
      ) : (
        <div className="flip-card__back" role="region" aria-label="Sign in form">
          <h1 className="title">Sign in</h1>
          <form onSubmit={handleSubmit}>
            <div className="row-top">
              <input
                type="email"
                placeholder="Email"
                className="flip-card__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ maxWidth: 250 }}
              />
            </div>
            <div className="row-top">
              <input
                type="password"
                placeholder="Password"
                className="flip-card__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ maxWidth: 250 }}
              />
            </div>
            <button 
              type="submit" 
              className="button-confirm" 
              disabled={loading || !isFormValid}
            >
              {loading ? "Loading..." : "Let's go!"}
            </button>
          </form>
          <div className="signin-signup-link">
            New user? <span onClick={handleToggle}>Sign up</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
