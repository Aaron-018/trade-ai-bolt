import React, { createContext, useContext, useState, useEffect } from 'react'

interface WalletContextType {
  isConnected: boolean
  address: string | null
  chainId: number | null
  connect: () => Promise<void>
  disconnect: () => void
  switchChain: (chainId: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: React.ReactNode
}

const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)

  // 模拟钱包连接逻辑
  const connect = async () => {
    try {
      // 这里将来会集成真实的WalletConnect逻辑
      // 目前使用模拟数据
      await new Promise(resolve => setTimeout(resolve, 2000)) // 模拟连接延迟

      setIsConnected(true)
      setAddress('0x1234567890abcdef1234567890abcdef12345678')
      setChainId(1) // Ethereum Mainnet

      console.log('钱包连接成功')
    } catch (error) {
      console.error('钱包连接失败:', error)
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setChainId(null)
    console.log('钱包已断开连接')
  }

  const switchChain = async (newChainId: number) => {
    try {
      // 模拟切换链的过程
      await new Promise(resolve => setTimeout(resolve, 1000))
      setChainId(newChainId)
      console.log(`已切换到链 ${newChainId}`)
    } catch (error) {
      console.error('切换链失败:', error)
    }
  }

  // 检查钱包连接状态（页面刷新时）
  useEffect(() => {
    // 这里将来会检查是否有已连接的钱包
    // 目前跳过自动连接逻辑
  }, [])

  const value: WalletContextType = {
    isConnected,
    address,
    chainId,
    connect,
    disconnect,
    switchChain
  }

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  )
}

export default WalletProvider
