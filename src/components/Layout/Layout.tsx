import React from 'react'
import { motion } from 'framer-motion'
import Header from './Header'
import Sidebar from './Sidebar'
import clsxm from '@/utils/clsxm'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

const Layout: React.FC<LayoutProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-defi-bg text-defi-text overflow-hidden">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* DeFi主题网格背景 */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        
        {/* 动态渐变光效 - DeFi绿色主题 */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(600px circle at 0% 0%, rgba(16, 185, 129, 0.15), transparent 50%)',
              'radial-gradient(600px circle at 100% 100%, rgba(20, 184, 166, 0.15), transparent 50%)',
              'radial-gradient(600px circle at 0% 100%, rgba(34, 197, 94, 0.15), transparent 50%)',
              'radial-gradient(600px circle at 100% 0%, rgba(16, 185, 129, 0.15), transparent 50%)'
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />

        {/* 浮动的加密货币符号 */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-20, -40, -20],
                x: [0, 10, 0],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.5
              }}
              className="absolute text-primary-500/10 text-6xl font-bold"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`
              }}
            >
              {['₿', 'Ξ', '◊', '₳', '◎', '⟠'][i]}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className={clsxm(
          'ml-[200px] mt-16 min-h-[calc(100vh-4rem)] relative z-10',
          className
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </motion.main>
    </div>
  )
}

export default Layout