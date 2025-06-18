import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import clsxm from '@/utils/clsxm'

interface InputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  success?: string
  disabled?: boolean
  type?: 'text' | 'number' | 'email' | 'password'
  className?: string
  suffix?: string
  validation?: {
    isValidating: boolean
    isValid: boolean | null
    message: string
  }
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  label,
  error,
  success,
  disabled = false,
  type = 'text',
  className,
  suffix,
  validation
}) => {
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const getStatusColor = () => {
    if (error) return 'border-error-500 focus:border-error-500'
    if (success) return 'border-success-500 focus:border-success-500'
    if (validation?.isValid === true) return 'border-success-500 focus:border-success-500'
    if (validation?.isValid === false) return 'border-error-500 focus:border-error-500'
    if (isFocused) return 'border-primary-500'
    return 'border-neutral-700 hover:border-neutral-600'
  }

  const getStatusIcon = () => {
    if (validation?.isValidating) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full"
        />
      )
    }
    
    if (error || validation?.isValid === false) {
      return <AlertTriangle className="w-4 h-4 text-error-400" />
    }
    
    if (success || validation?.isValid === true) {
      return <CheckCircle className="w-4 h-4 text-success-400" />
    }
    
    return null
  }

  const getStatusMessage = () => {
    if (error) return error
    if (success) return success
    if (validation?.message) return validation.message
    return null
  }

  const getStatusMessageColor = () => {
    if (error || validation?.isValid === false) return 'text-error-400'
    if (success || validation?.isValid === true) return 'text-success-400'
    return 'text-defi-text-muted'
  }

  const hasStatusIcon = getStatusIcon() !== null

  return (
    <div className={clsxm('space-y-1', className)}>
      {/* 标签 */}
      {label && (
        <label className="block text-sm font-medium text-defi-text">
          {label}
        </label>
      )}

      {/* 输入框容器 */}
      <div className="relative">
        {/* 主输入框 */}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={clsxm(
            'w-full px-3 py-2 bg-neutral-800/80 backdrop-blur-sm border rounded-lg',
            'text-defi-text text-sm placeholder:text-xs placeholder:text-defi-text-muted/70',
            'transition-colors duration-200 ease-out',
            'focus:outline-none focus:ring-0',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            // 根据是否有后缀和状态图标调整右边距
            suffix && hasStatusIcon && 'pr-16',
            suffix && !hasStatusIcon && 'pr-10',
            !suffix && hasStatusIcon && 'pr-10',
            getStatusColor()
          )}
        />

        {/* 后缀和状态图标容器 */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          {/* 后缀 */}
          {suffix && (
            <span className="text-sm text-defi-text-muted">
              {suffix}
            </span>
          )}
          
          {/* 状态图标 */}
          {getStatusIcon()}
        </div>
      </div>

      {/* 状态消息 */}
      <AnimatePresence>
        {getStatusMessage() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={clsxm('text-xs', getStatusMessageColor())}
          >
            {getStatusMessage()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Input