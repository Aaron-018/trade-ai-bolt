import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import clsxm from '@/utils/clsxm'

interface LoadingProps {
  loading: boolean
  children?: React.ReactNode
  fullscreen?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const Loading: React.FC<LoadingProps> = ({
  loading,
  children,
  fullscreen = false,
  className,
  size = 'md',
  text
}) => {
  const sizeConfig = {
    sm: {
      spinner: 'w-6 h-6',
      text: 'text-sm'
    },
    md: {
      spinner: 'w-8 h-8',
      text: 'text-base'
    },
    lg: {
      spinner: 'w-12 h-12',
      text: 'text-lg'
    }
  }

  const config = sizeConfig[size]

  // 加载动画组件
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center space-y-3">
      {/* 主要加载器 - DeFi风格的旋转环 */}
      <div className="relative">
        {/* 外环 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className={clsxm(
            'rounded-full border-4 border-neutral-700',
            config.spinner
          )}
        />

        {/* 内环 - 渐变色 */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className={clsxm(
            'absolute inset-0 rounded-full border-4 border-transparent border-r-secondary-400 border-t-primary-400',
            config.spinner
          )}
        />

        {/* 中心点 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
            className="h-2 w-2 rounded-full bg-primary-400"
          />
        </div>
      </div>

      {/* 加载文本 */}
      {text && (
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className={clsxm('font-medium text-defi-text-muted', config.text)}>
          {text}
        </motion.p>
      )}

      {/* 装饰性的点 */}
      <div className="flex space-x-1">
        {[0, 1, 2].map(index => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut'
            }}
            className="h-1 w-1 rounded-full bg-primary-400"
          />
        ))}
      </div>
    </div>
  )

  // 全屏加载
  if (fullscreen) {
    return createPortal(
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/90 p-8 shadow-2xl">
              <LoadingSpinner />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
    )
  }

  // 包裹子组件的加载
  if (children) {
    return (
      <div className={clsxm('relative', className)}>
        {children}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-neutral-900/80 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}>
                <LoadingSpinner />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // 独立的加载组件
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={clsxm('flex items-center justify-center', className)}>
          <LoadingSpinner />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Loading
