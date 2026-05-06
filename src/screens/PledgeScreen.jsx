import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './PledgeScreen.css'

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

const MF_PORTFOLIO = [
  { id: 'axis-bluechip', name: 'Axis Bluechip Fund', house: 'Axis MF', category: 'Equity', currentValue: 312500, ltv: 0.50 },
  { id: 'mirae-emerging', name: 'Mirae Asset Emerging Bluechip', house: 'Mirae Asset', category: 'Equity', currentValue: 241200, ltv: 0.50 },
  { id: 'ppfas-flexi', name: 'Parag Parikh Flexi Cap Fund', house: 'PPFAS MF', category: 'Equity', currentValue: 157800, ltv: 0.50 },
  { id: 'sbi-bluechip', name: 'SBI Bluechip Fund', house: 'SBI MF', category: 'Equity', currentValue: 189000, ltv: 0.50 },
  { id: 'hdfc-short-term', name: 'HDFC Short Term Debt Fund', house: 'HDFC MF', category: 'Debt', currentValue: 121000, ltv: 0.80 },
  { id: 'hdfc-midcap', name: 'HDFC Mid-Cap Opportunities', house: 'HDFC MF', category: 'Equity', currentValue: 107100, ltv: 0.50 },
]

function creditLimitFor(fund) {
  return Math.round(fund.currentValue * fund.ltv)
}

const PLEDGE_STEPS = [
  { id: 1, pending: 'Sending request to CAMS...', done: 'Request sent to CAMS' },
  { id: 2, pending: 'Marking lien on funds...', done: 'Lien marked on selected funds' },
  { id: 3, pending: 'Activating credit limit...', done: 'Credit limit is live' },
]

const OTP_LENGTH = 6

function OtpInput({ onComplete }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''))
  const refs = useRef([])

  // Autofill for prototype demo
  useEffect(() => {
    const t = setTimeout(() => {
      setDigits(['1','2','3','4','5','6'])
      if (document.activeElement) document.activeElement.blur()
      setTimeout(() => onComplete('123456'), 350)
    }, 1500)
    return () => clearTimeout(t)
  }, [])

  const focusAt = useCallback((idx) => {
    refs.current[idx]?.focus()
  }, [])

  const handleChange = useCallback((idx, val) => {
    const ch = val.replace(/\D/g, '').slice(-1)
    setDigits(prev => {
      const next = [...prev]
      next[idx] = ch
      if (ch && idx < OTP_LENGTH - 1) {
        setTimeout(() => focusAt(idx + 1), 0)
      }
      const full = next.join('')
      if (full.length === OTP_LENGTH && !next.includes('')) {
        // Dismiss keyboard before completing so iOS resets viewport
        if (document.activeElement) document.activeElement.blur()
        setTimeout(() => onComplete(full), 350)
      }
      return next
    })
  }, [focusAt, onComplete])

  const handleKeyDown = useCallback((idx, e) => {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        setDigits(prev => { const n = [...prev]; n[idx] = ''; return n })
      } else if (idx > 0) {
        focusAt(idx - 1)
        setDigits(prev => { const n = [...prev]; n[idx - 1] = ''; return n })
      }
    } else if (e.key === 'ArrowLeft' && idx > 0) {
      focusAt(idx - 1)
    } else if (e.key === 'ArrowRight' && idx < OTP_LENGTH - 1) {
      focusAt(idx + 1)
    }
  }, [digits, focusAt])

  const handlePaste = useCallback((e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!text) return
    e.preventDefault()
    const next = Array(OTP_LENGTH).fill('')
    text.split('').forEach((ch, i) => { next[i] = ch })
    setDigits(next)
    const lastFilled = Math.min(text.length, OTP_LENGTH - 1)
    setTimeout(() => focusAt(lastFilled), 0)
    if (text.length === OTP_LENGTH) {
      if (document.activeElement) document.activeElement.blur()
      setTimeout(() => onComplete(text), 350)
    }
  }, [focusAt, onComplete])

  return (
    <div className="otp-boxes">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => refs.current[i] = el}
          className={`otp-box ${d ? 'filled' : ''}`}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={d}
          autoFocus={i === 0}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={e => e.target.select()}
        />
      ))}
    </div>
  )
}

