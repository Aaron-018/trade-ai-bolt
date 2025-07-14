import { useEffect } from 'react'
import {
  useAppKit,
  useAppKitState,
  useAppKitAccount,
  useDisconnect,
  useAppKitNetwork
} from '@reown/appkit/react'
// import { useAccount, useDisconnect, useChainId, useSwitchChain } from 'wagmi'
import { useSignMessage } from 'wagmi'
import { defaultNetwork, getAllNetworks, networks } from '@/config/wagmi'
import { useUserStore } from '@/store'
import { setDisconnectHandle } from '@/service/request'

export const useWallet = () => {
  const { open } = useAppKit()

  const walletState = useAppKitState()
  const { address, isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const { switchNetwork: switchChain } = useAppKitNetwork()
  const { signMessage } = useSignMessage()

  const updateUserInfo = useUserStore(state => state.updateUserInfo)

  useEffect(() => {
    if (disconnect && updateUserInfo) {
      setDisconnectHandle(() => {
        updateUserInfo('')
        disconnect()
      })
    }
  }, [disconnect, updateUserInfo])

  // 获取可用的网络列表
  const availableNetworks = getAllNetworks()

  // 连接钱包
  const connectWallet = () => {
    // open({ view: 'Connect', namespace: 'eip155' })
    open()
  }

  // 断开钱包连接
  const disconnectWallet = () => {
    disconnect()
  }

  // 切换网络
  const switchNetwork = async (networkId: string | number) => {
    switchChain(networks[0])
    // try {
    //   if (networkId === 'solana') {
    //     setSelectedNetwork('solana')
    //     if (isConnected) {
    //       disconnect()
    //     }
    //   } else {
    //     setSelectedNetwork('evm')
    //     if (solanaWallet.connected) {
    //       solanaWallet.disconnect()
    //     }
    //     if (typeof networkId === 'number' && networkId !== chainId) {
    //       await switchChain({ chainId: networkId })
    //     }
    //   }
    //   const networkInfo = getNetworkInfo(networkId)
    //   toast.success(`已切换到 ${networkInfo.name} 网络`)
    // } catch (error) {
    //   console.error('网络切换失败:', error)
    //   toast.error('网络切换失败')
    // }
  }

  // 监听 AppKit 连接状态变化
  /* useEffect(() => {
    const unsubscribe = appKit.subscribeState(state => {
      if (state.open === false && selectedNetwork === 'evm') {
        // AppKit 关闭时的处理
      }
    })
    return () => {
      unsubscribe()
    }
  }, [selectedNetwork]) */

  return {
    walletState,
    isConnected,
    address,
    currentNetwork: defaultNetwork,

    availableNetworks,

    // 操作方法
    connectWallet,
    disconnectWallet,
    switchNetwork,
    signMessage
  }
}
