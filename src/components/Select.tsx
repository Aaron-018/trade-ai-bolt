import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import clsxm from '@/utils/clsxm'

interface Option {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
  clearable?: boolean
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '请选择',
  disabled = false,
  className,
  label,
  clearable = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0
  })
  const selectRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const [showClose, setShowClose] = useState(false)

  // 计算下拉框位置
  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const dropdownHeight = Math.min(options.length * 42 + 16, 200) // 估算下拉框高度

      // 检查是否有足够空间在下方显示
      const spaceBelow = viewportHeight - rect.bottom - 8
      const spaceAbove = rect.top - 8

      let top = rect.bottom + 4 // 默认在下方

      // 如果下方空间不足且上方空间更多，则在上方显示
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        top = rect.top - dropdownHeight - 4
      }

      setDropdownPosition({
        top,
        left: rect.left,
        width: rect.width
      })
    }
  }

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // 检查点击是否在选择框按钮或下拉框内
      const isClickInButton =
        buttonRef.current && buttonRef.current.contains(target)
      const isClickInDropdown =
        dropdownRef.current && dropdownRef.current.contains(target)

      if (!isClickInButton && !isClickInDropdown) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      calculateDropdownPosition()

      // 监听窗口大小变化和滚动
      const handleResize = () => {
        calculateDropdownPosition()
      }

      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleResize, true)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleResize, true)
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectedOption = options.find(option => option.value === value)

  const handleMouseOver = () => {
    if (clearable && selectedOption) {
      setShowClose(true)
    } else {
      setShowClose(false)
    }
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange('')
  }

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) {
        calculateDropdownPosition()
      }
      setIsOpen(!isOpen)
    }
  }

  return (
    <div
      className={clsxm('relative', className)}
      ref={selectRef}
      onMouseOver={handleMouseOver}
      onMouseLeave={() => setShowClose(false)}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-defi-text">
          {label}
        </label>
      )}

      <div className="relative">
        {/* 选择框 */}
        <button
          ref={buttonRef}
          onClick={handleToggle}
          disabled={disabled}
          className={clsxm(
            'w-full rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2.5 backdrop-blur-sm',
            'text-left text-sm text-defi-text',
            'transition-colors duration-200 ease-out',
            'focus:border-primary-500 focus:outline-none focus:ring-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'hover:border-neutral-600',
            isOpen && 'border-primary-500'
          )}>
          <div className="flex items-center justify-between">
            <span
              className={clsxm(
                selectedOption ? 'text-defi-text' : 'text-defi-text-muted'
              )}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>

            <div className="flex items-center space-x-1">
              {/* 清除按钮 */}
              {showClose ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClear}
                  className="rounded p-1 text-defi-text-muted">
                  <X className="h-3 w-3" />
                </motion.button>
              ) : (
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}>
                  <ChevronDown className="h-4 w-4 text-defi-text-muted" />
                </motion.div>
              )}
            </div>
          </div>
        </button>

        {/* 使用 Portal 渲染下拉选项到 body */}
        {isOpen &&
          createPortal(
            <AnimatePresence>
              <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                style={{
                  position: 'fixed',
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                  zIndex: 9999
                }}
                className="overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800 shadow-2xl">
                <div className="max-h-48 overflow-y-auto">
                  {options.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={clsxm(
                        'w-full px-3 py-2.5 text-left text-sm transition-colors',
                        'hover:bg-neutral-700/50 focus:bg-neutral-700/50',
                        'focus:outline-none',
                        'flex items-center justify-between',
                        value === option.value
                          ? 'bg-primary-500/10 text-primary-400'
                          : 'text-defi-text'
                      )}>
                      <span>{option.label}</span>
                      {value === option.value && (
                        <Check className="h-4 w-4 text-primary-400" />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>,
            document.body
          )}
      </div>
    </div>
  )
}

export default Select