function ResendTimer({ onResend }) {
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  if (seconds > 0) {
    return (
      <p className="otp-resend">
        Didn't receive it? Resend in <span className="otp-resend-timer">0:{String(seconds).padStart(2, '0')}</span>
      </p>
    )
  }

  return (
    <p className="otp-resend">
      <button className="otp-resend-btn" onClick={() => { setSeconds(30); onResend() }}>Resend OTP</button>
    </p>
  )
}

export default function PledgeScreen({ direction, selectedFunds, creditLimit, onNext, onBack }) {
  const [phase, setPhase] = useState('review') // review | otp | processing
  const [activeStep, setActiveStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState([])
  const [processingDone, setProcessingDone] = useState(false)

  // Body scroll lock when OTP phase active — prevents iOS keyboard from scrolling background
  useEffect(() => {
    if (phase === 'otp') {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
    } else {
      const top = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
      if (top) window.scrollTo(0, parseInt(top) * -1)
    }
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      document.body.style.overflow = ''
    }
  }, [phase])

  const pledgedFunds = MF_PORTFOLIO.filter(f => selectedFunds.includes(f.id))
  const totalValue = pledgedFunds.reduce((s, f) => s + f.currentValue, 0)

  useEffect(() => {
    if (phase !== 'processing') return
    const timers = []
    timers.push(setTimeout(() => setActiveStep(1), 600))
    timers.push(setTimeout(() => { setDoneSteps([1]); setActiveStep(2); }, 2000))
    timers.push(setTimeout(() => { setDoneSteps([1, 2]); setActiveStep(3); }, 3400))
    timers.push(setTimeout(() => { setDoneSteps([1, 2, 3]); setProcessingDone(true); }, 4600))
    timers.push(setTimeout(() => onNext(), 6000))
    return () => timers.forEach(clearTimeout)
  }, [phase, onNext])

  if (phase === 'review') {
    return (
      <ScreenWrapper
        direction={direction}
        bottomBar={
          <>
            <BackButton onClick={onBack} />
            <CtaButton onClick={() => setPhase('otp')}>Activate My Limit</CtaButton>
          </>
        }
      >
        <h1>Activate Your Card Limit</h1>
        <p className="helper-text">Your selected funds will back your card. They stay in your portfolio and keep growing — you just won't be able to sell them while the card is active.</p>

        <div className="pledge-cl-card">
          <div className="pcl-label">Credit Limit You'll Receive</div>
          <div className="pcl-amount">{fmtINR(creditLimit)}</div>
          <div className="pcl-sub">on {pledgedFunds.length} fund{pledgedFunds.length !== 1 ? 's' : ''} · Total value {fmtINR(totalValue)}</div>
        </div>

        <div className="section-title">Funds Backing Your Card</div>
        <div className="pledged-fund-list">
          {pledgedFunds.map((fund) => (
            <div className="pledged-fund-row" key={fund.id}>
              <div className="pf-left">
                <div className={`pf-dot ${fund.category === 'Debt' ? 'debt' : 'equity'}`} />
                <div>
                  <div className="pf-name">{fund.name}</div>
                  <div className="pf-meta">{fund.category} · {fmtINR(fund.currentValue)}</div>
                </div>
              </div>
              <div className="pf-cl">
                <div className="pf-cl-val">{fmtINR(creditLimitFor(fund))}</div>
                <div className="pf-cl-ltv">{(fund.ltv * 100).toFixed(0)}% LTV</div>
              </div>
            </div>
          ))}
        </div>

        <div className="pledge-explainer">
          <div className="pe-title">What happens to your funds?</div>
          <div className="pe-row">
            <div className="pe-icon green">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span>You still own the funds — they stay in your account</span>
          </div>
          <div className="pe-row">
            <div className="pe-icon green">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span>NAV keeps growing — you earn all market returns</span>
          </div>
          <div className="pe-row">
            <div className="pe-icon yellow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke="#ca8a04" strokeWidth="1"/><path d="M6 4v2.5M6 8.5h.01" stroke="#ca8a04" strokeWidth="1" strokeLinecap="round"/></svg>
            </div>
            <span>You cannot redeem these units while the card is active</span>
          </div>
          <div className="pe-row">
            <div className="pe-icon green">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span>The hold is removed instantly when you close the card</span>
          </div>
        </div>

        <div className="pledge-secure-note">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L2 3.5V6.5C2 9.8 4.1 12.6 7 13C9.9 12.6 12 9.8 12 6.5V3.5L7 1Z" stroke="#16a34a" strokeWidth="1" fill="#f0fdf4"/>
            <path d="M5 7L6.5 8.5L9 5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Done digitally via CAMS — SEBI regulated</span>
        </div>
      </ScreenWrapper>
    )
  }

  if (phase === 'otp') {
    return (
      <ScreenWrapper
        direction={direction}
        bottomBar={
          <BackButton onClick={() => setPhase('review')} />
        }
      >
        <div className="otp-phase">
          <div className="otp-lock-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="6" y="14" width="20" height="14" rx="3" fill="#f0f9ff" stroke="#1FA8E1" strokeWidth="1.5"/>
              <path d="M10 14v-4a6 6 0 0112 0v4" stroke="#1FA8E1" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="16" cy="21" r="2" fill="#1FA8E1"/>
              <path d="M16 23v2" stroke="#1FA8E1" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>

          <h1 className="otp-title">Authorise with OTP</h1>
          <p className="otp-subtitle">
            CAMS has sent a 6-digit OTP to your registered mobile number ending in <strong>XXXXX</strong>. Enter it to authorise the security hold on your selected funds.
          </p>

          <div className="otp-funds-summary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L2 3.5V6.5C2 9.8 4.1 12.6 7 13C9.9 12.6 12 9.8 12 6.5V3.5L7 1Z" stroke="#1FA8E1" strokeWidth="1" fill="#f0f9ff"/>
              <path d="M5 7L6.5 8.5L9.5 5" stroke="#1FA8E1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Authorising hold on {pledgedFunds.length} fund{pledgedFunds.length !== 1 ? 's' : ''} · {fmtINR(creditLimit)} credit limit</span>
          </div>

          <OtpInput onComplete={() => setPhase('processing')} />

          <ResendTimer onResend={() => {}} />

          <div className="otp-info-note">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="#aaa" strokeWidth="1"/>
              <path d="M6 4v2.5M6 8h.01" stroke="#aaa" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <span>CAMS is the official registrar for your mutual fund folios. This OTP is required by SEBI regulations before any hold can be placed on your units.</span>
          </div>
        </div>
      </ScreenWrapper>
    )
  }

  return (
    <ScreenWrapper direction={direction}>
      <div className="pledge-processing">
        <div className="concentric-wrap">
          <motion.div className="concentric-circle c1" animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.05, 0.15] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }} />
          <motion.div className="concentric-circle c2" animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.08, 0.2] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
          <motion.div className="concentric-circle c3" animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.12, 0.25] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} />
          <motion.div className="concentric-circle c4" animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.15, 0.3] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }} />

          <AnimatePresence mode="wait">
            {!processingDone ? (
              <motion.div key="dot" className="center-dot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} />
            ) : (
              <motion.div key="check" className="center-check" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <motion.path d="M5 12L10 17L19 7" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.2 }} />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {!processingDone ? (
            <motion.div key="processing" className="proc-text-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <h2 className="proc-title">Activating Your Card Limit</h2>
              <p className="proc-sub">Communicating with CAMS...</p>
            </motion.div>
          ) : (
            <motion.div key="done" className="proc-text-wrap" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="proc-title proc-title-success">Limit Activated!</h2>
              <p className="proc-sub">{fmtINR(creditLimit)} credit limit is live</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pledge-step-pills">
          {PLEDGE_STEPS.map((s) => {
            const isDone = doneSteps.includes(s.id)
            const isActive = activeStep === s.id
            return (
              <motion.div
                key={s.id}
                className={`vc-pill ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                animate={{ opacity: isActive || isDone ? 1 : 0.3 }}
              >
                {isDone ? '✓' : isActive ? '…' : s.id}
                <span>{isDone ? s.done : s.pending.replace('...', '')}</span>
              </motion.div>
            )
          })}
        </div>

        <motion.div className="sebi-badge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <div className="sebi-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 1L3 4.5V9C3 13.5 5.8 17.3 10 18C14.2 17.3 17 13.5 17 9V4.5L10 1Z" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.2"/>
              <path d="M7 10L9 12L13 7.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="sebi-text">
            <span className="sebi-main">Hold via CAMS · SEBI Regulated</span>
            <span className="sebi-sub">SEBI Regulated · RBI Compliant</span>
          </div>
        </motion.div>
      </div>
    </ScreenWrapper>
  )
}
