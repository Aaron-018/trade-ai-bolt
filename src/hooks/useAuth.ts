import { useState, useEffect, useMemo } from 'react'
import { useWallet } from './useWallet'
import { useUserStore } from '@/store'

export default function useAuth() {
  // const [hasAuth, setHasAuth] = useState(false)
  const { address } = useWallet()
  const userInfo = useUserStore(state => state.userInfo)

  /* useEffect(() => {
    if (address && userInfo && userInfo[address.toLocaleLowerCase()]) {
      setHasAuth(true)
    } else {
      setHasAuth(false)
    }
  }, [address, userInfo]) */

  return useMemo(() => {
    if (address && userInfo && userInfo[address.toLocaleLowerCase()]) {
      return true
    } else {
      return false
    }
  }, [address, userInfo])
}
