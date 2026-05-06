import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import PhoneFrame from './components/PhoneFrame'
import Stepper from './components/Stepper'
import RejectionScreen from './screens/RejectionScreen'
import EntryScreen from './screens/EntryScreen'
import MFPortfolioScreen from './screens/MFPortfolioScreen'
import KYCScreen from './screens/KYCScreen'
import PledgeScreen from './screens/PledgeScreen'
import CardEligibilityScreen from './screens/CardEligibilityScreen'
import ConfirmationScreen from './screens/ConfirmationScreen'
import './App.css'

// Real LAMF flow: KYC first → Portfolio → Authorise (OTP) → Card → Done
const STEPS = ['KYC', 'Portfolio', 'Authorise', 'Card', 'Done']

const MF_CREDIT_MAP = {
  'axis-bluechip':   Math.round(312500 * 0.50),
  'mirae-emerging':  Math.round(241200 * 0.50),
  'ppfas-flexi':     Math.round(157800 * 0.50),
  'sbi-bluechip':    Math.round(189000 * 0.50),
  'hdfc-short-term': Math.round(121000 * 0.80),
  'hdfc-midcap':     Math.round(107100 * 0.50),
}

export default function App() {
  // Step 0 = rejection, 1 = landing, 2–7 = flow
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [selectedFunds, setSelectedFunds] = useState([])

  const goTo = useCallback((s) => {
    if (s < 0 || s > 7) return
    setDirection(s > step ? 1 : -1)
    setStep(s)
  }, [step])

  const next = useCallback(() => goTo(step + 1), [step, goTo])
  const back = useCallback(() => goTo(step - 1), [step, goTo])

  const creditLimit = selectedFunds.reduce((sum, id) => sum + (MF_CREDIT_MAP[id] ?? 0), 0)

  const stepperCurrent = step - 1
  const showStepper = step > 1

  const screens = {
    0: <RejectionScreen key="rejection" direction={direction} onNext={next} />,
    1: <EntryScreen key="entry" direction={direction} onNext={next} />,
    // KYC comes first — identity verified before accessing financial data
    2: <KYCScreen key="kyc" direction={direction} onNext={next} onBack={back} />,
    // Portfolio fetched after identity is confirmed
    3: <MFPortfolioScreen key="mf" direction={direction}
         selectedFunds={selectedFunds} setSelectedFunds={setSelectedFunds}
         onNext={next} onBack={back} />,
    // Authorise: CAMS OTP to mark security hold
    4: <PledgeScreen key="pledge" direction={direction}
         selectedFunds={selectedFunds} creditLimit={creditLimit}
         onNext={next} onBack={back} />,
    5: <CardEligibilityScreen key="card" direction={direction} creditLimit={creditLimit} onNext={next} />,
    6: <ConfirmationScreen key="confirm" direction={direction}
         creditLimit={creditLimit} pledgedCount={selectedFunds.length}
         goTo={() => goTo(0)} />,
  }

  const showHeader = step > 0

  return (
    <div className="app-wrapper">
      <PhoneFrame
        stepper={showStepper ? <Stepper steps={STEPS} current={stepperCurrent} /> : null}
        showHeader={showHeader}
      >
        <AnimatePresence mode="wait" custom={direction}>
          {screens[step]}
        </AnimatePresence>
      </PhoneFrame>
    </div>
  )
}
