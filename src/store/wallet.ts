import { create } from 'zustand'

interface State {
  balance: string
}

interface Action {
  getBalance: () => Promise<string>
}

const useWalletStore = create<State & Action>(set => ({
  balance: '',

  getBalance: async () => {
    return  ''
  }
}))

export default useWalletStore
