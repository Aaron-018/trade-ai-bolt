import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Trash2, Copy, ExternalLink } from 'lucide-react'
import Switch from '@/components/Switch'
import AddWalletDrawer from '@/components/AddWalletDrawer'
import Button from '@/components/Button'
import toast from '@/utils/toast'

interface WalletItem {
  id: string
  address: string
  isWatching: boolean
}

const Home = () => {
  const [wallets, setWallets] = useState<WalletItem[]>([
    {
      id: '1',
      address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      isWatching: true
    },
    {
      id: '2',
      address: '0x8ba1f109551bD432803012645Hac136c22C57B',
      isWatching: true
    },
    {
      id: '3',
      address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      isWatching: false
    },
    {
      id: '4',
      address: '0xA0b86a33E6441E8e421130d5240c2a7b8C4C4b2F',
      isWatching: true
    },
    {
      id: '5',
      address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
      isWatching: false
    }
  ])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // 地址省略显示函数
  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  // 获取地址后4位作为简称
  const getAddressShort = (address: string) => {
    if (!address) return ''
    return address.slice(-4).toUpperCase()
  }

  // 复制地址到剪贴板
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.success('地址已复制到剪贴板')
  }

  // 切换观察状态
  const toggleWatching = (id: string) => {
    setWallets(prev => prev.map(wallet => 
      wallet.id === id 
        ? { ...wallet, isWatching: !wallet.isWatching }
        : wallet
    ))
    
    const wallet = wallets.find(w => w.id === id)
    if (wallet) {
      toast.success(
        wallet.isWatching 
          ? `已停止观察 ${formatAddress(wallet.address)}` 
          : `已开始观察 ${formatAddress(wallet.address)}`
      )
    }
  }

  // 删除钱包
  const deleteWallet = (id: string) => {
    const wallet = wallets.find(w => w.id === id)
    if (wallet) {
      setWallets(prev => prev.filter(w => w.id !== id))
      toast.success(`已删除钱包 ${formatAddress(wallet.address)}`)
    }
  }

  // 添加钱包（支持批量）
  const handleAddWallet = (addresses: string[]) => {
    const newWallets: WalletItem[] = []
    const duplicates: string[] = []

    addresses.forEach(address => {
      // 检查是否已存在
      const exists = wallets.some(w => w.address.toLowerCase() === address.toLowerCase())
      if (exists) {
        duplicates.push(address)
      } else {
        newWallets.push({
          id: `${Date.now()}-${Math.random()}`,
          address,
          isWatching: true
        })
      }
    })

    if (newWallets.length > 0) {
      setWallets(prev => [...prev, ...newWallets])
    }

    if (duplicates.length > 0) {
      toast.error(`${duplicates.length} 个地址已存在，已跳过`)
    }
  }

  // 统计数据
  const stats = {
    total: wallets.length,
    watching: wallets.filter(w => w.isWatching).length
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和统计 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-defi-text mb-2">观察钱包</h1>
          <p className="text-defi-text-muted">监控和管理您关注的钱包地址</p>
        </div>
        
        <Button
          onClick={() => setIsDrawerOpen(true)}
          variant="primary"
        >
          添加钱包
        </Button>
      </motion.div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-defi-text-muted text-sm">总钱包数</p>
              <p className="text-2xl font-bold text-defi-text font-mono">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-defi-text-muted text-sm">正在观察</p>
              <p className="text-2xl font-bold text-primary-400 font-mono">{stats.watching}</p>
            </div>
            <div className="w-12 h-12 bg-secondary-500/10 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-secondary-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 钱包列表 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-neutral-800">
          <h2 className="text-lg font-semibold text-defi-text">钱包列表</h2>
        </div>

        <div className="divide-y divide-neutral-800">
          {wallets.map((wallet, index) => (
            <motion.div
              key={wallet.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="p-6 hover:bg-neutral-800/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                {/* 钱包信息 */}
                <div className="flex items-center space-x-3">
                  {/* 地址简称圆形头像 */}
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg border border-primary-500/30 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {getAddressShort(wallet.address)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-defi-text font-medium">
                        {formatAddress(wallet.address)}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => copyAddress(wallet.address)}
                        className="text-defi-text-muted hover:text-primary-400 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-defi-text-muted hover:text-primary-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* 操作栏 */}
                <div className="flex items-center space-x-4">
                  {/* 观察开关 */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-defi-text-muted">观察</span>
                    <Switch
                      checked={wallet.isWatching}
                      onChange={() => toggleWatching(wallet.id)}
                    />
                  </div>

                  {/* 状态指示器 */}
                  <div className="flex items-center space-x-1">
                    {wallet.isWatching ? (
                      <Eye className="w-4 h-4 text-primary-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-defi-text-muted" />
                    )}
                    <span className={`text-xs ${
                      wallet.isWatching ? 'text-primary-400' : 'text-defi-text-muted'
                    }`}>
                      {wallet.isWatching ? '观察中' : '已暂停'}
                    </span>
                  </div>

                  {/* 删除按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteWallet(wallet.id)}
                    className="p-2 text-defi-text-muted hover:text-error-400 hover:bg-error-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 空状态提示 */}
      {wallets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-xl"
        >
          <Eye className="w-16 h-16 text-defi-text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-defi-text mb-2">暂无观察钱包</h3>
          <p className="text-defi-text-muted mb-6">添加您想要监控的钱包地址开始使用</p>
          <Button
            onClick={() => setIsDrawerOpen(true)}
            variant="primary"
          >
            添加第一个钱包
          </Button>
        </motion.div>
      )}

      {/* 添加钱包抽屉 */}
      <AddWalletDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAddWallet={handleAddWallet}
      />
    </div>
  )
}

export default Home