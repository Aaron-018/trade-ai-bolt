import { create } from 'zustand'
import {
  getWalletStrategies,
  getCexStrategies,
  addWalletStrategy,
  updateWalletStrategy,
  deleteWalletStrategy,
  addCexStrategy
} from '@/service/api'
import {
  IWalletStrategy,
  ICexStrategy,
  IArticle,
  IAddWalletStrategy,
  IUpdateWalletStrategy
} from '@/service/api/types'

interface State {
  walletStrategies: IWalletStrategy[]
  cexStrategies: ICexStrategy[]
}

interface Action {
  // setList: (list: IWatchListItem[]) => void
  resetState: () => void
  getWalletStrategies: () => Promise<void>
  getCexStrategies: () => Promise<void>
  addWalletStrategy: (strategy: IAddWalletStrategy) => Promise<void>
  updateWalletStrategy: (
    strategy: Partial<IUpdateWalletStrategy>
  ) => Promise<void>
  deleteWalletStrategy: (id: number) => Promise<void>
  addCexStrategy: (source: IArticle, unsub: boolean) => Promise<void>
}

const useStrategyStore = create<State & Action>((set, get) => ({
  walletStrategies: [],
  cexStrategies: [],

  resetState: () => {
    set({ walletStrategies: [] })
  },

  getWalletStrategies: async () => {
    const res = await getWalletStrategies()
    set({
      walletStrategies: res
    })
  },

  getCexStrategies: async () => {
    const res = await getCexStrategies()
    set({
      cexStrategies: [...res]
    })
  },

  addWalletStrategy: async strategy => {
    await addWalletStrategy(strategy)
    get().getWalletStrategies()
  },

  updateWalletStrategy: async strategy => {
    await updateWalletStrategy(strategy)
    get().getWalletStrategies()
  },

  deleteWalletStrategy: async id => {
    await deleteWalletStrategy(id)
    get().getWalletStrategies()
  },

  addCexStrategy: async (source, unsub = false) => {
    await addCexStrategy(source, unsub)
    get().getCexStrategies()
  }
}))

export default useStrategyStore
