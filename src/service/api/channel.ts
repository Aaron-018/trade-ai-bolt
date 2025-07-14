import http from '..'
import { IWEBHOOKChannel, IUpdateChannel } from './types'

http.post({
  baseURL: '/xxx',
  url: '/messages',
  data: {a: 1}
})

export async function getChannels() {
  const res = await http.post({
    url: '/customer/listCustomerChannels'
  })
  if (res.code === 0) {
    return res.data
  }
  return []
}

export async function addApiChannel(channel: IWEBHOOKChannel) {
  const res = await http.post({
    url: '/customer/addApiChannels',
    data: channel
  })
  if (res.code === 0) {
    return res.data
  }
  throw res.msg
}

export async function addTgChannel(channelName: string) {
  const res = await http.post({
    url: '/customer/addTgChannels',
    data: { channelName }
  })
  if (res.code === 0) {
    return res.data
  }
  throw res.msg
}

export async function updateChannel(channel: IUpdateChannel) {
  const res = await http.post({
    url: '/customer/updateNotificationChannels',
    data: channel
  })
  if (res.code === 0) {
    return res.data
  }
  throw res.msg
}

export async function testTgSend(channelId: string) {
  const res = await http.post({
    url: '/customer/tgSendTest',
    data: { id: channelId }
  })
  if (res.code === 0) {
    return res.data
  }
  throw res.msg
}

export async function deleteChannel(id: number) {
  const res = await http.post({
    url: '/customer/removeNotificationChannels',
    data: { ids: [id] }
  })
  if (res.code === 0) {
    return res.data
  }
  throw res.msg
}
