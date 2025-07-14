import { create } from 'zustand'
import {
  getChannels,
  addApiChannel,
  addTgChannel,
  deleteChannel,
  updateChannel as updateChannelApi
} from '@/service/api'
import { IChannel, IUpdateChannel, IWEBHOOKChannel } from '@/service/api/types'

interface State {
  channels: IChannel[]
}

interface Action {
  // setList: (list: IWatchListItem[]) => void
  getChannels: () => Promise<void>
  setChannels: (channels: IChannel[]) => void
  updateChannel: (channel: IUpdateChannel) => Promise<void>
  addApiChannel: (channel: IWEBHOOKChannel) => Promise<void>
  addTgChannel: (channelName: string) => Promise<string>
  deleteChannel: (channel: IChannel) => Promise<void>
}

const useChannelStore = create<State & Action>((set, get) => ({
  channels: [],

  getChannels: async () => {
    const res = await getChannels()
    set(() => ({ channels: res }))
  },

  setChannels: (channels: IChannel[]) => {
    set(() => ({ channels }))
  },

  updateChannel: async channel => {
    await updateChannelApi(channel)
  },

  addApiChannel: async channel => {
    await addApiChannel(channel)
    get().getChannels()
  },

  addTgChannel: async channelName => {
    const channelId = await addTgChannel(channelName)
    get().getChannels()
    return channelId
  },

  deleteChannel: async channel => {
    await deleteChannel(channel.id)
    get().getChannels()
  }
}))

export default useChannelStore
