import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
const Hero = () => {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  return <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Central light beam effect */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-blue-200/30 rounded-full animate-pulse" style={{
        animationDelay: '0.5s'
      }}></div>
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{
        animationDelay: '1.5s'
      }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-12">
        <div className="space-y-8">
          <h1 className="text-6xl md:text-8xl font-light leading-tight text-white tracking-wide">
            Secure Blockchain APIs
            <br />
            <span className="text-5xl md:text-7xl">for Developers</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
            Access comprehensive blockchain data, wallet risk scoring, and transaction monitoring 
            with the most secure and user-friendly API platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <Button className="bg-white text-black hover:bg-gray-100 text-lg px-10 py-4 h-auto rounded-full font-medium transition-all duration-300" onClick={() => navigate(user ? '/dashboard' : '/auth')} size="lg">
            {user ? 'Go to Dashboard' : 'Launch App'}
          </Button>
          
          <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-4 h-auto rounded-full font-medium bg-transparent transition-all duration-300" onClick={() => navigate('/docs')}>
            Documentation
          </Button>
        </div>

        
      </div>
    </div>;
};
export default Hero;