import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Settings } from 'lucide-react'
import Button from '@/components/Button'
import Wallet from './Wallet'
import Cex from './Cex'
import Twitter, { TwitterItem } from './Twitter'
import AddMonitorModal from './AddMonitorModal'
import clsxm from '@/utils/clsxm'
import toast from '@/utils/toast'
import { useStrategyStore, useSysStore } from '@/store'
import useAuth from '@/hooks/useAuth'

type TabType = 'wallet' | 'cex' | 'twitter'

const StrategyPage = () => {
  const walletStrategies = useStrategyStore(state => state.walletStrategies)
  const resetState = useStrategyStore(state => state.resetState)
  const sysConfig = useSysStore(state => state.config)

  const getWalletStrategies = useStrategyStore(
    state => state.getWalletStrategies
  )
  const getCexStrategies = useStrategyStore(state => state.getCexStrategies)
  const hasAuth = useAuth()
  useEffect(() => {
    if (hasAuth) {
      getWalletStrategies()
      getCexStrategies()
    } else {
      resetState()
    }
  }, [hasAuth, getWalletStrategies, getCexStrategies, resetState])

  const [activeTab, setActiveTab] = useState<TabType>('wallet')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const [twitters, setTwitters] = useState<TwitterItem[]>([])

  const tabs = [
    {
      key: 'wallet' as TabType,
      label: '钱包监控',
      count: walletStrategies.length
    },
    {
      key: 'cex' as TabType,
      label: '交易所公告监控',
      count: sysConfig.articleSources.length
    },
    {
      key: 'twitter' as TabType,
      label: '推特监控',
      count: 0
    }
  ]

  const changeTab = (tab: TabType) => {
    if (tab === 'twitter') return
    setActiveTab(tab)
  }

  const toggleTwitter = (id: string) => {
    setTwitters(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isActive: !item.isActive } : item
      )
    )
    const monitor = twitters.find(m => m.id === id)
    if (monitor) {
      toast.success(
        `${monitor.name} 监控${monitor.isActive ? '已关闭' : '已开启'}`
      )
    }
  }

  const deleteTwitter = (id: string) => {
    const monitor = twitters.find(m => m.id === id)
    if (monitor) {
      setTwitters(prev => prev.filter(item => item.id !== id))
      toast.success(`已删除 ${monitor.name}`)
    }
  }

  // 处理添加监控
  const handleAddMonitor = (type: 'wallet' | 'twitter', data: any) => {
    // 这里处理添加监控的逻辑
    // console.log('添加监控:', type, data)
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-defi-text">监控配置</h1>
          <p className="text-defi-text-muted">
            管理您的钱包、交易所公告和推特监控
          </p>
        </div>

        {hasAuth && (
          <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
            添加监控
          </Button>
        )}
      </motion.div>

      {/* Tab导航 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-2 backdrop-blur-sm">
        <div className="flex space-x-2">
          {tabs.map(tab => (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => changeTab(tab.key)}
              className={clsxm(
                'relative flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                activeTab === tab.key
                  ? 'bg-primary-500 text-black'
                  : 'text-defi-text-muted hover:bg-neutral-800/50 hover:text-defi-text',
                tab.key === 'twitter' && 'cursor-not-allowed opacity-30'
              )}>
              <div className="flex items-center justify-center space-x-2">
                <span>{tab.label}</span>
                {!!tab.count && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      activeTab === tab.key
                        ? 'bg-black/20 text-black'
                        : 'bg-neutral-700 text-defi-text-muted'
                    }`}>
                    {tab.count}
                  </span>
                )}
              </div>

              {/* 活跃指示器 */}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 -z-10 rounded-lg bg-primary-500"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
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
        transition={{ delay: 0.2 }}>
        {activeTab === 'wallet' && <Wallet />}
        {activeTab === 'cex' && <Cex />}
        {activeTab === 'twitter' && (
          <Twitter
            list={twitters}
            handleChange={toggleTwitter}
            handleDelete={deleteTwitter}
          />
        )}
      </motion.div>

      {/* 空状态提示 */}
      {((activeTab === 'wallet' && walletStrategies.length === 0) ||
        (activeTab === 'cex' && sysConfig?.articleSources?.length === 0) ||
        (activeTab === 'twitter' && twitters.length === 0)) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-neutral-800 bg-neutral-900/50 py-12 text-center backdrop-blur-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800">
            {activeTab === 'wallet' && (
              <Eye className="h-8 w-8 text-defi-text-muted" />
            )}
            {activeTab === 'cex' && (
              <Settings className="h-8 w-8 text-defi-text-muted" />
            )}
            {activeTab === 'twitter' && (
              <span className="text-2xl text-defi-text-muted">T</span>
            )}
          </div>
          <h3 className="mb-2 text-xl font-semibold text-defi-text">
            暂无{tabs.find(t => t.key === activeTab)?.label}
          </h3>
          {/* <p className="mb-6 text-defi-text-muted">
            添加您的第一个
            {tabs.find(t => t.key === activeTab)?.label.replace('监控', '')}监控
          </p>
          <Button onClick={() => setIsAddModalOpen(true)} variant="primary">
            添加监控
          </Button> */}
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

export default StrategyPage
