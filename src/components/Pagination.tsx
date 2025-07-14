import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsxm from '@/utils/clsxm'

interface PaginationProps {
  currentPage: number
  pageSize?: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageSize = 5,
  total,
  onPageChange,
  className
}) => {
  const totalPages = Math.ceil(total / pageSize)
  const [inputValue, setInputValue] = useState(currentPage.toString())

  // 同步当前页码到输入框
  useEffect(() => {
    setInputValue(currentPage.toString())
  }, [currentPage])

  // 处理输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 只允许输入数字
    if (/^\d*$/.test(value)) {
      setInputValue(value)
    }
  }

  // 处理输入框失去焦点
  const handleInputBlur = () => {
    if (!inputValue || inputValue === '0') {
      setInputValue('1')
      onPageChange(1)
      return
    }

    const pageNumber = parseInt(inputValue)
    if (pageNumber > totalPages) {
      setInputValue(totalPages.toString())
      onPageChange(totalPages)
    } else if (pageNumber < 1) {
      setInputValue('1')
      onPageChange(1)
    } else {
      onPageChange(pageNumber)
    }
  }

  // 处理回车键
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur()
    }
  }

  // 上一页
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  // 下一页
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  if (currentPage >= totalPages) return null

  return (
    <div className="flex items-center justify-between border-t border-neutral-800 px-6 py-4">
      <span className="text-sm text-defi-text-muted">Total {total}</span>
      {total > pageSize && (
        <div
          className={clsxm(
            'flex items-center justify-center space-x-2',
            className
          )}>
          {/* 上一页按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentPage <= 1}
            className={clsxm(
              'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
              currentPage <= 1
                ? 'cursor-not-allowed border-neutral-700 text-defi-text-muted'
                : 'border-neutral-600 text-defi-text hover:border-primary-500 hover:text-primary-400'
            )}>
            <ChevronLeft className="h-4 w-4" />
          </motion.button>

          {/* 页码输入框 */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyPress={handleKeyPress}
              className={clsxm(
                'h-8 w-12 px-2 text-center font-mono text-sm',
                'rounded-lg border border-neutral-600 bg-neutral-800',
                'text-defi-text placeholder:text-defi-text-muted',
                'focus:border-primary-500 focus:outline-none focus:ring-0',
                'transition-colors'
              )}
            />
            <span className="text-sm text-defi-text-muted">/</span>
            <span className="min-w-[2rem] text-center font-mono text-sm text-defi-text">
              {totalPages}
            </span>
          </div>

          {/* 下一页按钮 */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={currentPage >= totalPages}
            className={clsxm(
              'flex h-8 w-8 items-center justify-center rounded-lg border transition-colors',
              currentPage >= totalPages
                ? 'cursor-not-allowed border-neutral-700 text-defi-text-muted'
                : 'border-neutral-600 text-defi-text hover:border-primary-500 hover:text-primary-400'
            )}>
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      )}
    </div>
  )
}

export default Pagination
