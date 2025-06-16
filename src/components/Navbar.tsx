import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bot, Wallet, Menu, X, Home, List, Zap } from 'lucide-react'
import WalletConnectButton from './WalletConnectButton'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/list', label: '交易列表', icon: List }
  ]

  const isActiveRoute = (path: string) => location.pathname === path

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.3 }}
              className="relative">
              <Bot className="text-primary-400 h-8 w-8" />
              <motion.div
                className="bg-primary-400/20 absolute inset-0 rounded-full blur-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <span className="from-primary-400 to-accent-400 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent">
              Trade AI
            </span>
          </Link>

          {/* 桌面端导航菜单 */}
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <Link key={item.path} to={item.path} className="group relative">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center space-x-2 rounded-lg px-3 py-2 transition-all duration-200 ${
                      isActiveRoute(item.path)
                        ? 'bg-primary-500/20 text-primary-300'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}>
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                  {isActiveRoute(item.path) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="from-primary-400 to-accent-400 absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* 钱包连接按钮 */}
          <div className="hidden items-center space-x-4 md:flex">
            <WalletConnectButton />
          </div>

          {/* 移动端菜单按钮 */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-lg bg-white/10 p-2 text-white transition-colors hover:bg-white/20">
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* 移动端菜单 */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? 'auto' : 0,
            opacity: isMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden md:hidden">
          <div className="space-y-2 py-4">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                    isActiveRoute(item.path)
                      ? 'bg-primary-500/20 text-primary-300'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}>
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
            <div className="border-t border-white/10 pt-4">
              <WalletConnectButton />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

export default Navbar
