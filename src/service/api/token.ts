import http from '..'
import {
  IList,
  Futures,
  Spot,
  IAlert,
  CexListQuery,
  AlertListQuery,
  SpotHistory,
  FuturesHistory
} from './types'

const pageSize = 5

export async function getSpotList(data: CexListQuery | null) {
  const {
    pageNum = 1,
    token = '',
    dataSource = '',
    status = '',
    orderName = '',
    orderBy = 'DESC'
  } = data || {}
  const res = await http.post<IList<Spot>>({
    url: '/token/spot/list',
    data: {
      pageNum,
      pageSize,
      token,
      dataSource,
      status,
      orderName,
      orderBy: orderBy.toUpperCase()
    }
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

export async function getFuturesList(data: CexListQuery | null) {
  const {
    pageNum = 1,
    token = '',
    dataSource = '',
    status = '',
    orderName = '',
    orderBy = 'DESC'
  } = data || {}
  const res = await http.post<IList<Futures>>({
    url: '/token/futures/list',
    data: {
      pageNum,
      pageSize,
      token,
      dataSource,
      status,
      orderName,
      orderBy: orderBy.toUpperCase()
    }
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

export async function getSpotHistory(symbol: string, dataSource: string) {
  const res = await http.post<SpotHistory[]>({
    url: 'token/spot/history/list',
    params: { symbol, dataSource }
  })
  if (res.code === 0) {
    return res.data
  }
  return []
}

export async function getFuturesHistory(symbol: string, dataSource: string) {
  const res = await http.post<FuturesHistory[]>({
    url: 'token/futures/history/list',
    params: { symbol, dataSource }
  })
  if (res.code === 0) {
    return res.data
  }
  return []
}

export async function getAlertList(data: AlertListQuery | null) {
  const { pageNum = 1, keywords = '', riskLevel = '' } = data || {}
  const res = await http.post<IList<IAlert>>({
    url: '/token/alert/list',
    data: {
      pageNum,
      pageSize: 5,
      keywords,
      riskLevel
      /* keywords: 'string',
      riskLevel: 'string',
      alertType: 'string',
      dataSource: 'string',
      orderName: 'MC',
      orderBy: 'ASC' */
    }
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
