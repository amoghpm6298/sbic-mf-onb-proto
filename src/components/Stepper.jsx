import './Stepper.css'

export default function Stepper({ steps, current }) {
  return (
    <div className="stepper">
      {steps.map((label, i) => {
        const stepNum = i + 1
        const isDone = stepNum < current
        const isActive = stepNum === current
        return (
          <div key={label} className={`step-item ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}>
            <div className="step-dot">
              {isDone ? '✓' : stepNum}
            </div>
            <div className="step-label">{label}</div>
            {i < steps.length - 1 && <div className="step-line" />}
          </div>
        )
      })}
    </div>
  )
}
