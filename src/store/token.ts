import { create } from 'zustand'
import { getFuturesList, getSpotList, getAlertList } from '@/service/api'
import { Futures, Spot, IAlert, SortDirection } from '@/service/api/types'

interface State {
  cexFilter: {
    tokenName: string
    exchange: string
    status: string
  }
  spotLoading: boolean
  spotList: Spot[]
  spotPageInfo: {
    page: number
    total: number
  }
  spotSortInfo: {
    field: string
    sortDirection: SortDirection
  }

  futureLoading: boolean
  futuresList: Futures[]
  futuresPageInfo: {
    page: number
    total: number
  }
  futuresSortInfo: {
    field: string
    sortDirection: SortDirection
  }

  alerts: IAlert[]
}

interface Action {
  setCexFilter: (filter: State['cexFilter']) => void
  getSpotList: () => void
  getFuturesList: () => void
  getAlertList: () => void
}

const useTokenStore = create<State & Action>((set, get) => ({
  cexFilter: {
    tokenName: '',
    exchange: '',
    status: ''
  },
  spotLoading: true,
  spotList: [],
  spotPageInfo: {
    page: 1,
    total: 0
  },
  spotSortInfo: {
    field: '',
    sortDirection: null
  },
  futureLoading: true,
  futuresList: [],
  futuresPageInfo: {
    page: 1,
    total: 0
  },
  futuresSortInfo: {
    field: '',
    sortDirection: null
  },

  alerts: [],

  setCexFilter: filter => {
    set({ cexFilter: filter })
  },

  getSpotList: async () => {
    const res = await getSpotList()
  },

  getFuturesList: async () => {
    const res = await getFuturesList()
  },

  getAlertList: async () => {
    const res = await getAlertList()
    set({
      alerts: res.list
    })
  }
}))

export default useTokenStore
