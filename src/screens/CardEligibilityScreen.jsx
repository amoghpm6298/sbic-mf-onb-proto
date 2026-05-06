import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton } from '../components/ScreenWrapper'
import './CardEligibilityScreen.css'

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

const benefits = [
  { emoji: '🏷️', title: 'Zero Fee Card', desc: 'SBI Card Unnati is free for first 4 years. Annual fee of ₹499 waived off.' },
  { emoji: '🎁', title: 'Rewards on Spends', desc: 'Get 1 Reward Point per ₹100 spent. Redeem against gifts from the Rewards Catalogue.' },
  { emoji: '🏆', title: 'Milestone Rewards', desc: 'Receive ₹500 Cashback within 15 days of achieving annual spends of ₹50,000 or more.' },
  { emoji: '⛽', title: 'Complete Fuel Freedom', desc: '1% fuel surcharge waiver for transactions between ₹500 & ₹3000 (excl. GST).' },
  { emoji: '💳', title: 'Secured Card', desc: 'Backed by your Mutual Funds. Build your credit score with every payment you make.' },
]

const TC_ITEMS = [
  'I agree to the SBI Card Unnati Terms & Conditions and the Most Important Terms & Conditions (MITC).',
  'I authorize SBI Card and CAMS to place a hold on my selected Mutual Fund units for the credit limit sanctioned.',
  'I understand that the credit limit is based on the current value and LTV of my selected funds (50% equity, 80% debt) and may change with NAV.',
  'I agree to receive communications from SBI Card regarding my account via SMS, Email and WhatsApp.',
  'I confirm that the information provided is true and accurate. Any misrepresentation may lead to cancellation.',
  'I have read and understood the Schedule of Charges including interest rates, late payment fees and other applicable charges.',
]

