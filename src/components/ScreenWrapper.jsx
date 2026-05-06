import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import './ScreenWrapper.css'

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '30%' : '-30%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-15%' : '15%', opacity: 0 }),
}

export default function ScreenWrapper({ direction, dark, children, bottomBar }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo(0, 0)
    requestAnimationFrame(() => {
      el.scrollTo(0, 0)
      setTimeout(() => el.scrollTo(0, 0), 100)
      setTimeout(() => el.scrollTo(0, 0), 350)
    })
  }, [])

  return (
    <motion.div
      className={`screen ${dark ? 'screen--dark' : ''}`}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="screen-scroll" ref={scrollRef}>
        {children}
      </div>
      {bottomBar && (
        <div className="bottom-bar">
          {bottomBar}
        </div>
      )}
    </motion.div>
  )
}

export function CtaButton({ children, onClick, variant = 'primary', className = '', disabled = false }) {
  return (
    <button
      className={`cta-btn cta-${variant} ${className} ${disabled ? 'cta-disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export function BackButton({ onClick }) {
  return (
    <button className="cta-btn cta-back" onClick={onClick}>
      ←
    </button>
  )
}
