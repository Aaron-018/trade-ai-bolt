import React from 'react'
import { motion } from 'framer-motion'
import clsxm from '@/utils/clsxm'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Switch: React.FC<SwitchProps> = ({ 
  checked, 
  onChange, 
  disabled = false, 
  size = 'md',
  className 
}) => {
  const sizeConfig = {
    sm: {
      container: 'h-4 w-7',
      thumb: 'h-3 w-3',
      translateX: checked ? 12 : 2 // 3 * 4px = 12px, 0.5 * 4px = 2px
    },
    md: {
      container: 'h-6 w-11',
      thumb: 'h-4 w-4',
      translateX: checked ? 24 : 4 // 6 * 4px = 24px, 1 * 4px = 4px
    },
    lg: {
      container: 'h-8 w-14',
      thumb: 'h-6 w-6',
      translateX: checked ? 28 : 4 // 7 * 4px = 28px, 1 * 4px = 4px
    }
  }

  const config = sizeConfig[size]

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={clsxm(
        'relative inline-flex items-center rounded-full transition-colors duration-300 ease-in-out focus:outline-none',
        config.container,
        checked 
          ? 'bg-primary-500 shadow-glow-sm' 
          : 'bg-neutral-600',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <motion.span
        animate={{
          x: config.translateX
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        className={clsxm(
          'inline-block rounded-full bg-white shadow-lg',
          config.thumb
        )}
      />
      
      {/* 发光效果 */}
      {checked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-full bg-primary-400/20 blur-sm"
        />
      )}
    </motion.button>
  )
}

export default Switch