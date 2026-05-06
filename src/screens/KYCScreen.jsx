import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './KYCScreen.css'

const requirements = [
  { icon: 'camera', text: 'Working camera & microphone' },
  { icon: 'light', text: 'Good lighting' },
  { icon: 'card', text: 'Original PAN card' },
  { icon: 'wifi', text: 'Stable internet connection' },
]

const vSteps = [
  { id: 1, pending: 'Verifying face...', done: 'Face verified' },
  { id: 2, pending: 'Checking PAN card...', done: 'PAN verified' },
  { id: 3, pending: 'Confirming details...', done: 'Details confirmed' },
]

function ReqIcon({ type }) {
  return (
    <div className="req-icon-wrap">
      {type === 'camera' && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="5" width="14" height="10" rx="2" stroke="#666" strokeWidth="1.3"/><circle cx="9" cy="10" r="2.5" stroke="#666" strokeWidth="1.3"/><path d="M6 5L7 3h4l1 2" stroke="#666" strokeWidth="1.3"/></svg>
      )}
      {type === 'light' && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="8" r="3.5" stroke="#666" strokeWidth="1.3"/><path d="M9 2v1M9 13v1M3 8h1M14 8h1M4.5 3.5l.7.7M12.8 3.5l-.7.7M4.5 12.5l.7-.7M12.8 12.5l-.7-.7" stroke="#666" strokeWidth="1.3" strokeLinecap="round"/><path d="M7.5 14h3" stroke="#666" strokeWidth="1.3" strokeLinecap="round"/></svg>
      )}
      {type === 'card' && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="4" width="14" height="10" rx="2" stroke="#666" strokeWidth="1.3"/><path d="M2 7.5h14" stroke="#666" strokeWidth="1.3"/><path d="M5 11h3" stroke="#666" strokeWidth="1.3" strokeLinecap="round"/></svg>
      )}
      {type === 'wifi' && (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="14" r="1" fill="#666"/><path d="M5.5 11.5a5 5 0 017 0M3 9a8.5 8.5 0 0112 0" stroke="#666" strokeWidth="1.3" strokeLinecap="round"/></svg>
      )}
    </div>
  )
}

