import { motion } from 'framer-motion'
import ScreenWrapper, { CtaButton } from '../components/ScreenWrapper'
import './EntryScreen.css'

const cardBenefits = [
  { icon: 'fee', title: 'Zero Fee Card', desc: 'Annual fee of ₹499 waived for first 4 years' },
  { icon: 'reward', title: 'Rewards on Spends', desc: '1 Reward Point per ₹100 spent on all purchases' },
  { icon: 'grow', title: 'MFs Keep Growing', desc: 'Your mutual funds continue to earn market returns while used as security' },
  { icon: 'milestone', title: 'Milestone Cashback', desc: '₹500 cashback on annual spends of ₹50,000+' },
  { icon: 'credit', title: 'Build Credit Score', desc: 'Regular usage builds your CIBIL score for future upgrades' },
]

function BenefitIcon({ type }) {
  const icons = {
    fee: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="#1FA8E1" strokeWidth="1.3"/><path d="M6 9h6M9 6v6" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round"/></svg>,
    reward: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l2.2 4.5 5 .7-3.6 3.5.8 5L9 13.5 4.6 15.7l.8-5-3.6-3.5 5-.7L9 2z" stroke="#1FA8E1" strokeWidth="1.2" strokeLinejoin="round"/></svg>,
    grow: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 14V5a2 2 0 012-2h6" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round"/><path d="M6 11l3-4 3 3 3-5" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="15" cy="5" r="0.8" fill="#1FA8E1"/></svg>,
    milestone: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="7" r="5" stroke="#1FA8E1" strokeWidth="1.3"/><path d="M6.5 12.5L5 17l4-2 4 2-1.5-4.5" stroke="#1FA8E1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 7l1.5 1.5L11 5.5" stroke="#1FA8E1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    credit: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 14V5a2 2 0 012-2h6" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round"/><path d="M6 14l3-4 3 2 3-5" stroke="#1FA8E1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="15" cy="7" r="0.8" fill="#1FA8E1"/></svg>,
  }
  return <div className="ben-icon-wrap">{icons[type]}</div>
}

export default function EntryScreen({ direction, onNext }) {
  return (
    <ScreenWrapper
      direction={direction}
      bottomBar={<CtaButton onClick={onNext}>Apply Now</CtaButton>}
    >
      <div className="hero-section">
        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.div
            className="hero-card-wrap"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src="/sbic-unnati-card.webp" alt="SBI Card Unnati" className="hero-main-card" />
          </motion.div>

          <motion.div
            className="hero-fd-badge"
            initial={{ scale: 0, x: -20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 180 }}
          >
            <div className="fd-badge-rate">+24.8%</div>
            <div className="fd-badge-label">MF Returns p.a.</div>
          </motion.div>

          <motion.div
            className="hero-cl-badge"
            initial={{ scale: 0, x: 20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 180 }}
          >
            <div className="cl-badge-val">Up to ₹5L</div>
            <div className="cl-badge-label">Credit Limit</div>
          </motion.div>
        </motion.div>

        <motion.h1
          className="entry-title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Your Mutual Funds.<br />Your Card. Your Score.
        </motion.h1>
        <motion.p
          className="entry-tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Use your existing Mutual Funds as security. Get an SBI Card instantly. Keep earning returns while you spend.
        </motion.p>
      </div>

      <div className="info-card">
        <div className="info-row"><span className="label">Name</span><span className="val">Rahul Sharma</span></div>
        <div className="info-row"><span className="label">PAN</span><span className="val">XXXXX1234X</span></div>
      </div>

      <div className="section-title">SBI Card Unnati Benefits</div>
      <div className="card-benefits">
        {cardBenefits.map((b, i) => (
          <motion.div
            className="card-ben-row"
            key={b.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.08 }}
          >
            <BenefitIcon type={b.icon} />
            <div className="card-ben-text">
              <div className="card-ben-title">{b.title}</div>
              <div className="card-ben-desc">{b.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="section-title">How it works</div>
      <div className="steps-visual">
        {[
          { num: '1', title: 'Complete KYC', desc: 'Quick video verification — takes about 3 minutes' },
          { num: '2', title: 'We Fetch Your Portfolio', desc: 'Your MF holdings are fetched via PAN automatically' },
          { num: '3', title: 'Select Funds as Security', desc: 'Choose eligible funds — you keep ownership & returns' },
          { num: '4', title: 'Authorise via CAMS OTP', desc: 'One OTP to place a hold on your selected funds' },
          { num: '5', title: 'Get Your SBI Card', desc: 'Virtual card instantly, physical card in 5–7 days' },
        ].map((s, i) => (
          <motion.div
            className="step-row"
            key={s.num}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.08 }}
          >
            <div className="step-num">{s.num}</div>
            <div className="step-info">
              <div className="step-title">{s.title}</div>
              <div className="step-desc">{s.desc}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="trust-strip">
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1L2 3.5V6.5C2 9.8 4.1 12.6 7 13C9.9 12.6 12 9.8 12 6.5V3.5L7 1Z" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1"/>
            <path d="M5 7L6.5 8.5L9.5 5" stroke="#16a34a" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>SEBI Regulated</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="3" width="12" height="8" rx="1.5" stroke="#16a34a" strokeWidth="1" fill="#f0fdf4"/>
            <path d="M1 5.5h12" stroke="#16a34a" strokeWidth="1"/>
          </svg>
          <span>Zero Annual Fee*</span>
        </div>
        <div className="trust-divider" />
        <div className="trust-item">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.5" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1"/>
            <path d="M7 4v3l2 1.5" stroke="#16a34a" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Instant Card</span>
        </div>
      </div>

      <div className="trust-note">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="6" cy="6" r="5" stroke="#ccc" strokeWidth="1"/>
          <path d="M6 3.5v2.5M6 8h.01" stroke="#ccc" strokeWidth="1" strokeLinecap="round"/>
        </svg>
        <span>Your details are fetched from your GPay account</span>
      </div>

      <div className="next-step-card">
        <div className="nsc-label">Before we begin</div>
        <div className="nsc-steps">
          <div className="nsc-step active">
            <div className="nsc-dot" />
            <span>Identity check <span className="nsc-time">~3 min video call</span></span>
          </div>
          <div className="nsc-step">
            <div className="nsc-dot dim" />
            <span>Select funds as security</span>
          </div>
          <div className="nsc-step">
            <div className="nsc-dot dim" />
            <span>Authorise & get your card</span>
          </div>
        </div>
      </div>
    </ScreenWrapper>
  )
}
