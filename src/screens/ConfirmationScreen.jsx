import { motion } from 'framer-motion'
import ScreenWrapper, { CtaButton } from '../components/ScreenWrapper'
import './ConfirmationScreen.css'

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

export default function ConfirmationScreen({ direction, creditLimit, pledgedCount, goTo }) {
  const timeline = [
    { status: 'done', icon: '✓', title: 'Portfolio Fetched', detail: `${pledgedCount} funds selected via PAN` },
    { status: 'done', icon: '✓', title: 'KYC Completed', detail: 'Identity verified successfully' },
    { status: 'done', icon: '✓', title: 'Card Limit Activated', detail: `${fmtINR(creditLimit)} credit limit is live` },
    { status: 'done', icon: '✓', title: 'Application Submitted', detail: '6 May 2026, 11:14 AM' },
    { status: 'pend', icon: '⏲', title: 'Card Approval', detail: 'Within 24 hours' },
    { status: 'future', icon: '📦', title: 'Physical Card Delivery', detail: '5–7 business days' },
  ]

  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={() => goTo(1)}>Back to Home</CtaButton>}
    >
      <div style={{ textAlign: 'center' }}>
        <motion.div
          className="big-check"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <svg viewBox="0 0 50 50" width="40" height="40">
            <motion.path
              d="M14 27 L22 35 L38 16"
              stroke="#16a34a" strokeWidth="3" fill="none"
              strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </svg>
        </motion.div>

        <h1 className="confirm-title">Application Submitted!</h1>
        <p className="confirm-sub">We're processing your application</p>
        <div className="app-tag">SBIC-MF-2026-41832</div>
      </div>

      {/* Credit limit highlight */}
      <motion.div
        className="confirm-cl-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="ccl-label">Your Credit Limit</div>
        <div className="ccl-value">{fmtINR(creditLimit)}</div>
        <div className="ccl-sub">Backed by {pledgedCount} fund{pledgedCount !== 1 ? 's' : ''} as security · Managed by CAMS</div>
      </motion.div>

      <div className="info-card" style={{ textAlign: 'left' }}>
        <div className="timeline">
          {timeline.map((item) => (
            <div className="tl-item" key={item.title}>
              <div className={`tl-dot ${item.status}`}>{item.icon}</div>
              <strong>{item.title}</strong>
              <div className="tl-detail">{item.detail}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="vcard-teaser">
        💳 Your virtual card will be available instantly upon approval
      </div>

      <div className="mf-release-note">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="6" cy="6" r="5" stroke="#1FA8E1" strokeWidth="1"/>
          <path d="M6 4v2.5M6 8h.01" stroke="#1FA8E1" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        <span>Your funds remain active and keep earning returns. The security hold is removed the moment you close the card.</span>
      </div>
    </ScreenWrapper>
  )
}
