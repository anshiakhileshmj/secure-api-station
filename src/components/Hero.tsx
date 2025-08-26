
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Globe, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20">
        {/* Floating dots/stars */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/40 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-blue-400/60 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-32 right-1/3 w-1 h-1 bg-blue-400/50 rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Welcome badge */}
        <div className="inline-flex items-center space-x-2 bg-muted/50 border border-border/50 rounded-full px-4 py-2 backdrop-blur-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm text-muted-foreground">Welcome to SecureAPI</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-foreground via-primary to-blue-400 bg-clip-text text-transparent">
            Secure Blockchain APIs
            <br />
            for Developers
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Access comprehensive blockchain data, wallet risk scoring, and transaction monitoring 
            with the most secure and user-friendly API platform.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            className="btn-primary text-lg px-8 py-4 h-auto"
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            size="lg"
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="btn-secondary text-lg px-8 py-4 h-auto bg-transparent border-border/50 hover:bg-muted/20"
            onClick={() => navigate('/docs')}
          >
            Explore Features
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20 pt-8">
          <div className="group feature-card hover:border-primary/20 transition-all duration-500">
            <div className="relative">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Risk Assessment</h3>
            <p className="text-muted-foreground leading-relaxed">
              Advanced wallet risk scoring and sanctions screening for compliance and security.
            </p>
          </div>
          
          <div className="group feature-card hover:border-primary/20 transition-all duration-500">
            <div className="relative">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Real-time Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              Live transaction monitoring and whale movement tracking across multiple networks.
            </p>
          </div>
          
          <div className="group feature-card hover:border-primary/20 transition-all duration-500">
            <div className="relative">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Multi-chain Support</h3>
            <p className="text-muted-foreground leading-relaxed">
              Comprehensive coverage across Ethereum, Polygon, BSC, and 20+ other networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
