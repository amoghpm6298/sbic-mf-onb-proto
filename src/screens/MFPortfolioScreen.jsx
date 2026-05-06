import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ScreenWrapper, { CtaButton, BackButton } from '../components/ScreenWrapper'
import './MFPortfolioScreen.css'

function fmtINR(n) {
  return '₹' + n.toLocaleString('en-IN')
}

function fmtPct(n) {
  return (n >= 0 ? '+' : '') + n.toFixed(1) + '%'
}

const MF_PORTFOLIO = [
  {
    id: 'axis-bluechip',
    name: 'Axis Bluechip Fund',
    house: 'Axis MF',
    category: 'Equity',
    subCategory: 'Large Cap',
    invested: 250000,
    currentValue: 312500,
    returns: 25.0,
    ltv: 0.50,
    pledgeable: true,
    individualEligible: true,
  },
  {
    id: 'mirae-emerging',
    name: 'Mirae Asset Emerging Bluechip',
    house: 'Mirae Asset',
    category: 'Equity',
    subCategory: 'Mid Cap',
    invested: 180000,
    currentValue: 241200,
    returns: 34.0,
    ltv: 0.50,
    pledgeable: true,
    individualEligible: true,
  },
  {
    id: 'ppfas-flexi',
    name: 'Parag Parikh Flexi Cap Fund',
    house: 'PPFAS MF',
    category: 'Equity',
    subCategory: 'Flexi Cap',
    invested: 120000,
    currentValue: 157800,
    returns: 31.5,
    ltv: 0.50,
    pledgeable: true,
    individualEligible: true,
  },
  {
    id: 'sbi-bluechip',
    name: 'SBI Bluechip Fund',
    house: 'SBI MF',
    category: 'Equity',
    subCategory: 'Large Cap',
    invested: 150000,
    currentValue: 189000,
    returns: 26.0,
    ltv: 0.50,
    pledgeable: true,
    individualEligible: true,
  },
  {
    id: 'hdfc-short-term',
    name: 'HDFC Short Term Debt Fund',
    house: 'HDFC MF',
    category: 'Debt',
    subCategory: 'Short Duration',
    invested: 110000,
    currentValue: 121000,
    returns: 10.0,
    ltv: 0.80,
    pledgeable: true,
    individualEligible: true,
  },
  {
    id: 'hdfc-midcap',
    name: 'HDFC Mid-Cap Opportunities',
    house: 'HDFC MF',
    category: 'Equity',
    subCategory: 'Mid Cap',
    invested: 85000,
    currentValue: 107100,
    returns: 25.9,
    ltv: 0.50,
    pledgeable: true,
    individualEligible: false,
    ineligibleReason: 'below-min',
  },
  {
    id: 'quant-elss',
    name: 'Quant ELSS Tax Saver Fund',
    house: 'Quant MF',
    category: 'ELSS',
    subCategory: 'Tax Saver',
    invested: 60000,
    currentValue: 78000,
    returns: 30.0,
    ltv: 0,
    pledgeable: false,
    individualEligible: false,
    ineligibleReason: 'locked',
  },
]

const TOTAL_PORTFOLIO_VALUE = MF_PORTFOLIO.reduce((s, f) => s + f.currentValue, 0)
// Only funds that are fully eligible (pledgeable + individually eligible)
const PLEDGEABLE_FUNDS = MF_PORTFOLIO.filter(f => f.pledgeable && f.individualEligible)
const MAX_CREDIT_LIMIT = PLEDGEABLE_FUNDS.reduce((s, f) => s + Math.round(f.currentValue * f.ltv), 0)

function creditLimitFor(fund) {
  return Math.round(fund.currentValue * fund.ltv)
}

function CategoryBadge({ category }) {
  const colors = {
    Equity: { bg: '#eff6ff', color: '#1d4ed8' },
    Debt: { bg: '#f0fdf4', color: '#15803d' },
    Hybrid: { bg: '#fdf4ff', color: '#7e22ce' },
    ELSS: { bg: '#fff7ed', color: '#c2410c' },
  }
  const style = colors[category] || { bg: '#f5f5f5', color: '#666' }
  return (
    <span className="cat-badge" style={{ background: style.bg, color: style.color }}>
      {category}
    </span>
  )
}

