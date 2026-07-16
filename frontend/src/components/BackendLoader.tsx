import React from 'react';
import type { WarmupStatus } from '../services/backendWarmup';

interface BackendLoaderProps {
  status: WarmupStatus | null;
}

const messages: Record<string, string[]> = {
  waking: [
    'Waking up the server…',
    'Still warming up…',
    'Almost there, hang tight…',
    'Server starting up…',
    'Loading, please wait…',
    'Just a few more seconds…',
  ],
  ready: ['Connected! Loading your experience…'],
  timeout: ['Taking longer than usual, continuing anyway…'],
};

export const BackendLoader: React.FC<BackendLoaderProps> = ({ status }) => {
  if (!status || status.phase === 'ready') return null;

  const msgs = messages[status.phase] ?? messages.waking;
  const message = msgs[Math.min(status.attempt - 1, msgs.length - 1)];

  // Progress: 0–80% while waking (6 attempts), 100% on ready/timeout
  const progress =
    status.phase === 'waking'
      ? Math.min(((status.attempt - 1) / 6) * 80, 80)
      : 100;

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        {/* Logo / Brand */}
        <div style={styles.brand}>
          <span style={styles.brandDot} />
          <span style={styles.brandName}>Winway</span>
        </div>

        {/* Spinner */}
        <div style={styles.spinnerWrapper}>
          <div style={styles.spinnerOuter}>
            <div style={styles.spinnerInner} />
          </div>
          <div style={styles.spinnerPulse} />
        </div>

        {/* Message */}
        <p style={styles.message}>{message}</p>

        {/* Progress bar */}
        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressBar,
              width: `${progress}%`,
              transition: 'width 1.2s ease',
            }}
          />
        </div>

        <p style={styles.subtext}>
          Free hosting servers sleep when idle.
          <br />
          First load may take up to 30 seconds.
        </p>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '3rem 2.5rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '1.5rem',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
    maxWidth: '380px',
    width: '90%',
    textAlign: 'center',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  brandDot: {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f7971e, #ffd200)',
    boxShadow: '0 0 12px rgba(247,151,30,0.7)',
  },
  brandName: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.5px',
  },
  spinnerWrapper: {
    position: 'relative',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerOuter: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    border: '3px solid transparent',
    borderTopColor: '#f7971e',
    borderRightColor: '#ffd200',
    animation: 'spin 1s linear infinite',
  },
  spinnerInner: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    border: '3px solid transparent',
    borderBottomColor: 'rgba(247,151,30,0.4)',
    animation: 'spin 1.5s linear infinite reverse',
  },
  spinnerPulse: {
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f7971e, #ffd200)',
    animation: 'pulse 2s ease-in-out infinite',
    boxShadow: '0 0 20px rgba(247,151,30,0.5)',
  },
  message: {
    fontSize: '1.05rem',
    fontWeight: 500,
    color: '#fff',
    margin: 0,
  },
  progressTrack: {
    width: '100%',
    height: '4px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '100px',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    background: 'linear-gradient(90deg, #f7971e, #ffd200)',
    borderRadius: '100px',
    boxShadow: '0 0 8px rgba(247,151,30,0.6)',
  },
  subtext: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
    lineHeight: 1.6,
  },
};

// Inject keyframe animations once
if (typeof document !== 'undefined') {
  const styleId = 'backend-loader-styles';
  if (!document.getElementById(styleId)) {
    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = `
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.3); opacity: 0.7; }
      }
    `;
    document.head.appendChild(styleEl);
  }
}

export default BackendLoader;
