
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Central light beam effect */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-2xl"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-blue-200/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
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
          <Button 
            className="bg-white text-black hover:bg-gray-100 text-lg px-10 py-4 h-auto rounded-full font-medium transition-all duration-300"
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            size="lg"
          >
            {user ? 'Go to Dashboard' : 'Launch App'}
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white/30 text-white hover:bg-white/10 text-lg px-10 py-4 h-auto rounded-full font-medium bg-transparent transition-all duration-300"
            onClick={() => navigate('/docs')}
          >
            Documentation
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mt-24 pt-12">
          <div className="group text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-medium text-white">Risk Assessment</h3>
            <p className="text-gray-400 leading-relaxed">
              Advanced wallet risk scoring and sanctions screening for compliance and security.
            </p>
          </div>
          
          <div className="group text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-medium text-white">Real-time Data</h3>
            <p className="text-gray-400 leading-relaxed">
              Live transaction monitoring and whale movement tracking across multiple networks.
            </p>
          </div>
          
          <div className="group text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-all duration-300">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-medium text-white">Multi-chain Support</h3>
            <p className="text-gray-400 leading-relaxed">
              Comprehensive coverage across Ethereum, Polygon, BSC, and 20+ other networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