export default function KYCScreen({ direction, onNext, onBack }) {
  const [phase, setPhase] = useState('prep') // prep | video | success
  const [connected, setConnected] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState([])
  const [processingDone, setProcessingDone] = useState(false)

  const startVkyc = useCallback(() => {
    setPhase('video')
    setConnected(false)
    setActiveStep(0)
    setDoneSteps([])
    setProcessingDone(false)
  }, [])

  useEffect(() => {
    if (phase !== 'video') return
    const timers = []

    timers.push(setTimeout(() => setConnected(true), 2000))
    timers.push(setTimeout(() => setActiveStep(1), 2500))
    timers.push(setTimeout(() => { setDoneSteps(d => [...d, 1]); setActiveStep(2); }, 4000))
    timers.push(setTimeout(() => { setDoneSteps(d => [...d, 2]); setActiveStep(3); }, 5500))
    timers.push(setTimeout(() => { setDoneSteps(d => [...d, 3]); setActiveStep(4); setProcessingDone(true); }, 7000))
    timers.push(setTimeout(() => setPhase('success'), 8000))

    return () => timers.forEach(clearTimeout)
  }, [phase])

  // Prep phase
  if (phase === 'prep') {
    return (
      <ScreenWrapper
        direction={direction}
        bottomBar={
          <>
            <BackButton onClick={onBack} />
            <CtaButton onClick={startVkyc}>Start Video Verification</CtaButton>
          </>
        }
      >
        <h1>First, a quick identity check</h1>
        <p className="helper-text">To access your MF portfolio and set up your card, we need to confirm who you are. A live KYC agent will join a short video call — takes 3–5 minutes.</p>

        <div className="kyc-req-card">
          <div className="kyc-req-title">What You'll Need</div>
          {requirements.map((r) => (
            <div className="req-row" key={r.text}>
              <ReqIcon type={r.icon} />
              <span>{r.text}</span>
            </div>
          ))}
        </div>

        <div className="info-card">
          <div className="info-row"><span className="label">Name</span><span className="val">Rahul Sharma</span></div>
          <div className="info-row"><span className="label">PAN</span><span className="val">XXXXX1234X</span></div>
          <div className="info-row"><span className="label">Aadhaar</span><span className="val">XXXX XXXX 4523</span></div>
        </div>

        <div className="warn-banner">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <circle cx="9" cy="9" r="7.5" fill="#FEF9C3" stroke="#CA8A04" strokeWidth="0.8"/>
            <path d="M9 6v3.5M9 12h.01" stroke="#CA8A04" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span>A live agent will join a short video call with you. Have your PAN card handy — the whole thing takes 3–5 minutes.</span>
        </div>
      </ScreenWrapper>
    )
  }

  // Video phase - realistic video call UI
  if (phase === 'video') {
    return (
      <ScreenWrapper direction={direction}>
        <div className="video-call-screen">
          {/* Agent video area */}
          <div className="vc-agent-area">
            <div className="vc-agent-placeholder">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="18" r="8" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5"/>
                <path d="M8 42c0-8 7-14 16-14s16 6 16 14" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <AnimatePresence>
                {connected && (
                  <motion.div
                    className="vc-agent-name-tag"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    KYC Agent: Priya M.
                  </motion.div>
                )}
              </AnimatePresence>
              {!connected && (
                <motion.p
                  className="vc-connecting-text"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Connecting...
                </motion.p>
              )}
            </div>

            {/* Self-view small */}
            <div className="vc-self-view">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="9" r="4" stroke="#fff" strokeWidth="1.5"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>

            {/* Recording indicator */}
            {connected && (
              <motion.div
                className="vc-recording"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  className="vc-rec-dot"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span>REC</span>
              </motion.div>
            )}
          </div>

          {/* Call controls */}
          <div className="vc-controls">
            <div className="vc-control-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3v6M7 6l3-3 3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="6" y="9" width="8" height="6" rx="1" stroke="#fff" strokeWidth="1.5"/>
              </svg>
              <span>Camera</span>
            </div>
            <div className="vc-control-btn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="7" y="2" width="6" height="10" rx="3" stroke="#fff" strokeWidth="1.5"/>
                <path d="M4 9a6 6 0 0012 0M10 15v3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>Mic</span>
            </div>
            <div className="vc-control-btn vc-end">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 8c0-1 1.5-3 8-3s8 2 8 3v2c0 .5-.5 1-1.5 1h-2c-.5 0-1-.5-1-1V9c-1-.3-2.3-.5-3.5-.5S7.5 8.7 6.5 9v1c0 .5-.5 1-1 1h-2C2.5 11 2 10.5 2 10V8z" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>End</span>
            </div>
          </div>

          {/* Status bar with verification steps */}
          <div className="vc-status-bar">
            <AnimatePresence mode="wait">
              {!connected ? (
                <motion.div key="c" className="vc-status-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="vc-status-spinner" />
                  <span>Connecting to KYC agent...</span>
                </motion.div>
              ) : processingDone ? (
                <motion.div key="d" className="vc-status-msg vc-status-done" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="8" fill="#16a34a"/>
                    <path d="M5.5 9L8 11.5L12.5 6.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>KYC Completed!</span>
                </motion.div>
              ) : (
                <motion.div key="v" className="vc-status-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span>Verifying your identity...</span>
                </motion.div>
              )}
            </AnimatePresence>

            {connected && (
              <div className="vc-step-pills">
                {vSteps.map((s) => {
                  const isDone = doneSteps.includes(s.id)
                  const isActive = activeStep === s.id
                  return (
                    <motion.div
                      key={s.id}
                      className={`vc-pill ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                      animate={{ opacity: isActive || isDone ? 1 : 0.4 }}
                    >
                      {isDone ? '✓' : isActive ? '...' : s.id}
                      <span>{isDone ? s.done : s.pending.replace('...', '')}</span>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </ScreenWrapper>
    )
  }

  // Success phase
  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={onNext}>View Your Portfolio</CtaButton>}
    >
      <div className="kyc-success">
        <motion.div
          className="success-circle"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <svg viewBox="0 0 50 50" width="40" height="40">
            <motion.path
              d="M14 27 L22 35 L38 16"
              stroke="#16a34a"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
          </svg>
        </motion.div>

        <h1 style={{ textAlign: 'center', fontSize: 20 }}>KYC Completed!</h1>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#999', marginBottom: 24 }}>
          Your identity has been verified successfully
        </p>
      </div>

      <div className="info-card" style={{ border: '1px solid #bbf7d0' }}>
        <div className="ok-list">
          {['Identity Verified', 'Face Match Confirmed', 'PAN Verified', 'Address Confirmed'].map((item) => (
            <div className="ok-item" key={item}>
              <div className="ok-check">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="info-card">
        <div className="section-title" style={{ marginTop: 0 }}>Verified Details</div>
        <div className="info-row"><span className="label">Full Name</span><span className="val">Rahul Sharma</span></div>
        <div className="info-row"><span className="label">Date of Birth</span><span className="val">15 Mar 1992</span></div>
        <div className="info-row"><span className="label">Address</span><span className="val">Sector 15, Gurugram</span></div>
      </div>
    </ScreenWrapper>
  )
}
