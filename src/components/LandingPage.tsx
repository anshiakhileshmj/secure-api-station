import React, { useEffect, useRef, useState } from 'react';
import { Shield, ArrowRight, CheckCircle, Users, Zap, Lock, Globe, TrendingUp, Star, Menu, X } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Intersection Observer for animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-up, .fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-500" />
              <span className="text-xl font-bold">AML Shield</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#solutions" className="text-gray-300 hover:text-white transition-colors">Solutions</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#solutions" className="text-gray-300 hover:text-white transition-colors">Solutions</a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors w-fit">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="fade-up">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700 mb-8">
              <Star className="w-4 h-4 text-yellow-400 mr-2" />
              <span className="text-sm text-gray-300">Trusted by 500+ financial institutions</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Secure Your App from
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AML Threats
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Advanced anti-money laundering solutions that protect your business with real-time monitoring, 
              compliance automation, and intelligent risk assessment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 rounded-lg text-lg font-semibold border border-gray-600 hover:border-gray-500 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="fade-up">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-gray-400">Accuracy Rate</div>
            </div>
            <div className="fade-up">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-400">Clients Protected</div>
            </div>
            <div className="fade-up">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">$2B+</div>
              <div className="text-gray-400">Transactions Monitored</div>
            </div>
            <div className="fade-up">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-gray-400">Real-time Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 fade-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Advanced AML Protection
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive anti-money laundering solutions designed for modern financial institutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="fade-up bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Real-time Monitoring</h3>
              <p className="text-gray-400">
                Monitor transactions in real-time with AI-powered detection algorithms that identify suspicious patterns instantly.
              </p>
            </div>

            <div className="fade-up bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                <Lock className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Compliance Automation</h3>
              <p className="text-gray-400">
                Automate regulatory reporting and ensure compliance with global AML regulations and standards.
              </p>
            </div>

            <div className="fade-up bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Risk Assessment</h3>
              <p className="text-gray-400">
                Advanced risk scoring and assessment tools to evaluate customer profiles and transaction patterns.
              </p>
            </div>

            <div className="fade-up bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Customer Due Diligence</h3>
              <p className="text-gray-400">
                Comprehensive KYC and customer screening with global watchlist monitoring and verification.
              </p>
            </div>

            <div className="fade-up bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Coverage</h3>
              <p className="text-gray-400">
                Worldwide regulatory compliance with support for multiple jurisdictions and local requirements.
              </p>
            </div>

            <div className="fade-up bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Case Management</h3>
              <p className="text-gray-400">
                Streamlined investigation workflows with automated case creation and management tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-32 px-6 lg:px-8 bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="slide-in-left">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Built for Modern Financial Institutions
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                Our AML solutions integrate seamlessly with your existing infrastructure, 
                providing comprehensive protection without disrupting your operations.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Easy Integration</h3>
                    <p className="text-gray-400">RESTful APIs and SDKs for quick implementation</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Scalable Architecture</h3>
                    <p className="text-gray-400">Handle millions of transactions with cloud-native infrastructure</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">24/7 Support</h3>
                    <p className="text-gray-400">Expert support team available around the clock</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="slide-in-right">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-8 rounded-2xl border border-gray-700">
                <div className="bg-gray-900 p-6 rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-400">Transaction Monitor</span>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                      <span className="text-sm">High Risk Alert</span>
                      <span className="text-red-400 text-sm font-semibold">FLAGGED</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                      <span className="text-sm">KYC Verification</span>
                      <span className="text-green-400 text-sm font-semibold">VERIFIED</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                      <span className="text-sm">Compliance Check</span>
                      <span className="text-blue-400 text-sm font-semibold">PROCESSING</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center fade-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Secure Your Business?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join hundreds of financial institutions that trust our AML solutions to protect their operations.
          </p>
          
          <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 max-w-md mx-auto">
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your business email"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Start Free Trial
              </button>
              <p className="text-sm text-gray-400">
                No credit card required • 30-day free trial
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-8 h-8 text-blue-500" />
                <span className="text-xl font-bold">AML Shield</span>
              </div>
              <p className="text-gray-400 mb-4">
                Advanced anti-money laundering solutions for modern financial institutions.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AML Shield. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style jsx>{`
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in {
          opacity: 0;
          transition: opacity 0.6s ease;
        }
        
        .slide-in-left {
          opacity: 0;
          transform: translateX(-30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .slide-in-right {
          opacity: 0;
          transform: translateX(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-in {
          opacity: 1;
          transform: translateY(0) translateX(0);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .fade-up,
          .fade-in,
          .slide-in-left,
          .slide-in-right {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

export default App;