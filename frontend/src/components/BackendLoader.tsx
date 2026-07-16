import React from 'react';
import logo from '../assets/winway1.webp';
import type { WarmupStatus } from '../services/backendWarmup';

interface BackendLoaderProps {
  status: WarmupStatus | null;
}

const messages: Record<string, string[]> = {
  waking: [
    'Starting up, please wait…',
    'Waking up the server…',
    'Still loading, almost there…',
    'Server is warming up…',
    'Hang tight, just a moment…',
    'Nearly ready for you…',
  ],
  ready: ['Connected! Loading your experience…'],
  timeout: ['Taking longer than usual, continuing anyway…'],
};

export const BackendLoader: React.FC<BackendLoaderProps> = ({ status }) => {
  if (!status || status.phase === 'ready') return null;

  const msgs = messages[status.phase] ?? messages.waking;
  const message = msgs[Math.min(status.attempt - 1, msgs.length - 1)];

  // Progress: 0–80% while waking, 100% on ready/timeout
  const progress =
    status.phase === 'waking'
      ? Math.min(((status.attempt - 1) / 6) * 80, 80)
      : 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

        @keyframes ww-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes ww-spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes ww-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes ww-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes ww-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ww-pulse-ring {
          0% { transform: scale(0.95); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.2; }
          100% { transform: scale(0.95); opacity: 0.6; }
        }

        .ww-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFFDF7;
          font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif;
        }

        /* Soft radial glow in background */
        .ww-overlay::before {
          content: '';
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse at center, rgba(214,185,140,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .ww-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.8rem;
          padding: 3rem 2.5rem 2.5rem;
          background: linear-gradient(145deg, rgba(255,253,247,0.95) 0%, rgba(243,233,220,0.9) 100%);
          border: 1px solid rgba(214, 185, 140, 0.3);
          border-radius: 2rem;
          box-shadow:
            0 4px 6px rgba(91,70,54,0.04),
            0 20px 40px rgba(91,70,54,0.08),
            0 0 0 1px rgba(255,253,247,0.8) inset;
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          max-width: 360px;
          width: 90%;
          text-align: center;
          animation: ww-fade-in 0.4s ease-out;
          position: relative;
        }

        /* Subtle top highlight line */
        .ww-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 15%;
          right: 15%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(214,185,140,0.6), transparent);
          border-radius: 100px;
        }

        /* Logo wrapper with floating animation */
        .ww-logo-wrapper {
          position: relative;
          animation: ww-float 3s ease-in-out infinite;
        }

        .ww-logo {
          height: 56px;
          width: auto;
          filter: drop-shadow(0 4px 12px rgba(91,70,54,0.15));
        }

        /* Spinner ring system */
        .ww-spinner-wrapper {
          position: relative;
          width: 72px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Pulse ring behind spinner */
        .ww-pulse-ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 2px solid rgba(214,185,140,0.25);
          animation: ww-pulse-ring 2.5s ease-in-out infinite;
        }

        /* Outer spinning arc */
        .ww-ring-outer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2.5px solid transparent;
          border-top-color: #D6B98C;
          border-right-color: #b8936a;
          animation: ww-spin 1.1s cubic-bezier(0.4,0,0.2,1) infinite;
        }

        /* Inner counter-spinning arc */
        .ww-ring-inner {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid transparent;
          border-bottom-color: rgba(214,185,140,0.35);
          border-left-color: rgba(184,147,106,0.2);
          animation: ww-spin-reverse 1.6s cubic-bezier(0.4,0,0.2,1) infinite;
        }

        /* Center dot */
        .ww-center-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #D6B98C, #b8936a);
          box-shadow: 0 0 10px rgba(214,185,140,0.5);
        }

        /* Message text */
        .ww-message {
          font-size: 0.95rem;
          font-weight: 600;
          color: #5B4636;
          margin: 0;
          letter-spacing: 0.01em;
          animation: ww-fade-in 0.3s ease-out;
        }

        /* Progress bar track */
        .ww-progress-track {
          width: 100%;
          height: 3px;
          background: rgba(214,185,140,0.2);
          border-radius: 100px;
          overflow: hidden;
        }

        /* Progress bar fill with shimmer */
        .ww-progress-fill {
          height: 100%;
          background: linear-gradient(
            90deg,
            #D6B98C,
            #b8936a 40%,
            #D6B98C 60%,
            #b8936a
          );
          background-size: 200% auto;
          border-radius: 100px;
          animation: ww-shimmer 2s linear infinite;
          box-shadow: 0 0 8px rgba(214,185,140,0.4);
          transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
        }

        /* Subtext */
        .ww-subtext {
          font-size: 0.72rem;
          color: rgba(91,70,54,0.45);
          margin: 0;
          line-height: 1.7;
          font-weight: 400;
        }

        /* Dots loader (3 bouncing dots) */
        .ww-dots {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .ww-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #D6B98C;
          animation: ww-dot-bounce 1.4s ease-in-out infinite;
        }
        .ww-dot:nth-child(1) { animation-delay: 0s; }
        .ww-dot:nth-child(2) { animation-delay: 0.2s; }
        .ww-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes ww-dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>

      <div className="ww-overlay">
        <div className="ww-card">

          {/* Logo */}
          <div className="ww-logo-wrapper">
            <img src={logo} alt="Winway Computers" className="ww-logo" />
          </div>

          {/* Spinner */}
          <div className="ww-spinner-wrapper">
            <div className="ww-pulse-ring" />
            <div className="ww-ring-outer" />
            <div className="ww-ring-inner" />
            <div className="ww-center-dot" />
          </div>

          {/* Message + dots */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <p className="ww-message">{message}</p>
            <div className="ww-dots">
              <div className="ww-dot" />
              <div className="ww-dot" />
              <div className="ww-dot" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="ww-progress-track">
            <div
              className="ww-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Subtext */}
          <p className="ww-subtext">
            Free-tier servers sleep when idle.<br />
            First load may take up to 30 seconds.
          </p>

        </div>
      </div>
    </>
  );
};

export default BackendLoader;
