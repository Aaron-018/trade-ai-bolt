import React from 'react'
import { motion } from 'framer-motion'
import clsxm from '@/utils/clsxm'
import useLogin from '@/hooks/useLogin'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'neutral' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  auth?: boolean
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
        'relative flex items-center justify-center rounded-lg font-medium transition-colors',
        'focus:outline-none focus:ring-0',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        // 禁用状态下不显示hover光效
        !isDisabled && variant === 'primary' && 'btn-hover',
        className
      )}>
      {/* 加载状态 */}
      {children}
      {loading && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="ml-2">
          <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent" />
        </motion.div>
      )}
    </motion.button>
  )
}

interface AuthButtonProps extends ButtonProps {
  hasAuth?: boolean
}
export const AuthButton: React.FC<AuthButtonProps> = ({
  hasAuth = false,
  onClick,
  children,
  ...others
}) => {
  const { login } = useLogin()
  const handleClick = () => {
    if (hasAuth) {
      onClick && onClick()
    } else {
      login()
    }
  }
  if (!hasAuth)
    return (
      <Button {...others} onClick={handleClick}>
        Login
      </Button>
    )
  return (
    <Button onClick={handleClick} {...others}>
      {children}
    </Button>
  )
}

export default Button
