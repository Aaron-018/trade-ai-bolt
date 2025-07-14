import React from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { Eye, Settings, Bell, TrendingUp, MessageSquare } from 'lucide-react'
import clsxm from '@/utils/clsxm'

interface SidebarProps {
  className?: string
}

interface NavItem {
  path: string
  subPath?: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: '观察钱包',
    icon: Eye
  },
  {
    path: '/strategy',
    label: '监控配置',
    icon: Settings
  },
  {
    path: '/channel',
    label: '通知渠道',
    icon: Bell
  },
  {
    path: '/cex',
    subPath: '/cex-token',
    label: 'CEX监控',
    icon: TrendingUp
  },
  {
    path: '/notifications',
    label: 'AI监控',
    icon: MessageSquare
  }
]

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation()
  const navigate = useNavigate()

  const handleNavClick = (path: string) => {
    navigate(path)
  }

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={clsxm(
        'fixed bottom-0 left-0 top-16 z-40 w-[200px] border-r border-primary-500/20 bg-neutral-900/95 backdrop-blur-md',
        'flex flex-col',
        className
      )}>
      {/* 导航菜单 */}
      <nav className="flex-1 px-3 pt-6">
        <div className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive =
              location.pathname === item.path ||
              (item.subPath && location.pathname.includes(item.subPath))

            return (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{
                  delay: index * 0.08,
                  duration: 0.4,
                  ease: 'easeOut'
                }}>
                <motion.button
                  whileHover={{
                    x: 4,
                    transition: { duration: 0.2, ease: 'easeOut' }
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                  onClick={() => handleNavClick(item.path)}
                  className={clsxm(
                    'flex w-full items-center space-x-2 rounded-lg px-3 py-2.5',
                    'group relative overflow-hidden',
                    'transition-all duration-300 ease-out',
                    isActive
                      ? 'border border-primary-500/30 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400'
                      : 'border border-transparent text-defi-text-muted hover:border-primary-500/20 hover:bg-gradient-to-r hover:from-primary-500/5 hover:to-secondary-500/5 hover:text-defi-text'
                  )}>
                  {/* 活跃状态指示器 */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute bottom-0 left-0 top-0 w-1 rounded-r bg-gradient-to-b from-primary-400 to-secondary-500"
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  )}

                  {/* Hover背景效果 */}
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-500/5 to-secondary-500/5 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />

                  <Icon
                    className={clsxm(
                      'relative z-10 h-4 w-4 flex-shrink-0',
                      'transition-all duration-300 ease-out',
                      isActive
                        ? 'text-primary-400'
                        : 'group-hover:scale-110 group-hover:text-primary-300'
                    )}
                  />

                  <div className="relative z-10 flex-1 text-left">
                    <div
                      className={clsxm(
                        'text-sm font-medium transition-all duration-300 ease-out',
                        'group-hover:translate-x-1'
                      )}>
                      {item.label}
                    </div>
                  </div>
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </nav>
    </motion.aside>
  )
}

export default Sidebar
