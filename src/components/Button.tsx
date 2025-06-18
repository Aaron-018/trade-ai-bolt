import React from 'react'
import { motion } from 'framer-motion'
import clsxm from '@/utils/clsxm'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'neutral' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  loading = false
}) => {
  const variants = {
    primary: 'bg-primary-400 hover:bg-primary-500 text-black',
    secondary: 'bg-secondary-400 hover:bg-secondary-500 text-black',
    neutral: 'bg-neutral-600 hover:bg-neutral-500 text-defi-text',
    danger: 'bg-error-400 hover:bg-error-500 text-white'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={isDisabled}
      type={type}
      className={clsxm(
        'font-medium rounded-lg transition-colors relative overflow-hidden',
        'focus:outline-none focus:ring-0',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        // 禁用状态下不显示hover光效
        !isDisabled && variant === 'primary' && 'btn-hover',
        className
      )}
    >
      {/* 加载状态 */}
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      
      {/* 按钮内容 */}
      <span className={clsxm(loading && 'opacity-0')}>
        {children}
      </span>
    </motion.button>
  )
}

export default Button