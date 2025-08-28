import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
const Hero = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  return <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-100 flex flex-col">
      {/* Navigation */}
      

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-800 leading-tight mb-6">
            Stay Connected
            <br />
            Anywhere <span className="text-teal-600">Anytime</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Stay connected with fast, reliable coverage—wherever life takes you, anytime, 
            anywhere, without interruptions.
          </p>

          <Button className="bg-teal-700 hover:bg-teal-800 text-white text-lg px-8 py-4 h-auto rounded-full font-medium transition-all duration-300" onClick={() => navigate(user ? '/dashboard' : '/auth')}>
            {user ? 'Go to Dashboard' : 'Download Mobile App!'}
          </Button>
        </div>
      </div>
    </div>;
};
export default Hero;