import http from '..'
import { ILoginRes } from './types'

export async function getLoginSignMessage() {
  const res = await http.post<{ data: string }>({
    url: '/customer/info'
  })
  if (res.code === 0) {
    return res.data.data
  }
  throw res.msg
}

export async function doLogin(address: string, signData: string) {
  const res = await http.post<ILoginRes>({
    url: '/customer/login',
    data: { address, signData }
  })
  if (res.code === 0) {
    return res.data
  }
  throw res.msg
}
