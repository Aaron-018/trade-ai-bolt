import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  CheckCircle
} from 'lucide-react'

interface Chain {
  id: string
  name: string
  icon: string
  color: string
}

const supportedChains: Chain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: '⟠',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'bsc',
    name: 'BSC',
    icon: '🔶',
    color: 'from-yellow-400 to-yellow-600'
  },
  {
    id: 'base',
    name: 'Base',
    icon: '🔵',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'solana',
    name: 'Solana',
    icon: '◎',
    color: 'from-purple-400 to-pink-600'
  }
]

const WalletConnectButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedChain, setSelectedChain] = useState<Chain>(supportedChains[0])
  const [showChainSelector, setShowChainSelector] = useState(false)
  const [showWalletMenu, setShowWalletMenu] = useState(false)
  const [address] = useState('0x1234...5678') // 模拟地址
  const [copied, setCopied] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    // 模拟连接过程
    setTimeout(() => {
      setIsConnected(true)
      setIsConnecting(false)
    }, 2000)
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setShowWalletMenu(false)
  }

  const copyAddress = () => {
    navigator.clipboard.writeText('0x1234567890abcdef1234567890abcdef12345678')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isConnected) {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowWalletMenu(!showWalletMenu)}
          className="from-primary-500/20 to-accent-500/20 border-primary-500/30 hover:border-primary-400/50 flex items-center space-x-3 rounded-lg border bg-gradient-to-r px-4 py-2 text-white backdrop-blur-sm transition-all duration-200">
          <div
            className={`h-2 w-2 rounded-full bg-gradient-to-r ${selectedChain.color} animate-pulse`}
          />
          <span className="text-lg">{selectedChain.icon}</span>
          <span className="font-medium">{address}</span>
          <ChevronDown className="h-4 w-4" />
        </motion.button>

        <AnimatePresence>
          {showWalletMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-gray-900/95 shadow-2xl backdrop-blur-md">
              <div className="border-b border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">钱包地址</span>
                  <button
                    onClick={copyAddress}
                    className="text-primary-400 hover:text-primary-300 flex items-center space-x-1 text-xs transition-colors">
                    {copied ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copied ? '已复制' : '复制'}</span>
                  </button>
                </div>
                <p className="mt-1 font-mono text-white">0x1234...12345678</p>
              </div>

              <div className="space-y-1 p-2">
                <button
                  onClick={() => setShowChainSelector(!showChainSelector)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-white transition-colors hover:bg-white/10">
                  <div className="flex items-center space-x-2">
                    <span>{selectedChain.icon}</span>
                    <span>{selectedChain.name}</span>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {showChainSelector && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden">
                      <div className="space-y-1 pl-6">
                        {supportedChains.map(chain => (
                          <button
                            key={chain.id}
                            onClick={() => {
                              setSelectedChain(chain)
                              setShowChainSelector(false)
                            }}
                            className={`flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left transition-colors ${
                              selectedChain.id === chain.id
                                ? 'bg-primary-500/20 text-primary-300'
                                : 'text-gray-300 hover:bg-white/10'
                            }`}>
                            <span>{chain.icon}</span>
                            <span>{chain.name}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-gray-300 transition-colors hover:bg-white/10">
                  <ExternalLink className="h-4 w-4" />
                  <span>查看资产</span>
                </button>

                <button
                  onClick={handleDisconnect}
                  className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-left text-red-400 transition-colors hover:bg-red-500/10">
                  <LogOut className="h-4 w-4" />
                  <span>断开连接</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleConnect}
      disabled={isConnecting}
      className="from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 relative flex items-center space-x-2 overflow-hidden rounded-lg bg-gradient-to-r px-6 py-2 font-medium text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70">
      {isConnecting && (
        <motion.div
          className="from-primary-400/50 to-accent-400/50 absolute inset-0 bg-gradient-to-r"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        />
      )}
      <Wallet className="relative z-10 h-4 w-4" />
      <span className="relative z-10">
        {isConnecting ? '连接中...' : '连接钱包'}
      </span>
    </motion.button>
  )
}

export default WalletConnectButton
