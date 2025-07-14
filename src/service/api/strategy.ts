import http from '..'
import {
  IWalletStrategy,
  ICexStrategy,
  IArticle,
  IAddWalletStrategy,
  IUpdateWalletStrategy
} from './types'

export async function getWalletStrategies() {
  const res = await http.post<IWalletStrategy[]>({
    url: '/customer/listCustomerTradeStrategy'
  })
  if (res.code === 0) {
    return res.data
  }
  return []
}

export async function getCexStrategies() {
  const res = await http.post<ICexStrategy[]>({
    url: '/customer/listCustomerSubArticleTypes'
  })
  if (res.code === 0) {
    return res.data
  }
  return []
}

export async function addWalletStrategy(strategy: IAddWalletStrategy) {
  const res = await http.post({
    url: '/customer/addCustomerTradeStrategy',
    data: strategy
  })
  if (res.code === 0) {
    return res.data
  }
  throw res.msg
}

export async function updateWalletStrategy(
  strategy: Partial<IUpdateWalletStrategy>
) {
  const res = await http.post({
    url: '/customer/updateCustomerTradeStrategy',
    data: strategy
  })
  if (res.code === 0) {
    return res.data
  }
  throw res.msg
}

export async function deleteWalletStrategy(id: number) {
  const res = await http.post({
    url: '/customer/removeCustomerTradeStrategy',
    data: { ids: [id] }
  })
  if (res.code === 0) {
    return res.data
  }
  throw res.msg
}

export async function addCexStrategy(source: IArticle, unsub = false) {
  const res = await http.post({
    url: '/customer/subArticle',
    data: {
      sub: [{ source }],
      unsub
    }
  })
  if (res.code === 0) {
    return res.data
  }
  throw res.msg
}
