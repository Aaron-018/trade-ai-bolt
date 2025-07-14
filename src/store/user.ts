import { create } from 'zustand'
import storage from '@/utils/storage'

interface State {
  address: string
  userInfo: {
    [address: string]: string
  } | null
}

interface Action {
  updateAddress: (address: string) => void
  updateUserInfo: (uuid?: string) => void
}

const useUserStore = create<State & Action>((set, get) => ({
  address: '',
  userInfo: storage.get('userInfo') || null,

  updateAddress: (address: string) => {
    const oldAddress = get().address
    if (oldAddress !== address) {
      set(() => ({ address }))
      get().updateUserInfo()
    }
  },

  updateUserInfo: (uuid?: string) => {
    if (!uuid) {
      storage.remove('userInfo')
      set(() => ({ userInfo: null }))
      return
    }
    const address = get().address
    const userInfo = { [address.toLocaleLowerCase()]: uuid }
    storage.set('userInfo', userInfo)
    set(() => ({
      userInfo
    }))
  }
}))

export default useUserStore
