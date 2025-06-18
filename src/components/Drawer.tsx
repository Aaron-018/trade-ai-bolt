import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import clsxm from '@/utils/clsxm'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  target?: HTMLElement | string // 支持传入DOM元素或选择器字符串
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md',
  target
}) => {
  const [mountElement, setMountElement] = useState<HTMLElement | null>(null)

  const sizeConfig = {
    sm: 'w-80',
    md: 'w-96',
    lg: 'w-[32rem]',
    xl: 'w-[40rem]'
  }

  // 处理挂载目标元素
  useEffect(() => {
    let element: HTMLElement | null = null

    if (target) {
      if (typeof target === 'string') {
        // 如果是字符串，作为选择器查找元素
        element = document.querySelector(target) as HTMLElement
      } else {
        // 如果是DOM元素，直接使用
        element = target
      }
    }

    // 如果没有指定target或找不到目标元素，默认挂载到body
    if (!element) {
      element = document.body
    }

    setMountElement(element)
  }, [target])

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      // 保存当前滚动位置
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      // 恢复滚动位置
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }

    // 清理函数
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  // 处理ESC键关闭
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // 如果还没有确定挂载元素，不渲染任何内容
  if (!mountElement) {
    return null
  }

  // 抽屉内容组件 - 直接返回 Portal
  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="drawer-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.25,
            ease: "easeInOut"
          }}
          className="fixed inset-0 z-[60] flex"
        >
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.25,
              ease: "easeInOut"
            }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* 抽屉内容 */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 40,
              mass: 1
            }}
            className={clsxm(
              'relative ml-auto bg-neutral-900 border-l border-neutral-800 shadow-2xl',
              'flex flex-col h-full overflow-hidden',
              sizeConfig[size],
              className
            )}
          >
            {/* 头部 - 固定高度确保标题完整显示 */}
            {title && (
              <div className="flex-shrink-0 flex items-center justify-between px-6 py-6 border-b border-neutral-800 bg-neutral-900">
                <h2 className="text-xl font-semibold text-defi-text">{title}</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-defi-text-muted hover:text-defi-text hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            )}

            {/* 内容区域 */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    mountElement
  )
}

export default Drawer