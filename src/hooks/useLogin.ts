import { useCallback, useEffect } from 'react'
import { useWalletClient } from 'wagmi'
// import { toHex } from 'viem'
import { useWallet } from './useWallet'
import { useUserStore } from '@/store'
import toast from '@/utils/toast'
import { getLoginSignMessage, doLogin } from '@/service/api'

import { useAppKitProvider } from '@reown/appkit/react'
import type { Provider } from '@reown/appkit-adapter-solana/react'

export default function useLogin() {
  const { walletState, isConnected, address, connectWallet, disconnectWallet } =
    useWallet()
  // const { signMessage, data, error, isLoading } = useSignMessage()
  const { data: walletClient, error: clientError } = useWalletClient()

  const userInfo = useUserStore(state => state.userInfo)
  const updateAddress = useUserStore(state => state.updateAddress)
  const updateUserInfo = useUserStore(state => state.updateUserInfo)

  const { walletProvider } = useAppKitProvider<Provider>('solana')

  const signAndLogin = useCallback(
    async (address: string) => {
      try {
        const message = await getLoginSignMessage()

        let signature: string
        if (walletState.activeChain === 'solana') {
          if (!walletProvider) return
          const res = await walletProvider.signMessage(
            new TextEncoder().encode(message)
          )
          signature = Buffer.from(res).toString('hex')
        } else {
          if (!walletClient) return
          signature = await walletClient.signMessage({
            message: message
          })
        }
        const res = await doLogin(address, signature)
        updateUserInfo(res.uuid)
      } catch (e) {
        toast.error(e)
      }
    },
    [walletState.activeChain, walletClient, walletProvider, updateUserInfo]
  )
  useEffect(() => {
    if (isConnected && address) {
      if (userInfo && userInfo[address.toLocaleLowerCase()]) return

      updateUserInfo('')
      updateAddress(address)
      signAndLogin(address)
    }
  }, [
    isConnected,
    address,
    signAndLogin,
    userInfo,
    updateAddress,
    updateUserInfo
  ])

  const login = () => {
    if (isConnected && address) {
      signAndLogin(address)
    } else {
      connectWallet()
    }
  }

  return {
    isConnected,
    address,
    disconnectWallet,
    login
  }
}