export default function CardEligibilityScreen({ direction, creditLimit, onNext }) {
  const [sheet, setSheet] = useState(null) // null | 'tc' | 'otp'
  const [tcAgreed, setTcAgreed] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const otpRefs = useRef([])

  const handleAvailCard = () => setSheet('tc')

  const handleTcAccept = () => {
    setSheet('otp')
    setOtp(['', '', '', '', '', ''])
    setOtpError(false)
  }

  const focusInput = (index) => {
    const el = otpRefs.current[index]
    if (!el) return
    setTimeout(() => {
      el.focus({ preventScroll: true })
      el.select()
    }, 10)
  }

  const handleOtpChange = (index, value) => {
    // Handle paste of full OTP
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('')
      const newOtp = [...otp]
      digits.forEach((d, i) => { if (index + i < 6) newOtp[index + i] = d })
      setOtp(newOtp)
      setOtpError(false)
      const nextIndex = Math.min(index + digits.length, 5)
      focusInput(nextIndex)
      return
    }

    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setOtpError(false)

    if (value && index < 5) {
      focusInput(index + 1)
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        focusInput(index - 1)
      }
    }
  }

  // Focus first OTP input when sheet opens (once only)
  useEffect(() => {
    if (sheet === 'otp') {
      setTimeout(() => {
        const el = otpRefs.current[0]
        if (el) { el.focus({ preventScroll: true }); el.select() }
      }, 300)
    }
  }, [sheet])

  const handleOtpFocus = (e) => {
    e.target.select()
  }

  const handleOtpVerify = () => {
    const code = otp.join('')
    if (code.length !== 6) {
      setOtpError(true)
      return
    }
    // Blur input to prevent iOS scroll restoration
    if (document.activeElement) document.activeElement.blur()
    setVerifying(true)
    setTimeout(() => {
      setSheet(null)
      // Small delay to let sheet animation complete before navigating
      setTimeout(() => onNext(), 100)
    }, 1500)
  }

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (otp.every(d => d !== '') && sheet === 'otp' && !verifying) {
      handleOtpVerify()
    }
  }, [otp, sheet])

  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={handleAvailCard}>Get My Card</CtaButton>}
    >
      {/* Dark hero section */}
      <div className="card-hero">
        <motion.h1 className="congrats-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          Congratulations!
        </motion.h1>
        <p className="congrats-sub">Your SBI Card Unnati is ready!<br />Review your card details below.</p>
        <motion.div className="card-image-wrap" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}>
          <img src="/sbic-unnati-card.webp" alt="SBI Card Unnati" className="card-image" />
        </motion.div>
      </div>

      {/* White details section */}
      <div className="card-details-section">
        <div className="detail-grid">
          <div className="detail-item"><div className="detail-label">Card Type</div><div className="detail-value">SBI Card Unnati</div></div>
          <div className="detail-item"><div className="detail-label">Credit Limit</div><div className="detail-value blue">{fmtINR(creditLimit)}</div></div>
          <div className="detail-item"><div className="detail-label">Annual Fee</div><div className="detail-value green">₹499 (waived 4 yrs)</div></div>
          <div className="detail-item"><div className="detail-label">Reward Points</div><div className="detail-value">1 / ₹100</div></div>
        </div>

        <div className="section-title" style={{ marginTop: 20 }}>Privileges on SBI Card Unnati</div>
        {benefits.map((b, i) => (
          <motion.div className="privilege-row" key={b.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
            <div className="privilege-emoji">{b.emoji}</div>
            <div className="privilege-text">
              <div className="privilege-title">{b.title}</div>
              <div className="privilege-desc">{b.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── T&C Bottom Sheet (portal) ── */}
      {createPortal(<AnimatePresence>
        {sheet === 'tc' && (
          <>
            <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSheet(null)} />
            <motion.div className="tc-sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="sheet-handle" />
              <div className="sheet-header">
                <h2 className="sheet-title">Terms & Conditions</h2>
                <button className="sheet-close" onClick={() => setSheet(null)}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#999" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className="tc-scroll">
                {TC_ITEMS.map((item, i) => (
                  <div className="tc-item" key={i}>
                    <div className="tc-num">{i + 1}.</div>
                    <p className="tc-text">{item}</p>
                  </div>
                ))}
              </div>
              <div className="tc-fixed-footer">
                <label className="tc-checkbox-row" onClick={() => setTcAgreed(!tcAgreed)}>
                  <div className={`tc-checkbox ${tcAgreed ? 'checked' : ''}`}>
                    {tcAgreed && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span>I have read and agree to all the Terms & Conditions</span>
                </label>
                <button
                  className={`cta-btn cta-primary tc-accept-btn ${!tcAgreed ? 'disabled' : ''}`}
                  onClick={tcAgreed ? handleTcAccept : undefined}
                  disabled={!tcAgreed}
                >
                  Accept & Continue
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>, document.body)}

      {/* ── OTP Bottom Sheet (portal) ── */}
      {createPortal(<AnimatePresence>
        {sheet === 'otp' && (
          <>
            <motion.div className="sheet-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.div className="sheet" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="sheet-handle" />
              <div className="sheet-header">
                <h2 className="sheet-title">Verify with OTP</h2>
                <button className="sheet-close" onClick={() => { setSheet(null); setVerifying(false); }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#999" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className="sheet-body otp-body">
                <p className="otp-desc">
                  SBI has sent a 6-digit OTP to your registered mobile number ending in <strong>XXXX32</strong> to authorise your card application.
                </p>

                <div className="otp-inputs">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el }}
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className={`otp-box ${digit ? 'filled' : ''} ${otpError ? 'error' : ''}`}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      onFocus={handleOtpFocus}
                    />
                  ))}
                </div>

                {otpError && <p className="otp-error">Please enter all 6 digits</p>}

                <div className="otp-resend">
                  Didn't receive OTP? <button className="otp-resend-btn">Resend</button>
                </div>

                {verifying && (
                  <motion.div
                    className="otp-verifying"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="otp-spinner" />
                    <span>Verifying...</span>
                  </motion.div>
                )}

                {!verifying && (
                  <button className="cta-btn cta-primary otp-verify-btn" onClick={handleOtpVerify}>
                    Verify OTP
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>, document.body)}
    </ScreenWrapper>
  )
}
