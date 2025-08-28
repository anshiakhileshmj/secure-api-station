import React, { useEffect } from 'react';
import './main.css';

function App(): JSX.Element {
  useEffect(() => {
    const webFontScript: HTMLScriptElement = document.createElement('script');
    webFontScript.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    webFontScript.onload = () => {
      (window as any).WebFont.load({
        google: {
          families: ["Plus Jakarta Sans:200,300,regular,500,600,700,800", "Inter:100,200,300,regular,500,600,700,800,900"]
        }
      });
    };
    document.head.appendChild(webFontScript);

    const swiperScript: HTMLScriptElement = document.createElement('script');
    swiperScript.src = 'https://unpkg.com/swiper@8/swiper-bundle.min.js';
    document.head.appendChild(swiperScript);

    const splitTypeScript: HTMLScriptElement = document.createElement('script');
    splitTypeScript.src = 'https://unpkg.com/split-type';
    document.head.appendChild(splitTypeScript);

    if ('ontouchstart' in window || (window.DocumentTouch && document instanceof window.DocumentTouch)) {
      document.documentElement.className += ' w-mod-touch';
    }
  }, []);

  return (
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
          <img src="" loading="lazy" alt="" className="image-contain" />
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
                      src="aa.png" 
                      loading="lazy" 
                      sizes="100vw" 
                      srcSet="500.png 500w, 500.png 800w, 1080.png 1080w, 1600.png 1600w, 2000.png 2000w, main-bg.png 2400w" 
                      alt="" 
                      className="image-contain" 
                    />
                  </div>
                  <div className="hero-bg-image s2">
                    <img 
                      className="image-contain" 
                      src="usdc.png" 
                      alt="" 
                      data-levitation="1" 
                      sizes="100vw" 
                      loading="lazy" 
                      srcSet="usdc-p-500.png 500w, usdc-p-800.png 800w, usdc-p-1080.png 1080w, usdc-p-1600.png 1600w, usdc-p-2000.png 2000w, usdc.png 2400w" 
                    />
                  </div>
                  <div className="hero-bg-image s3">
                    <img 
                      className="image-contain" 
                      src="btc.png" 
                      alt="" 
                      data-levitation="2" 
                      sizes="100vw" 
                      loading="lazy" 
                      srcSet="btc-p-500.png 500w, btc-p-800.png 800w, btc-p-1080.png 1080w, btc-p-1600.png 1600w, btc-p-2000.png 2000w, btc.png 2400w" 
                    />
                  </div>
                  <div className="hero-bg-image s4">
                    <img 
                      className="image-contain" 
                      src="tether.png" 
                      alt="" 
                      data-levitation="1" 
                      sizes="100vw" 
                      loading="lazy" 
                      srcSet="tether-p-500.png 500w, tether-p-800.png 800w, tether-p-1080.png 1080w, tether-p-1600.png 1600w, tether-p-2000.png 2000w, tether.png 2400w" 
                    />
                  </div>
                  <div className="hero-bg-image s5">
                    <img 
                      className="image-contain" 
                      src="eth.png" 
                      alt="" 
                      data-levitation="2" 
                      sizes="100vw" 
                      loading="lazy" 
                      srcSet="eth-p-500.png 500w, eth-p-800.png 800w, eth-p-1080.png 1080w, eth-p-1600.png 1600w, eth-p-2000.png 2000w, eth.png 2400w" 
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

      <style dangerouslySetInnerHTML={{
        __html: `
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
        `
      }} />
    </div>
  );
}

export default App;
