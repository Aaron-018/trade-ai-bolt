import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import clsxm from '@/utils/clsxm'

interface TextareaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  error?: string
  success?: string
  disabled?: boolean
  rows?: number
  maxLength?: number
  showCounter?: boolean
  className?: string
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  validation?: {
    isValidating: boolean
    isValid: boolean | null
    message: string
  }
}

const Textarea: React.FC<TextareaProps> = ({
  value,
  onChange,
  placeholder,
  label,
  error,
  success,
  disabled = false,
  rows = 4,
  maxLength,
  showCounter = false,
  className,
  resize = 'none',
  validation
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 自动调整高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    if (maxLength && newValue.length > maxLength) return
    onChange(newValue)
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

  return (
    <div className={clsxm('space-y-2', className)}>
      {/* 标签 */}
      {label && (
        <label className="block text-sm font-medium text-defi-text">
          {label}
        </label>
      )}

      {/* 输入框容器 */}
      <div className="relative">
        {/* 主输入框 */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={clsxm(
            'w-full px-4 py-3 bg-neutral-800/80 backdrop-blur-sm border rounded-lg',
            'text-defi-text text-sm placeholder:text-xs placeholder:text-defi-text-muted/70',
            'transition-colors duration-200 ease-out',
            'focus:outline-none focus:ring-0',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            resize === 'none' && 'resize-none',
            resize === 'vertical' && 'resize-y',
            resize === 'horizontal' && 'resize-x',
            resize === 'both' && 'resize',
            getStatusColor()
          )}
          style={{
            minHeight: `${rows * 1.5}rem`
          }}
        />

        {/* 状态图标 */}
        <div className="absolute right-3 top-3 flex items-center space-x-2">
          {getStatusIcon()}
        </div>

        {/* 字符计数器 */}
        {(showCounter || maxLength) && (
          <div className="absolute bottom-3 right-3 text-xs text-defi-text-muted">
            {value.length}{maxLength && `/${maxLength}`}
          </div>
        )}
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

export default Textarea