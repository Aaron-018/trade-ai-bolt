import { create } from 'zustand'
import { getWatchList, addWatchItems, deleteWatchItem } from '@/service/api'
import { IWatchListItem, ISmartAddress } from '@/service/api/types'

interface State {
  list: IWatchListItem[]
}

interface Action {
  setList: (list: IWatchListItem[]) => void
  getList: (loadMore?: boolean) => Promise<void>
  addItems: (items: ISmartAddress[], isUnsub?: boolean) => Promise<void>
  toggleItem: (item: IWatchListItem) => Promise<void>
  deleteItem: (item: IWatchListItem) => Promise<void>
}

let pageNum = 1
const useWatchListStore = create<State & Action>((set, get) => ({
  list: [],

  setList: list => {
    set(() => ({ list }))
  },

  getList: async loadMore => {
    const prev = get().list
    if (!loadMore) pageNum = 1
    const { list } = await getWatchList(pageNum)
    let next = list
    if (loadMore) {
      next = [...prev, ...list]
    }
    pageNum++
    set(() => ({ list: next }))
  },

  // add or update
  addItems: async (items, isUnsub = false) => {
    return await addWatchItems(items, isUnsub)
  },

  toggleItem: async item => {
    const { listeningAddress, source, addressAlias, isActive } = item
    const account: ISmartAddress = {
      addr: listeningAddress,
      source: source,
      alias: addressAlias
    }
    const isUnsub = isActive === 1
    return addWatchItems([account], isUnsub)
  },

  deleteItem: async item => {
    await deleteWatchItem(item.id)
  }
}))

export default useWatchListStore
