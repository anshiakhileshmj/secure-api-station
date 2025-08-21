
import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, Zap, Globe, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="hero-text leading-tight">
            Secure Blockchain APIs
            <br />
            for Developers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Access comprehensive blockchain data, wallet risk scoring, and transaction monitoring 
            through our enterprise-grade API platform. Built for developers who demand security and reliability.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            className="btn-primary"
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            size="lg"
          >
            {user ? 'Go to Dashboard' : 'Get Started'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="btn-secondary">
            View Documentation
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="feature-card">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
            <p className="text-muted-foreground">
              Advanced wallet risk scoring and sanctions screening for compliance and security.
            </p>
          </div>
          
          <div className="feature-card">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Data</h3>
            <p className="text-muted-foreground">
              Live transaction monitoring and whale movement tracking across multiple networks.
            </p>
          </div>
          
          <div className="feature-card">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multi-chain Support</h3>
            <p className="text-muted-foreground">
              Comprehensive coverage across Ethereum, Polygon, BSC, and 20+ other networks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
