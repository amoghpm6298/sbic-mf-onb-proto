import './PhoneFrame.css'

export default function PhoneFrame({ stepper, children, showHeader = true }) {
  return (
    <div className="app-shell">
      {showHeader && (
        <div className="top-bar">
          <div className="brand">
            <img src="/sbi-card-logo.png" alt="SBI Card" />
          </div>
          <div className="powered-by">
            Powered by <img src="/hyperface-logo.png" alt="Hyperface" className="hf-logo-img" />
          </div>
        </div>
      )}
      {stepper}
      <div className="screen-area">
        {children}
      </div>
    </div>
  )
}
