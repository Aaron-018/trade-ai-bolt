import { useState, useEffect } from 'react'
import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { appKit, getAllNetworks, getNetworkInfo } from '@/config/wagmi'
import toast from '@/utils/toast'

// 新增：引入 Solana 钱包 hook
import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react'

// Solana 钱包状态（模拟，实际需要集成 Solana 钱包适配器）
interface SolanaWallet {
  connected: boolean
  address: string | null
}

export const useWallet = () => {
  // EVM hooks
  const { address, isConnected, connector } = useAccount()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitching } = useSwitchChain()

  // Solana 钱包 hook
  const solanaWallet = useSolanaWallet()

  // 当前选中的网络类型
  const [selectedNetwork, setSelectedNetwork] = useState<'evm' | 'solana'>('evm')

  // 获取当前网络信息
  const currentNetwork =
    selectedNetwork === 'solana'
      ? getNetworkInfo('solana')
      : getNetworkInfo(chainId)

  // 获取可用的网络列表
  const availableNetworks = getAllNetworks()

  // 连接钱包
  const connectWallet = async () => {
    try {
      if (selectedNetwork === 'solana') {
        await solanaWallet.connect()
        toast.success('Solana 钱包连接成功')
      } else {
        await appKit.open()
      }
    } catch (error) {
      console.error('钱包连接失败:', error)
      toast.error('钱包连接失败')
    }
  }

  // 断开钱包连接
  const disconnectWallet = () => {
    if (selectedNetwork === 'solana') {
      solanaWallet.disconnect()
      toast.success('Solana 钱包已断开')
    } else {
      disconnect()
      appKit.close()
    }
  }

  // 切换网络
  const switchNetwork = async (networkId: string | number) => {
    try {
      if (networkId === 'solana') {
        setSelectedNetwork('solana')
        if (isConnected) {
          disconnect()
        }
      } else {
        setSelectedNetwork('evm')
        if (solanaWallet.connected) {
          solanaWallet.disconnect()
        }
        if (typeof networkId === 'number' && networkId !== chainId) {
          await switchChain({ chainId: networkId })
        }
      }
      const networkInfo = getNetworkInfo(networkId)
      toast.success(`已切换到 ${networkInfo.name} 网络`)
    } catch (error) {
      console.error('网络切换失败:', error)
      toast.error('网络切换失败')
    }
  }

  // 获取当前连接状态
  const isWalletConnected =
    selectedNetwork === 'solana' ? solanaWallet.connected : isConnected

  // 获取当前地址
  const currentAddress =
    selectedNetwork === 'solana'
      ? solanaWallet.publicKey?.toBase58() || undefined
      : address

  // 格式化地址显示
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // 监听 AppKit 连接状态变化
  useEffect(() => {
    const unsubscribe = appKit.subscribeState(state => {
      if (state.open === false && selectedNetwork === 'evm') {
        // AppKit 关闭时的处理
      }
    })
    return () => {
      unsubscribe()
    }
  }, [selectedNetwork])

  return {
    // 连接状态
    isConnected: isWalletConnected,
    address: currentAddress,
    formattedAddress: formatAddress(currentAddress),

    // 网络信息
    currentNetwork,
    availableNetworks,
    selectedNetwork,

    // 操作方法
    connectWallet,
    disconnectWallet,
    switchNetwork,

    // 加载状态
    isConnecting: solanaWallet.connecting || false,
    isSwitching,

    // 原始 wagmi hooks（用于高级用法）
    wagmi: {
      address,
      isConnected,
      connector,
      chainId,
      disconnect,
      switchChain
    },
    // Solana hooks（如需高级用法）
    solana: solanaWallet
  }
}
