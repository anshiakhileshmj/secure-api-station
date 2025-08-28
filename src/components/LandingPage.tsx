
import React from 'react';

const LandingPage = () => {
  return (
    <div className="page-wrapper">
      {/* General Styles */}
      <style jsx>{`
        html { font-size: 1rem; }

        @media screen and (min-width: 240px) {
          html { font-size: 1vw; }
        }
        
        @media screen and (min-width: 1920px) {
          html { font-size: 0.8vw; }
          .container {
            width: 100rem;
          }
        }
        
        @media screen and (min-width: 1920px) and (min-aspect-ratio: 21/9) {
          html {
            font-size: calc(1280px / 100);
          }
        }

        @media screen and (min-width: 3440px) and (min-aspect-ratio: 21/9) {
          html {
            font-size: calc(1920px / 100);
          }
        }

        /* BG Noise */
        [data-noise]::before {
          content: '';
          position: absolute;
          inset: 0%;
          width: 100%;
          height: 100%;
          background-image: url('https://cdn.prod.website-files.com/67f787d9bacca46412e7a577/67f799b3c397656e8c23fd98_noise.gif');
          background-position: 50%;
          background-repeat: repeat;
          background-size: auto;
          opacity: 0.08;
          pointer-events: none;
        }

        /* Levitation Elements */
        [data-levitation="1"] {
          animation: levitateFirst 6s ease-in-out infinite;
        }

        @keyframes levitateFirst {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2%);
          }
          100% {
            transform: translateY(0);
          }
        }

        [data-levitation="2"] {
          animation: levitateSecond 5s ease-in-out infinite;
        }

        @keyframes levitateSecond {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-1%);
          }
          100% {
            transform: translateY(0);
          }
        }

        .hero-bg-ellipse {
          will-change: filter;
          -webkit-backface-visibility: hidden;
          transform: translateZ(0);
        }

        @media (min-width: 0px) {
          .hero-bg-ellipse {
            -webkit-filter: blur(40rem);
            filter: blur(40rem);
          }
        }

        @media (min-width: 479px) {
          .hero-bg-ellipse {
            -webkit-filter: blur(12rem);
            filter: blur(12rem);
          }
        }
      `}</style>

      {/* Header */}
      <div className="header fixed top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm">
        <div className="header-logo p-4">
          <img 
            src="/aml_logo.png" 
            loading="lazy" 
            alt="AML Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="main">
        <section className="hero-sc min-h-screen relative overflow-hidden bg-black">
          <div className="full-container hero-s absolute inset-0">
            <div className="container hero-sc relative z-10 flex items-center justify-center min-h-screen px-4">
              
              {/* Background Elements */}
              <div className="hero-bg-elements absolute inset-0">
                <div data-noise="" className="hero-bg-ellipse absolute top-20 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full"></div>
                <div data-noise="" className="hero-bg-ellipse absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full"></div>
                <div data-noise="" className="hero-bg-noise absolute inset-0"></div>
                
                {/* Background Images */}
                <div className="hero-bg-images absolute inset-0">
                  <div className="hero-bg-image s1 absolute inset-0">
                    <img 
                      src="/landing page/main-bg.png" 
                      loading="lazy" 
                      alt="Background" 
                      className="w-full h-full object-cover opacity-30"
                    />
                  </div>
                  
                  <div className="hero-bg-image s2 absolute top-20 right-20">
                    <img 
                      className="w-24 h-24 object-contain" 
                      src="/landing page/usdc.png" 
                      alt="USDC" 
                      data-levitation="1" 
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="hero-bg-image s3 absolute top-40 left-20">
                    <img 
                      className="w-20 h-20 object-contain" 
                      src="/landing page/btc.png" 
                      alt="Bitcoin" 
                      data-levitation="2" 
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="hero-bg-image s4 absolute bottom-40 right-40">
                    <img 
                      className="w-16 h-16 object-contain" 
                      src="/landing page/tether.png" 
                      alt="Tether" 
                      data-levitation="1" 
                      loading="lazy"
                    />
                  </div>
                  
                  <div className="hero-bg-image s5 absolute bottom-20 left-40">
                    <img 
                      className="w-18 h-18 object-contain" 
                      src="/landing page/eth.png" 
                      alt="Ethereum" 
                      data-levitation="2" 
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Main Hero Content */}
              <div className="hero-main-elements relative z-20 text-center">
                <div className="text-elements hero-s">
                  <div className="headline-wrapper hero-s">
                    <h1 className="headline-h1 text-6xl md:text-8xl font-bold text-white leading-tight">
                      Secure your App from AML
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
