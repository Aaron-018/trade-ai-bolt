import http from '..'
import { IList } from './types'
import { ISmartAddress, IWatchListItem } from './types'

export async function getWatchList(pageNum: number, pageSize = 15) {
  const res = await http.post<IList<IWatchListItem>>({
    url: '/customer/listCustomerSubAddresses',
    data: { pageNum, pageSize }
  })
  if (res.code === 0) {
    return {
      list: res.data.list,
      total: res.data.totalCount,
      totalPage: res.data.totalPage
    }
  }
  return {
    list: [],
    total: 0,
    totalPage: 0
  }
}

export async function addWatchItems(items: ISmartAddress[], unsub = false) {
  const res = await http.post({
    url: '/customer/subSmartAddr',
    data: {
      sub: items,
      unsub
    }
  })
  if (res.code !== 0) {
    throw res.msg
  }
}

export async function deleteWatchItem(id: number) {
  const res = await http.post({
    url: '/customer/removeSmartAddr',
    data: { ids: [id] }
  })
  if (res.code !== 0) {
    throw res.msg
  }
}
