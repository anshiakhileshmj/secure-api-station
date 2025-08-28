
import React, { useEffect } from 'react';

const LandingPage = () => {
  useEffect(() => {
    // Load external scripts
    const webFontScript = document.createElement('script');
    webFontScript.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    webFontScript.onload = () => {
      if (window.WebFont) {
        window.WebFont.load({
          google: {
            families: ["Plus Jakarta Sans:200,300,regular,500,600,700,800", "Inter:100,200,300,regular,500,600,700,800,900"]
          }
        });
      }
    };
    document.head.appendChild(webFontScript);

    const swiperScript = document.createElement('script');
    swiperScript.src = 'https://unpkg.com/swiper@8/swiper-bundle.min.js';
    document.head.appendChild(swiperScript);

    const splitTypeScript = document.createElement('script');
    splitTypeScript.src = 'https://unpkg.com/split-type';
    document.head.appendChild(splitTypeScript);

    if ('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
      document.documentElement.className += ' w-mod-touch';
    }

    return () => {
      // Cleanup scripts
      if (document.head.contains(webFontScript)) document.head.removeChild(webFontScript);
      if (document.head.contains(swiperScript)) document.head.removeChild(swiperScript);
      if (document.head.contains(splitTypeScript)) document.head.removeChild(splitTypeScript);
    };
  }, []);

  return (
    <>
      <div className="page-wrapper">
        <div className="general-styles">
          <style dangerouslySetInnerHTML={{
            __html: `
              html { font-size: 1rem; }
              @media screen and (min-width: 240px) {
                html { font-size: 1vw; }
              }
              @media screen and (min-width: 1920px) {
                html { font-size: 0.8vw; }
                .container { width: 100rem; }
              }
              @media screen and (min-width: 1920px) and (min-aspect-ratio: 21/9) {
                html { font-size: calc(1280px / 100); }
              }
              @media screen and (min-width: 3440px) and (min-aspect-ratio: 21/9) {
                html { font-size: calc(1920px / 100); }
              }
            `
          }} />
        </div>

        <div className="header">
          <div className="header-logo">
            <img src="/landing page/aml_logo.png" loading="lazy" alt="AML Logo" className="image-contain" />
          </div>
        </div>

        <main className="main">
          <section className="hero-sc">
            <div className="full-container hero-s">
              <div className="container hero-sc">
                <div className="hero-bg-elements">
                  <div data-noise="true" className="hero-bg-ellipse"></div>
                  <div className="hero-bg-images">
                    <div className="hero-bg-image s1">
                      <img 
                        src="/landing page/main-bg.png" 
                        loading="lazy" 
                        sizes="100vw" 
                        srcSet="/landing page/500.png 500w, /landing page/800.png 800w, /landing page/1080.png 1080w, /landing page/1600.png 1600w, /landing page/2000.png 2000w, /landing page/main-bg.png 2400w" 
                        alt="Background" 
                        className="image-contain" 
                      />
                    </div>
                    <div className="hero-bg-image s2">
                      <img 
                        className="image-contain" 
                        src="/landing page/usdc.png" 
                        alt="USDC" 
                        data-levitation="1" 
                        sizes="100vw" 
                        loading="lazy" 
                        srcSet="/landing page/usdc-p-500.png 500w, /landing page/usdc-p-800.png 800w, /landing page/usdc-p-1080.png 1080w, /landing page/usdc-p-1600.png 1600w, /landing page/usdc-p-2000.png 2000w, /landing page/usdc.png 2400w" 
                      />
                    </div>
                    <div className="hero-bg-image s3">
                      <img 
                        className="image-contain" 
                        src="/landing page/btc.png" 
                        alt="Bitcoin" 
                        data-levitation="2" 
                        sizes="100vw" 
                        loading="lazy" 
                        srcSet="/landing page/btc-p-500.png 500w, /landing page/btc-p-800.png 800w, /landing page/btc-p-1080.png 1080w, /landing page/btc-p-1600.png 1600w, /landing page/btc-p-2000.png 2000w, /landing page/btc.png 2400w" 
                      />
                    </div>
                    <div className="hero-bg-image s4">
                      <img 
                        className="image-contain" 
                        src="/landing page/tether.png" 
                        alt="Tether" 
                        data-levitation="1" 
                        sizes="100vw" 
                        loading="lazy" 
                        srcSet="/landing page/tether-p-500.png 500w, /landing page/tether-p-800.png 800w, /landing page/tether-p-1080.png 1080w, /landing page/tether-p-1600.png 1600w, /landing page/tether-p-2000.png 2000w, /landing page/tether.png 2400w" 
                      />
                    </div>
                    <div className="hero-bg-image s5">
                      <img 
                        className="image-contain" 
                        src="/landing page/eth.png" 
                        alt="Ethereum" 
                        data-levitation="2" 
                        sizes="100vw" 
                        loading="lazy" 
                        srcSet="/landing page/eth-p-500.png 500w, /landing page/eth-p-800.png 800w, /landing page/eth-p-1080.png 1080w, /landing page/eth-p-1600.png 1600w, /landing page/eth-p-2000.png 2000w, /landing page/eth.png 2400w" 
                      />
                    </div>
                  </div>
                </div>

                <div className="hero-main-elements">
                  <div className="text-elements hero-s">
                    <div className="headline-wrapper hero-s">
                      <h1 className="headline-h1">Secure your App from AML</h1>
                    </div>
                  </div>
                  <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                    <button className="get-started-btn" style={{
                      padding: '0.75rem 2rem',
                      fontSize: '1.25rem',
                      borderRadius: '2rem',
                      border: 'none',
                      background: '#0a1747',
                      color: '#fff',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}>
                      Get started
                    </button>
                    <button className="see-docs-btn" style={{
                      padding: '0.75rem 2rem',
                      fontSize: '1.25rem',
                      borderRadius: '2rem',
                      border: '2px solid #0a1747',
                      background: '#fff',
                      color: '#0a1747',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}>
                      See Documentation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          /* Landing Page Styles */
          .page-wrapper {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }

          .header {
            position: relative;
            z-index: 1000;
            padding: 1rem;
          }

          .header-logo {
            display: flex;
            justify-content: center;
          }

          .image-contain {
            max-width: 100%;
            height: auto;
            object-fit: contain;
          }

          .main {
            flex: 1;
          }

          .hero-sc {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .full-container {
            width: 100%;
          }

          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            position: relative;
          }

          .hero-sc.container {
            position: relative;
            z-index: 10;
          }

          .hero-bg-elements {
            position: absolute;
            inset: 0;
            pointer-events: none;
          }

          .hero-bg-ellipse {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 800px;
            height: 800px;
            background: radial-gradient(circle, rgba(10, 23, 71, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            will-change: filter; 
            -webkit-backface-visibility: hidden;
            transform: translateZ(0);
          }

          .hero-bg-images {
            position: absolute;
            inset: 0;
          }

          .hero-bg-image {
            position: absolute;
          }

          .hero-bg-image.s1 {
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
          }

          .hero-bg-image.s2 {
            top: 20%;
            right: 10%;
            width: 80px;
            height: 80px;
            z-index: 2;
          }

          .hero-bg-image.s3 {
            top: 60%;
            left: 5%;
            width: 60px;
            height: 60px;
            z-index: 2;
          }

          .hero-bg-image.s4 {
            bottom: 20%;
            right: 15%;
            width: 70px;
            height: 70px;
            z-index: 2;
          }

          .hero-bg-image.s5 {
            top: 30%;
            left: 10%;
            width: 75px;
            height: 75px;
            z-index: 2;
          }

          .hero-main-elements {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 2rem 0;
          }

          .text-elements {
            margin-bottom: 2rem;
          }

          .headline-wrapper {
            margin-bottom: 1rem;
          }

          .headline-h1 {
            font-size: clamp(2rem, 5vw, 4rem);
            font-weight: 700;
            color: #0a1747;
            margin: 0;
            line-height: 1.2;
          }

          .hero-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
          }

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

          [data-levitation="1"] {
            animation: levitateFirst 6s ease-in-out infinite;
          }

          @keyframes levitateFirst {
            0% { transform: translateY(0); }
            50% { transform: translateY(-2%); }
            100% { transform: translateY(0); }
          }

          [data-levitation="2"] {
            animation: levitateSecond 5s ease-in-out infinite;
          }

          @keyframes levitateSecond {
            0% { transform: translateY(0); }
            50% { transform: translateY(-1%); }
            100% { transform: translateY(0); }
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

          @media (max-width: 768px) {
            .hero-bg-image.s2,
            .hero-bg-image.s3,
            .hero-bg-image.s4,
            .hero-bg-image.s5 {
              width: 40px;
              height: 40px;
            }
            
            .hero-buttons {
              flex-direction: column;
              align-items: center;
            }
          }
        `
      }} />
    </>
  );
};

// Extend Window interface for WebFont
declare global {
  interface Window {
    WebFont: any;
    DocumentTouch: any;
  }
}

export default LandingPage;
