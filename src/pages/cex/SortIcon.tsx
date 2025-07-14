import React from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown } from 'lucide-react'
import clsxm from '@/utils/clsxm'

// 排序状态类型
export type SortDirection = 'asc' | 'desc' | null
type SortField = string | null

// 排序组件
interface SortIconsProps {
  field: string
  currentSortField: SortField
  currentSortDirection: SortDirection
  onSort: (field: string, direction: SortDirection) => void
}

const SortIcons: React.FC<SortIconsProps> = ({
  field,
  currentSortField,
  currentSortDirection,
  onSort
}) => {
  const isActive = currentSortField === field

  const isASCActive = isActive && currentSortDirection === 'asc'
  const isDESCActive = isActive && currentSortDirection === 'desc'

  const handleUpClick = () => {
    if (isASCActive) {
      onSort(field, null) // 取消排序
    } else {
      onSort(field, 'asc') // 升序
    }
  }

  const handleDownClick = () => {
    if (isDESCActive) {
      onSort(field, null) // 取消排序
    } else {
      onSort(field, 'desc') // 降序
    }
  }

  return (
    <div className="ml-1 flex flex-col -space-y-1">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleUpClick}
        className={clsxm(
          'p-0 transition-colors',
          isASCActive
            ? 'text-primary-400'
            : 'text-defi-text-muted hover:text-defi-text'
        )}>
        <ChevronUp
          className={clsxm('h-3 w-3', isASCActive && 'stroke-[4px]')}
        />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleDownClick}
        className={clsxm(
          'p-0 transition-colors',
          isDESCActive
            ? 'text-primary-400'
            : 'text-defi-text-muted hover:text-defi-text'
        )}>
        <ChevronDown
          className={clsxm('h-3 w-3', isDESCActive && 'stroke-[4px]')}
        />
      </motion.button>
    </div>
  )
}

export default SortIcons
