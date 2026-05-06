import { motion } from 'framer-motion'
import './RejectionScreen.css'

export default function RejectionScreen({ direction, onNext }) {
  return (
    <motion.div
      className="rejection-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="rej-content">
        <motion.h1
          className="rej-greeting"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Dear Rahul,<br />thank you for your request
        </motion.h1>

        <motion.p
          className="rej-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          We regret to inform you that we are unable to process your card application due to internal policies.
        </motion.p>
      </div>

      <motion.div
        className="rej-offer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="rej-offer-badge">NEW OFFER</div>
        <p className="rej-offer-title">Get an MF-Backed Credit Card</p>
        <p className="rej-offer-desc">Pledge your Mutual Funds. Get an SBI Card. Build your credit score — while your funds keep growing.</p>

        <div className="rej-offer-card-preview">
          <img src="/sbic-unnati-card.webp" alt="SBI Card Unnati" className="rej-card-img" />
        </div>

        <div className="rej-offer-highlights">
          <div className="rej-highlight">
            <div className="rej-hl-value">Any MF</div>
            <div className="rej-hl-label">Eligible Fund</div>
          </div>
          <div className="rej-hl-divider" />
          <div className="rej-highlight">
            <div className="rej-hl-value">Up to 80%</div>
            <div className="rej-hl-label">Loan-to-Value</div>
          </div>
          <div className="rej-hl-divider" />
          <div className="rej-highlight">
            <div className="rej-hl-value">₹0 Fee</div>
            <div className="rej-hl-label">For 4 Years</div>
          </div>
        </div>

        <div className="rej-offer-benefits">
          <div className="rej-ob">✓ Your MFs keep growing even while pledged</div>
          <div className="rej-ob">✓ Build your CIBIL score for future unsecured cards</div>
          <div className="rej-ob">✓ SEBI regulated, lien via CAMS / CDSL</div>
        </div>

        <button className="rej-offer-cta" onClick={onNext}>
          Apply Now
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 6 }}>
            <path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </motion.div>

      <div className="rej-ctas">
        <motion.button
          className="rej-cta-exit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Exit
        </motion.button>
      </div>
    </motion.div>
  )
}
