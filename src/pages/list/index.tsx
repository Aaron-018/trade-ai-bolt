import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Trash2, Settings } from 'lucide-react'
import Switch from '@/components/Switch'
import AddMonitorModal from '@/components/AddMonitorModal'
import Button from '@/components/Button'
import toast from '@/utils/toast'

// 定义数据类型
interface WalletMonitor {
  id: string
  name: string
  isActive: boolean
}

interface ExchangeMonitor {
  id: string
  exchangeName: string
  isActive: boolean
}

interface TwitterMonitor {
  id: string
  name: string
  username: string
  isActive: boolean
}

type TabType = 'wallet' | 'exchange' | 'twitter'

const List = () => {
  const [activeTab, setActiveTab] = useState<TabType>('wallet')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  // 模拟数据
  const [walletMonitors, setWalletMonitors] = useState<WalletMonitor[]>([
    { id: '1', name: '大户钱包监控', isActive: true },
    { id: '2', name: 'DeFi巨鲸追踪', isActive: false },
    { id: '3', name: '机构钱包观察', isActive: true },
  ])

  const [exchangeMonitors, setExchangeMonitors] = useState<ExchangeMonitor[]>([
    { id: '1', exchangeName: 'Binance', isActive: true },
    { id: '2', exchangeName: 'Coinbase', isActive: true },
    { id: '3', exchangeName: 'OKX', isActive: false },
    { id: '4', exchangeName: 'Bybit', isActive: true },
    { id: '5', exchangeName: 'Kraken', isActive: false },
  ])

  const [twitterMonitors, setTwitterMonitors] = useState<TwitterMonitor[]>([
    { id: '1', name: 'CZ推特监控', username: '@cz_binance', isActive: true },
    { id: '2', name: 'Vitalik动态', username: '@VitalikButerin', isActive: true },
    { id: '3', name: 'Elon Musk', username: '@elonmusk', isActive: false },
    { id: '4', name: 'Coinbase官方', username: '@coinbase', isActive: true },
  ])

  const tabs = [
    { key: 'wallet' as TabType, label: '钱包监控', count: walletMonitors.length },
    { key: 'exchange' as TabType, label: '交易所公告监控', count: exchangeMonitors.length },
    { key: 'twitter' as TabType, label: '推特监控', count: twitterMonitors.length },
  ]

  // 切换监控状态
  const toggleWalletMonitor = (id: string) => {
    setWalletMonitors(prev => prev.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ))
    const monitor = walletMonitors.find(m => m.id === id)
    if (monitor) {
      toast.success(`${monitor.name} ${monitor.isActive ? '已关闭' : '已开启'}`)
    }
  }

  const toggleExchangeMonitor = (id: string) => {
    setExchangeMonitors(prev => prev.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ))
    const monitor = exchangeMonitors.find(m => m.id === id)
    if (monitor) {
      toast.success(`${monitor.exchangeName} 监控${monitor.isActive ? '已关闭' : '已开启'}`)
    }
  }

  const toggleTwitterMonitor = (id: string) => {
    setTwitterMonitors(prev => prev.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ))
    const monitor = twitterMonitors.find(m => m.id === id)
    if (monitor) {
      toast.success(`${monitor.name} 监控${monitor.isActive ? '已关闭' : '已开启'}`)
    }
  }

  // 删除监控
  const deleteWalletMonitor = (id: string) => {
    const monitor = walletMonitors.find(m => m.id === id)
    if (monitor) {
      setWalletMonitors(prev => prev.filter(item => item.id !== id))
      toast.success(`已删除 ${monitor.name}`)
    }
  }

  const deleteTwitterMonitor = (id: string) => {
    const monitor = twitterMonitors.find(m => m.id === id)
    if (monitor) {
      setTwitterMonitors(prev => prev.filter(item => item.id !== id))
      toast.success(`已删除 ${monitor.name}`)
    }
  }

  // 处理添加监控
  const handleAddMonitor = (type: 'wallet' | 'twitter', data: any) => {
    // 这里处理添加监控的逻辑
    console.log('添加监控:', type, data)
  }

  // 渲染钱包监控列表
  const renderWalletMonitors = () => (
    <div className="space-y-4">
      {walletMonitors.map((monitor, index) => (
        <motion.div
          key={monitor.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-medium text-defi-text">{monitor.name}</h3>
                <p className="text-sm text-defi-text-muted">钱包地址监控策略</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* 状态指示器 */}
              <div className="flex items-center space-x-2">
                {monitor.isActive ? (
                  <Eye className="w-4 h-4 text-primary-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-defi-text-muted" />
                )}
                <span className={`text-xs ${
                  monitor.isActive ? 'text-primary-400' : 'text-defi-text-muted'
                }`}>
                  {monitor.isActive ? '监控中' : '已暂停'}
                </span>
              </div>

              {/* 开关 */}
              <Switch
                checked={monitor.isActive}
                onChange={() => toggleWalletMonitor(monitor.id)}
              />

              {/* 删除按钮 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteWalletMonitor(monitor.id)}
                className="p-2 text-defi-text-muted hover:text-error-400 hover:bg-error-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  // 渲染交易所监控列表
  const renderExchangeMonitors = () => (
    <div className="space-y-4">
      {exchangeMonitors.map((monitor, index) => (
        <motion.div
          key={monitor.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="font-medium text-defi-text">{monitor.exchangeName}</h3>
                <p className="text-sm text-defi-text-muted">交易所公告监控</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* 状态指示器 */}
              <div className="flex items-center space-x-2">
                {monitor.isActive ? (
                  <Eye className="w-4 h-4 text-secondary-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-defi-text-muted" />
                )}
                <span className={`text-xs ${
                  monitor.isActive ? 'text-secondary-400' : 'text-defi-text-muted'
                }`}>
                  {monitor.isActive ? '监控中' : '已暂停'}
                </span>
              </div>

              {/* 开关 */}
              <Switch
                checked={monitor.isActive}
                onChange={() => toggleExchangeMonitor(monitor.id)}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  // 渲染推特监控列表
  const renderTwitterMonitors = () => (
    <div className="space-y-4">
      {twitterMonitors.map((monitor, index) => (
        <motion.div
          key={monitor.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6 hover:bg-neutral-800/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-500 to-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">T</span>
              </div>
              <div>
                <h3 className="font-medium text-defi-text">{monitor.name}</h3>
                <p className="text-sm text-defi-text-muted font-mono">{monitor.username}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* 状态指示器 */}
              <div className="flex items-center space-x-2">
                {monitor.isActive ? (
                  <Eye className="w-4 h-4 text-accent-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-defi-text-muted" />
                )}
                <span className={`text-xs ${
                  monitor.isActive ? 'text-accent-400' : 'text-defi-text-muted'
                }`}>
                  {monitor.isActive ? '监控中' : '已暂停'}
                </span>
              </div>

              {/* 开关 */}
              <Switch
                checked={monitor.isActive}
                onChange={() => toggleTwitterMonitor(monitor.id)}
              />

              {/* 删除按钮 */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteTwitterMonitor(monitor.id)}
                className="p-2 text-defi-text-muted hover:text-error-400 hover:bg-error-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-defi-text mb-2">监控配置</h1>
          <p className="text-defi-text-muted">管理您的钱包、交易所公告和推特监控</p>
        </div>
        
        <Button
          onClick={() => setIsAddModalOpen(true)}
          variant="primary"
        >
          添加监控
        </Button>
      </motion.div>

      {/* Tab导航 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-2"
      >
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 relative px-4 py-3 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-primary-500 text-black'
                  : 'text-defi-text-muted hover:text-defi-text hover:bg-neutral-800/50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key
                    ? 'bg-black/20 text-black'
                    : 'bg-neutral-700 text-defi-text-muted'
                }`}>
                  {tab.count}
                </span>
              </div>
              
              {/* 活跃指示器 */}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-primary-500 rounded-lg -z-10"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* 内容区域 */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="min-h-[400px]"
      >
        {activeTab === 'wallet' && renderWalletMonitors()}
        {activeTab === 'exchange' && renderExchangeMonitors()}
        {activeTab === 'twitter' && renderTwitterMonitors()}
      </motion.div>

      {/* 空状态提示 */}
      {((activeTab === 'wallet' && walletMonitors.length === 0) ||
        (activeTab === 'exchange' && exchangeMonitors.length === 0) ||
        (activeTab === 'twitter' && twitterMonitors.length === 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl"
        >
          <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'wallet' && <Eye className="w-8 h-8 text-defi-text-muted" />}
            {activeTab === 'exchange' && <Settings className="w-8 h-8 text-defi-text-muted" />}
            {activeTab === 'twitter' && <span className="text-2xl text-defi-text-muted">T</span>}
          </div>
          <h3 className="text-xl font-semibold text-defi-text mb-2">
            暂无{tabs.find(t => t.key === activeTab)?.label}
          </h3>
          <p className="text-defi-text-muted mb-6">
            添加您的第一个{tabs.find(t => t.key === activeTab)?.label.replace('监控', '')}监控
          </p>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
          >
            添加监控
          </Button>
        </motion.div>
      )}

      {/* 添加监控弹窗 */}
      <AddMonitorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMonitor={handleAddMonitor}
      />
    </div>
  )
}

export default List