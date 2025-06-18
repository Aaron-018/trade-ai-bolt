import React from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { 
  Eye, 
  Settings,
  Bell
} from 'lucide-react'
import clsxm from '@/utils/clsxm'

interface SidebarProps {
  className?: string
}

interface NavItem {
  path: string
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
    path: '/list',
    label: '监控配置',
    icon: Settings
  },
  {
    path: '/channel',
    label: '通知渠道',
    icon: Bell
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
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={clsxm(
        'fixed left-0 top-16 bottom-0 z-40 w-[200px] bg-neutral-900/95 backdrop-blur-md border-r border-primary-500/20',
        'flex flex-col',
        className
      )}
    >
      {/* 导航菜单 */}
      <nav className="flex-1 pt-6 px-3">
        <div className="space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <motion.div
                key={item.path}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  delay: index * 0.08,
                  duration: 0.4,
                  ease: "easeOut"
                }}
              >
                <motion.button
                  whileHover={{ 
                    x: 4,
                    transition: { duration: 0.2, ease: "easeOut" }
                  }}
                  whileTap={{ 
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                  onClick={() => handleNavClick(item.path)}
                  className={clsxm(
                    'w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg',
                    'group relative overflow-hidden',
                    'transition-all duration-300 ease-out',
                    isActive
                      ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 border border-primary-500/30 text-primary-400'
                      : 'text-defi-text-muted hover:text-defi-text hover:bg-gradient-to-r hover:from-primary-500/5 hover:to-secondary-500/5 hover:border-primary-500/20 border border-transparent'
                  )}
                >
                  {/* 活跃状态指示器 */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-secondary-500 rounded-r"
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  )}
                  
                  {/* Hover背景效果 */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5 rounded-lg opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  />
                  
                  <Icon className={clsxm(
                    'w-4 h-4 flex-shrink-0 relative z-10',
                    'transition-all duration-300 ease-out',
                    isActive 
                      ? 'text-primary-400' 
                      : 'group-hover:text-primary-300 group-hover:scale-110'
                  )} />
                  
                  <div className="flex-1 text-left relative z-10">
                    <div className={clsxm(
                      'font-medium text-sm transition-all duration-300 ease-out',
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