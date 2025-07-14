import http from '..'
import { ISys } from './types'

export * from './login'
export * from './watchList'
export * from './strategy'
export * from './channel'
export * from './token'

export async function getSysConfig() {
  const result = await http.post<ISys>({
    url: '/sys/info'
  })
  if (result.code === 0) return result.data
  return null
}
