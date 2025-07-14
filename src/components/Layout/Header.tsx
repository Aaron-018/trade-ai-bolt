import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'
import NetworkSelector from '@/components/NetworkSelector'
import Account from '@/components/Account'
import { AuthButton } from '@/components/Button'
import clsxm from '@/utils/clsxm'
import useAuth from '@/hooks/useAuth'

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const hasAuth = useAuth()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={clsxm(
        'fixed left-0 right-0 top-0 z-50 h-16 border-b border-primary-500/20 bg-neutral-900/95 backdrop-blur-md',
        'flex items-center justify-between px-6',
        className
      )}>
      <Link to="/">
        {/* Logo区域 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-3">
          <div className="relative">
            {/* 主Logo - 移动渐变背景 */}
            <motion.div
              animate={{
                background: [
                  'linear-gradient(45deg, #10b981, #14b8a6, #22c55e)',
                  'linear-gradient(135deg, #14b8a6, #22c55e, #16a34a)',
                  'linear-gradient(225deg, #22c55e, #16a34a, #10b981)',
                  'linear-gradient(315deg, #16a34a, #10b981, #14b8a6)',
                  'linear-gradient(45deg, #10b981, #14b8a6, #22c55e)'
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="relative z-10 flex h-8 w-8 items-center justify-center rounded-lg">
              <TrendingUp className="h-5 w-5 text-black" />
            </motion.div>

            {/* 旋转的小圆点 - 移动渐变背景 */}
            <motion.div
              animate={{
                rotate: 360,
                background: [
                  'linear-gradient(0deg, #22c55e, #16a34a)',
                  'linear-gradient(90deg, #16a34a, #10b981)',
                  'linear-gradient(180deg, #10b981, #14b8a6)',
                  'linear-gradient(270deg, #14b8a6, #22c55e)',
                  'linear-gradient(360deg, #22c55e, #16a34a)'
                ]
              }}
              transition={{
                rotate: { duration: 8, repeat: Infinity, ease: 'linear' },
                background: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }}
              className="absolute -right-1 -top-1 z-20 h-3 w-3 rounded-full opacity-80"
            />
          </div>

          <div>
            {/* 标题文字 - 移动渐变文字 */}
            <motion.h1
              style={{
                background:
                  'linear-gradient(90deg, #10b981, #14b8a6, #22c55e, #16a34a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              animate={{
                backgroundImage: [
                  'linear-gradient(90deg, #10b981, #14b8a6, #22c55e, #16a34a)',
                  'linear-gradient(180deg, #14b8a6, #22c55e, #16a34a, #10b981)',
                  'linear-gradient(270deg, #22c55e, #16a34a, #10b981, #14b8a6)',
                  'linear-gradient(360deg, #16a34a, #10b981, #14b8a6, #22c55e)',
                  'linear-gradient(90deg, #10b981, #14b8a6, #22c55e, #16a34a)'
                ]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="text-xl font-bold">
              Trade AI
            </motion.h1>
          </div>
        </motion.div>
      </Link>

      {/* 右侧钱包和网络区域 */}
      <div className="flex items-center space-x-3">
        {/* 未连接钱包时显示连接按钮 */}
        {!hasAuth && (
          <AuthButton hasAuth={hasAuth} variant="primary" className="px-6">
            Login
          </AuthButton>
        )}

        {/* 已连接钱包时显示网络选择器和地址 */}
        {hasAuth && (
          <>
            {/* 网络选择器 */}
            <NetworkSelector />

            <Account />

            {/* 钱包地址按钮 */}
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={disconnect}
              className="flex items-center space-x-3 rounded-lg border border-primary-500/30 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 px-4 py-2 transition-all duration-300 hover:border-primary-400/50">
              <Wallet className="h-5 w-5 text-primary-400" />
              <div className="font-mono text-sm text-defi-text">
                {superLong(address || '', 6)}
              </div>
            </motion.button> */}
          </>
        )}
      </div>
    </motion.header>
  )
}

export default Header
