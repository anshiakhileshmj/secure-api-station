
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-100 flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-semibold text-slate-800">Skytelco</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-slate-600 hover:text-slate-800">Home</a>
          <a href="#" className="text-slate-600 hover:text-slate-800">Recharge</a>
          <a href="#" className="text-slate-600 hover:text-slate-800">Plans & Offer</a>
          <a href="#" className="text-slate-600 hover:text-slate-800">Service</a>
          <a href="#" className="text-slate-600 hover:text-slate-800">Store</a>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="p-2">
            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </nav>

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

          <Button 
            className="bg-teal-700 hover:bg-teal-800 text-white text-lg px-8 py-4 h-auto rounded-full font-medium transition-all duration-300" 
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
          >
            {user ? 'Go to Dashboard' : 'Download Mobile App!'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
