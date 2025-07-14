//c85c79b8-28b0-4a91-8cdd-01850cab3ad8

export type IList<T> = {
  currPage: number
  list: T[]
  pageSize: number
  totalPage: number
  totalCount: number
}

export type IArticle =
  | 'Binance'
  | 'Coinbase'
  | 'OKX'
  | 'Bybit'
  | 'Kraken'
  | 'Upbit'
type SmartAddressType = 'Whale' | 'DeFiWhale' | 'Institutional' | 'Other'
type SmartAddressSource = 'Solana' | 'BSC'
export type ChannelType = 'TELEGRAM' | 'WEBHOOK'
export interface ISys {
  articleSources: IArticle[]
  smartAddressTypes: SmartAddressType[]
  smartAddressSources: SmartAddressSource[]
  channels: ChannelType[]
  tags: string[]
  expirationTime: number
}

export interface ILoginRes {
  address: string
  uuid: string
}

export interface ISmartAddress {
  source: string
  addr: string
  alias: string
}

export interface IWatchItem {
  sub: ISmartAddress[]
  unsub: boolean
}

export interface IWatchListItem {
  createdDate: number
  updatedDate: number
  versionId: number
  markDelete: string
  id: number
  customerId: number
  customerGroupId: number
  listeningAddress: string
  source: string
  addressAlias: string
  isActive: number
  isEdit: boolean
}

export interface IAddWalletStrategy {
  name: string
  operations: string[]
  minAmountUsd: string
  notifyChannelIds: number[]
}

export interface IUpdateWalletStrategy extends IAddWalletStrategy {
  strategyId: number
  inactive: boolean
}

export interface IWalletStrategy {
  createdDate: number
  updatedDate: number
  versionId: number
  markDelete: string
  id: number
  monitorName: string
  customerId: number
  customerGroupId: number
  operationType: string
  minAmountUsd: number
  mainstreamOnly: number
  isActive: 1 | 0
  notificationChannels: IChannel[]
}

export interface ICexStrategy {
  createdDate: number
  updatedDate: number
  versionId: number
  markDelete: string
  id: number
  customerId: number
  source: IArticle
  tag: any
  isActive: 1 | 0
}

export interface ITgChannel {
  channel: 'TELEGRAM'
  channelName: string
  config: {
    chatId: string
  }
  unsub: boolean
}

export interface IWEBHOOKChannel {
  channelName: string
  config: {
    url: string
    Authorization?: string
  }
}

export interface IUpdateChannel {
  channelId: number
  channelName: string
  config:
    | {
        url: string
        Authorization?: string
      }
    | {
        chatId: string
      }
  unsub: boolean
}

export interface IChannel {
  createdDate: number
  updatedDate: number
  versionId: number
  markDelete: string
  id: number
  channelName: string
  customerId: number
  channelType: ChannelType
  channelConfig: string
  isActive: 1 | 0
}

export interface CexListQuery {
  pageNum: number
  token: string
  dataSource: string
  status: string
  orderName: string
  orderBy: string
}

interface TokenBase {
  id: number
  dataSource: string
  symbol: string
  tokenName: string
  baseAsset: string
  quoteAsset: string
  categories: string
  status: string
  volume24h: number
  high24h: number
  low24h: number
  marketCap: number
  priceChangePercent24h: number
}

export interface Spot extends TokenBase {
  currentPrice: string
  depth2Ask: string
  depth2Bid: string
  depth5Ask: string
  depth5Bid: string
  liquidityScore: string
  totalSupply: string
  circulatingSupply: string
  volumeToken24h: string
}

export interface Futures extends TokenBase {
  indexPrice: number
  basis: number
  lastFundingRate: number // ???
  fundingIntervalHours: number
  openInterestUsdt: number
}

export type SortDirection = 'asc' | 'desc' | null

interface TokenHistory {
  id: number
  createdDate: number
  dataSource: string
  tokenId: number
  symbol: string
  volume24h: number
}

export interface SpotHistory extends TokenHistory {
  depth2Ask: number
  depth2Bid: number
  depth5Ask: number
  depth5Bid: number
}

export interface FuturesHistory extends TokenHistory {
  basis: number
  lastFundingRate: number
  openInterestUsdt: number
}

export interface AlertListQuery {
  pageNum: number
  keywords: string
  riskLevel: RiskLevel
}

export type RiskLevel = 'L' | 'M' | 'H' | 'U' | ''
export interface IAlert {
  id: number
  createdDate: number
  alertContent: string
  riskLevel: RiskLevel
}

// spot
// {
//   "createdDate": 1746018000000,
//   "updatedDate": 1746021587269,
//   "versionId": 158,
//   "markDelete": "N",
//   "id": 1,
//   "tokenId": 1,
//   "symbol": "BTCUSDT",
//   "depth2Bid": 24807337.71390283,
//   "depth2Ask": 20904186.20673205,
//   "depth5Bid": 24807337.71390283,
//   "depth5Ask": 20904186.20673205,
//   "volume24h": 1637281910.615537,
//   "dataSource": "Binance",
//   "updatedOrder": null
// }

// futures
// {
//   "createdDate": 1746018000000,
//   "updatedDate": 1746021595853,
//   "versionId": 298,
//   "markDelete": "N",
//   "id": 150,
//   "tokenId": 1,
//   "symbol": "BTCUSDT",
//   "volume24h": 14944578378.57,
//   "openInterestUsdt": 7575004389.0186,
//   "lastFundingRate": -0.00003199,
//   "basisPercent": 0.0006,
//   "basis": 58.19,
//   "markPrice": 93032.3,
//   "dataSource": "Binance",
//   "updatedOrder": null
// }
