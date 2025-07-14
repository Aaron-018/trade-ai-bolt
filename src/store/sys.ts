import { create } from 'zustand'
import storage from '@/utils/storage'
import { getSysConfig } from '@/service/api'
import { ISys } from '@/service/api/types'

interface State {
  config: ISys
}

interface Action {
  getSysConfig: () => void
}

const useSysStore = create<State & Action>(set => ({
  config: storage.get('sysConfig') || null,

  getSysConfig: async () => {
    getSysConfig().then(res => {
      if (res) {
        storage.set('sysConfig', res)
        set(() => ({
          config: res
        }))
      }
    })
  }
}))

export default useSysStore