function FundHouseAvatar({ house }) {
  const initials = house.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const hues = { 'Axis': '#e63946', 'Mirae': '#0077b6', 'PPFAS': '#2d6a4f', 'SBI': '#023e8a', 'HDFC': '#dc2f02', 'Quant': '#6d23b6' }
  const bg = Object.entries(hues).find(([k]) => house.includes(k))?.[1] ?? '#888'
  return <div className="fh-avatar" style={{ background: bg }}>{initials}</div>
}

function InfoIcon({ onClick }) {
  return (
    <button className="info-icon-btn" onClick={e => { e.stopPropagation(); onClick() }} aria-label="More info">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="6" stroke="#bbb" strokeWidth="1.2"/>
        <path d="M7 6v4M7 4.5h.01" stroke="#bbb" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    </button>
  )
}

function InfoModal({ info, onClose }) {
  return createPortal(
    <AnimatePresence>
      {info && (
        <>
          <motion.div
            className="info-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="info-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            <div className="sheet-handle" />
            <div className="info-sheet-header">
              <div className="info-sheet-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="7.5" fill="#f0f9ff" stroke="#1FA8E1" strokeWidth="1"/>
                  <path d="M9 7.5v4M9 5.5h.01" stroke="#1FA8E1" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="info-sheet-title">{info.title}</h3>
              <button className="sheet-close" onClick={onClose}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5L15 15M15 5L5 15" stroke="#999" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="info-sheet-body">
              {info.body.map((section, i) => (
                <div key={i} className="info-section">
                  {section.heading && <div className="info-heading">{section.heading}</div>}
                  <p className="info-text">{section.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="sk-row">
        <div className="sk-avatar" />
        <div className="sk-lines">
          <div className="sk-line sk-line-lg" />
          <div className="sk-line sk-line-sm" />
        </div>
        <div className="sk-badge" />
      </div>
      <div className="sk-bottom">
        <div className="sk-line sk-line-md" />
        <div className="sk-line sk-line-md" />
        <div className="sk-line sk-line-md" />
      </div>
    </div>
  )
}

const LOAD_STEPS = [
  { id: 1, label: 'Connecting to CAMS...' },
  { id: 2, label: 'Fetching your portfolio...' },
  { id: 3, label: 'Calculating eligibility...' },
]

const INFO = {
  creditLimit: {
    title: 'How is your credit limit calculated?',
    body: [
      { text: 'Your credit limit is based on the current market value of your selected funds, multiplied by the LTV (Loan-to-Value) rate.' },
      { heading: 'LTV rates', text: 'Equity & hybrid funds: 50% of current value\nDebt & liquid funds: 80% of current value' },
      { heading: 'Example', text: 'Fund worth ₹2,00,000 (equity) → Credit limit = ₹1,00,000' },
      { text: 'The limit updates daily as NAVs change. Your funds continue earning returns throughout.' },
    ],
  },
  ltv: {
    title: 'What is LTV (Loan-to-Value)?',
    body: [
      { text: 'LTV is the percentage of your fund\'s current value you receive as a credit limit. It\'s set based on how volatile the fund type is.' },
      { heading: '50% LTV — Equity funds', text: 'Equity markets fluctuate more, so a conservative 50% is applied to protect against market swings.' },
      { heading: '80% LTV — Debt funds', text: 'Debt funds are more stable, so a higher 80% is applied.' },
      { text: 'These rates are set by RBI guidelines (2026) and are standard across all lenders.' },
    ],
  },
  elssLocked: {
    title: 'Why is this fund locked?',
    body: [
      { text: 'ELSS (Equity Linked Savings Scheme) funds have a mandatory 3-year lock-in period set by the Income Tax Act.' },
      { text: 'During this period, units cannot be redeemed, transferred, or used as security for any financial product — including credit cards.' },
      { heading: 'What happens after lock-in?', text: 'Once the 3-year period ends, these units can be included. You\'ll be able to re-apply or update your security at that point.' },
    ],
  },
  belowMin: {
    title: 'Why can\'t I use this fund individually?',
    body: [
      { text: 'To use a specific fund on its own as security, you need a minimum of ₹1,00,000 invested in it.' },
      { heading: 'Why this rule?', text: 'This ensures the credit limit from a single fund is meaningful (at least ₹50,000 at 50% LTV).' },
      { heading: 'Can I still benefit from this fund?', text: 'Yes! Select "Use All Eligible Funds" and this fund\'s value will automatically be included in your total credit limit.' },
    ],
  },
  security: {
    title: 'How do your funds back the card?',
    body: [
      { text: 'A lien (hold) is marked on your selected fund units via CAMS — the official registrar for your folios. This is what gives you the credit limit.' },
      { heading: 'What stays the same', text: '✓ You still own the funds\n✓ NAV keeps growing\n✓ You earn all returns' },
      { heading: 'What changes temporarily', text: '✗ You cannot redeem or sell these units while the card is active' },
      { heading: 'When does the hold go away?', text: 'The moment you close the card — fully digital and instant.' },
    ],
  },
}

export default function MFPortfolioScreen({ direction, selectedFunds, setSelectedFunds, onNext, onBack }) {
  const [phase, setPhase] = useState('loading')
  const [loadStep, setLoadStep] = useState(0)
  const [doneSteps, setDoneSteps] = useState([])
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [info, setInfo] = useState(null)

  useEffect(() => {
    const t1 = setTimeout(() => setLoadStep(1), 800)
    const t2 = setTimeout(() => { setDoneSteps([1]); setLoadStep(2); setShowSkeleton(true) }, 4500)
    const t3 = setTimeout(() => { setDoneSteps([1, 2]); setLoadStep(3) }, 8500)
    const t4 = setTimeout(() => setDoneSteps([1, 2, 3]), 11000)
    const t5 = setTimeout(() => setPhase('portfolio'), 12000)
    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout)
  }, [])

  // Auto-select all eligible funds when portfolio loads
  useEffect(() => {
    if (phase === 'portfolio') {
      setSelectedFunds(PLEDGEABLE_FUNDS.map(f => f.id))
      setSelectAll(true)
    }
  }, [phase])

  const showInfo = (key) => setInfo(INFO[key])

  const handleToggleAll = () => {
    if (selectAll) {
      setSelectedFunds([])
      setSelectAll(false)
    } else {
      setSelectedFunds(PLEDGEABLE_FUNDS.map(f => f.id))
      setSelectAll(true)
    }
  }

  const handleToggleFund = (fund) => {
    if (!fund.individualEligible) return
    setSelectedFunds(prev => {
      const next = prev.includes(fund.id)
        ? prev.filter(id => id !== fund.id)
        : [...prev, fund.id]
      setSelectAll(next.length === PLEDGEABLE_FUNDS.length)
      return next
    })
  }

  const totalCreditLimit = MF_PORTFOLIO
    .filter(f => selectedFunds.includes(f.id))
    .reduce((s, f) => s + creditLimitFor(f), 0)

  if (phase === 'loading') {
    return (
      <ScreenWrapper direction={direction}>
        <div className="mf-loading-screen">
          <motion.div
            className="pan-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Top header row */}
            <div className="pan-top-row">
              <div className="pan-top-left">
                <div className="pan-hi">आयकर विभाग</div>
                <div className="pan-en">INCOME TAX DEPARTMENT</div>
              </div>
              <div className="pan-top-center">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <circle cx="13" cy="13" r="12" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="0.6"/>
                  <circle cx="13" cy="7" r="2.2" fill="rgba(255,255,255,0.75)"/>
                  <ellipse cx="9.5" cy="6.5" rx="1.5" ry="2" fill="rgba(255,255,255,0.6)"/>
                  <ellipse cx="16.5" cy="6.5" rx="1.5" ry="2" fill="rgba(255,255,255,0.6)"/>
                  <rect x="11" y="9" width="4" height="7" rx="0.5" fill="rgba(255,255,255,0.6)"/>
                  <rect x="9" y="15.5" width="8" height="1.2" rx="0.3" fill="rgba(255,255,255,0.5)"/>
                  <circle cx="13" cy="19" r="2.8" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7"/>
                  {[0,1,2,3,4,5,6,7].map(i => (
                    <line key={i}
                      x1={13 + 1.2 * Math.cos(i * Math.PI / 4)}
                      y1={19 + 1.2 * Math.sin(i * Math.PI / 4)}
                      x2={13 + 2.5 * Math.cos(i * Math.PI / 4)}
                      y2={19 + 2.5 * Math.sin(i * Math.PI / 4)}
                      stroke="rgba(255,255,255,0.45)" strokeWidth="0.6"/>
                  ))}
                </svg>
              </div>
              <div className="pan-top-right">
                <div className="pan-hi">भारत सरकार</div>
                <div className="pan-en">GOVT. OF INDIA</div>
              </div>
            </div>

            {/* Card body */}
            <div className="pan-body-row">
              <div className="pan-body-left">
                <div className="pan-redact-bar" />
                <div className="pan-redact-bar" style={{ width: '65%' }} />
                <div className="pan-number-display">ABRPS1234X</div>
                <div className="pan-signature-text">Signature</div>
              </div>
              <div className="pan-body-right">
                <div className="pan-hologram">
                  <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                    <circle cx="19" cy="19" r="18" fill="rgba(200,200,220,0.3)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8"/>
                    <circle cx="19" cy="19" r="13" fill="rgba(180,180,200,0.2)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.7"/>
                    {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
                      <line key={i}
                        x1={19 + 6 * Math.cos(i * Math.PI / 6)}
                        y1={19 + 6 * Math.sin(i * Math.PI / 6)}
                        x2={19 + 12 * Math.cos(i * Math.PI / 6)}
                        y2={19 + 12 * Math.sin(i * Math.PI / 6)}
                        stroke="rgba(255,255,255,0.25)" strokeWidth="0.6"/>
                    ))}
                    <circle cx="19" cy="19" r="3" fill="rgba(255,255,255,0.3)"/>
                    <text x="19" y="33" textAnchor="middle" fontSize="3.5" fill="rgba(255,255,255,0.5)" fontWeight="600">सत्यमेव जयते</text>
                  </svg>
                </div>
                <div className="pan-photo-placeholder">
                  <svg width="36" height="42" viewBox="0 0 36 42" fill="none">
                    <rect width="36" height="42" rx="2" fill="rgba(180,180,200,0.45)"/>
                    <circle cx="18" cy="15" r="7" fill="rgba(130,130,155,0.7)"/>
                    <path d="M4 40c0-8 6.3-13 14-13s14 5 14 13" fill="rgba(130,130,155,0.7)"/>
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="load-steps">
            {LOAD_STEPS.map((s, i) => {
              const isDone = doneSteps.includes(s.id)
              const isActive = loadStep === s.id
              return (
                <motion.div
                  key={s.id}
                  className={`load-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: isActive || isDone ? 1 : 0.3, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="load-step-icon">
                    {isDone ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <circle cx="7" cy="7" r="6" fill="#16a34a"/>
                        <path d="M4 7L6 9L10 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : isActive ? (
                      <div className="load-spinner" />
                    ) : (
                      <div className="load-dot" />
                    )}
                  </div>
                  <span className="load-step-label">{s.label}</span>
                </motion.div>
              )
            })}
          </div>

          <AnimatePresence>
            {showSkeleton && (
              <motion.div className="skeleton-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {[1, 2, 3].map(i => (
                  <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <SkeletonCard />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.p className="load-footer" initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.5 }}>
            Secured via CAMS · SEBI Regulated
          </motion.p>
        </div>
      </ScreenWrapper>
    )
  }

  return (
    <>
      <ScreenWrapper
        direction={direction}
        bottomBar={
          <>
            <BackButton onClick={onBack} />
            <CtaButton onClick={onNext} disabled={selectedFunds.length === 0}>
              {selectedFunds.length === 0 ? 'Select Funds' : `Continue · ${fmtINR(totalCreditLimit)}`}
            </CtaButton>
          </>
        }
      >
        {/* Portfolio summary */}
        <motion.div
          className="portfolio-summary"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="ps-left">
            <div className="ps-label">Total Portfolio</div>
            <div className="ps-value">{fmtINR(TOTAL_PORTFOLIO_VALUE)}</div>
            <div className="ps-sub">{MF_PORTFOLIO.length} funds · as of today</div>
          </div>
          <div className="ps-right">
            <div className="ps-label-row">
              <div className="ps-label">Your Credit Limit</div>
              <InfoIcon onClick={() => showInfo('creditLimit')} />
            </div>
            <motion.div
              key={totalCreditLimit}
              className={`ps-limit ${totalCreditLimit === 0 ? 'ps-limit-empty' : ''}`}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.18 }}
            >
              {totalCreditLimit > 0 ? fmtINR(totalCreditLimit) : '—'}
            </motion.div>
            <div className="ps-sub">
              {totalCreditLimit > 0
                ? `${selectedFunds.length} fund${selectedFunds.length !== 1 ? 's' : ''} selected`
                : 'select funds below'}
            </div>
          </div>
        </motion.div>

        {/* Use All toggle */}
        <motion.div
          className="select-all-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleToggleAll}
        >
          <div className="sa-left">
            <div className={`sa-check ${selectAll ? 'checked' : ''}`}>
              {selectAll && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div>
              <div className="sa-title">Use All Eligible Funds</div>
              <div className="sa-sub">{PLEDGEABLE_FUNDS.length} funds · Max credit {fmtINR(MAX_CREDIT_LIMIT)}</div>
            </div>
          </div>
          <div className="sa-right">
            <div className="sa-badge">Recommended</div>
            <InfoIcon onClick={() => showInfo('security')} />
          </div>
        </motion.div>

        <div className="section-title" style={{ marginTop: 20 }}>Your Mutual Funds</div>

        <div className="fund-list">
          {MF_PORTFOLIO.map((fund, i) => {
            const isSelected = selectedFunds.includes(fund.id)
            const cl = creditLimitFor(fund)
            const gainPct = fmtPct(fund.returns)
            const isLocked = fund.ineligibleReason === 'locked'
            const isBelowMin = fund.ineligibleReason === 'below-min'
            const canSelect = fund.pledgeable && fund.individualEligible

            return (
              <motion.div
                key={fund.id}
                className={`fund-card ${isSelected ? 'selected' : ''} ${!fund.pledgeable ? 'locked' : ''}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                onClick={() => canSelect && handleToggleFund(fund)}
              >
                <div className="fund-card-top">
                  <FundHouseAvatar house={fund.house} />
                  <div className="fund-info">
                    <div className="fund-name">{fund.name}</div>
                    <div className="fund-meta">
                      <CategoryBadge category={fund.category} />
                      <span className="fund-subcategory">{fund.subCategory}</span>
                    </div>
                  </div>
                  <div className="fund-select-area">
                    {isLocked ? (
                      <div className="fund-lock-badge" onClick={e => { e.stopPropagation(); showInfo('elssLocked') }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <rect x="2" y="4.5" width="6" height="4.5" rx="1" stroke="#c2410c" strokeWidth="1"/>
                          <path d="M3.5 4.5V3a1.5 1.5 0 013 0v1.5" stroke="#c2410c" strokeWidth="1" strokeLinecap="round"/>
                        </svg>
                        Locked ⓘ
                      </div>
                    ) : isBelowMin ? (
                      <div className="fund-ineligible-badge" onClick={e => { e.stopPropagation(); showInfo('belowMin') }}>
                        Below ₹1L ⓘ
                      </div>
                    ) : (
                      <div className={`fund-checkbox ${isSelected ? 'checked' : ''}`}>
                        {isSelected && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="fund-card-stats">
                  <div className="fund-stat">
                    <div className="fstat-label">Invested</div>
                    <div className="fstat-value">{fmtINR(fund.invested)}</div>
                  </div>
                  <div className="fund-stat">
                    <div className="fstat-label">Current</div>
                    <div className="fstat-value">{fmtINR(fund.currentValue)}</div>
                  </div>
                  <div className="fund-stat">
                    <div className="fstat-label">Returns</div>
                    <div className={`fstat-value ${fund.returns >= 0 ? 'green' : 'red'}`}>{gainPct}</div>
                  </div>
                </div>

                <div className="fund-card-cl">
                  {isLocked ? (
                    <div className="fcl-locked">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect x="2" y="5.5" width="8" height="5.5" rx="1.2" fill="#fff7ed" stroke="#c2410c" strokeWidth="1"/>
                        <path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="#c2410c" strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                      ELSS — cannot be used during 3-year lock-in period
                    </div>
                  ) : isBelowMin ? (
                    <div className="fcl-below">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <circle cx="6" cy="6" r="5" stroke="#999" strokeWidth="1"/>
                        <path d="M6 4v2.5M6 8.5h.01" stroke="#999" strokeWidth="1" strokeLinecap="round"/>
                      </svg>
                      Invest ₹1L+ to use this fund individually
                    </div>
                  ) : (
                    <div className="fcl-eligible">
                      <span className="fcl-label">Credit Limit from this fund</span>
                      <div className="fcl-right">
                        <span className="fcl-value">{fmtINR(cl)}</span>
                        <button
                          className="fcl-ltv-btn"
                          onClick={e => { e.stopPropagation(); showInfo('ltv') }}
                        >
                          {(fund.ltv * 100).toFixed(0)}% LTV ⓘ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mf-disclaimer">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="6" cy="6" r="5" stroke="#ccc" strokeWidth="1"/>
            <path d="M6 3.5v2.5M6 8h.01" stroke="#ccc" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          Limit = fund value × LTV (50% equity / 80% debt). Funds continue earning returns while used as security.
        </div>
      </ScreenWrapper>

      <InfoModal info={info} onClose={() => setInfo(null)} />
    </>
  )
}
