import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import { createPortal } from 'react-dom'
import clsxm from '@/utils/clsxm'

interface Option {
  value: string
  label: string
}

interface MultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
  className?: string
  label?: string
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = '请选择',
  disabled = false,
  className,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const selectRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 计算下拉框位置
  const calculateDropdownPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      // 增加下拉框高度，确保所有选项都能显示
      const dropdownHeight = Math.min(options.length * 48 + 24, 300) // 增加高度
      
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
      const isClickInButton = buttonRef.current && buttonRef.current.contains(target)
      const isClickInDropdown = dropdownRef.current && dropdownRef.current.contains(target)
      
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

  const handleToggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  const getDisplayText = () => {
    if (value.length === 0) return placeholder
    
    // 获取选中项的标签
    const selectedLabels = value
      .map(val => options.find(opt => opt.value === val)?.label || val)
      .join('、')
    
    return selectedLabels
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
    <div className={clsxm('relative', className)} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-defi-text mb-1">
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
            'w-full px-3 py-2.5 bg-neutral-800/80 backdrop-blur-sm border border-neutral-700 rounded-lg',
            'text-left text-sm text-defi-text',
            'transition-colors duration-200 ease-out',
            'focus:outline-none focus:ring-0 focus:border-primary-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'hover:border-neutral-600',
            isOpen && 'border-primary-500'
          )}
        >
          <div className="flex items-center justify-between">
            <span className={clsxm(
              'truncate pr-2',
              value.length > 0 ? 'text-defi-text' : 'text-defi-text-muted'
            )}>
              {getDisplayText()}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-4 h-4 text-defi-text-muted" />
            </motion.div>
          </div>
        </button>

        {/* 使用 Portal 渲染下拉选项到 body */}
        {isOpen && createPortal(
          <AnimatePresence>
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                position: 'fixed',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                zIndex: 9999
              }}
              className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-2xl overflow-hidden"
            >
              {/* 增加下拉框的最大高度和内边距 */}
              <div className="max-h-72 overflow-y-auto p-2">
                {options.map((option) => {
                  const isSelected = value.includes(option.value)
                  
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleToggleOption(option.value)}
                      className={clsxm(
                        'flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer transition-colors',
                        'hover:bg-neutral-700/50 focus:bg-neutral-700/50',
                        isSelected && 'bg-primary-500/10'
                      )}
                    >
                      {/* 复选框 */}
                      <div className={clsxm(
                        'w-4 h-4 border-2 rounded flex items-center justify-center transition-colors',
                        isSelected 
                          ? 'bg-primary-500 border-primary-500' 
                          : 'border-neutral-600 hover:border-neutral-500'
                      )}>
                        {isSelected && (
                          <Check className="w-3 h-3 text-black" />
                        )}
                      </div>
                      
                      {/* 选项文本 */}
                      <span className={clsxm(
                        'text-sm flex-1',
                        isSelected ? 'text-primary-400' : 'text-defi-text'
                      )}>
                        {option.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
      </div>
    </div>
  )
}

export default MultiSelect