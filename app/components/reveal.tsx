'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function Reveal({ children, delay = 0, width = '100%', slide = true }: { children: React.ReactNode, delay?: number, width?: '100%' | 'fit-content', slide?: boolean }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  return (
    <div ref={ref} style={{ position: 'relative', width, overflow: 'hidden' }}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: slide ? 50 : 0 },
          visible: { opacity: 1, y: 0 }
        }}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function ParallaxHero({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-[#e9e1d6] p-8 md:min-h-[560px]"
    >
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="absolute -right-16 -top-16 h-64 w-64 rounded-full border border-orange/30 border-dashed" 
      />
      {children}
    </motion.div>
  )
}

export function HoverCTA({ children, href, className, variant = 'primary' }: { children: React.ReactNode; href: string; className?: string; variant?: 'primary' | 'secondary' }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
      <a href={href} className={className}>
        {children}
      </a>
    </motion.div>
  )
}
