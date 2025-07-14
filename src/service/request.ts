import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import toast from '@/utils/toast'
import storage from '@/utils/storage'

let axiosInstance: AxiosInstance

type IRes<T> = {
  code: number
  data: T
  msg: string
}

let isToastShown = false
let globalAbortController: AbortController | null = null
class Request {
  instance: AxiosInstance

  constructor(props?: AxiosRequestConfig) {
    axiosInstance = axios.create(props)
    this.instance = axiosInstance
    this.setInterceptors()
  }

  setInterceptors() {
    this.instance.interceptors.request.use(config => {
      const userInfo = storage.get('userInfo') || {}
      const uuid = Object.values(userInfo)[0] || ''
      config.headers = Object.assign(config.headers, {
        Authorization: `Bearer ${uuid}`
      })
      return config
    })

    this.instance.interceptors.response.use(
      async response => {
        const { data } = response
        // console.log(response, '234')
        // if (data.code === 501) {
        //   if (!isToastShown) {
        //     isToastShown = true
        //     // toastError(response.data.msg)
        //     if (globalAbortController) {
        //       globalAbortController.abort()
        //       globalAbortController = null
        //     }
        //     toast.error('Token invalid, please login again')
        //     disconnectHandle()
        //     setTimeout(() => {
        //       isToastShown = false
        //     }, 2000)
        //   }
        // }
        return data
      },
      error => {
        const {
          response: { data }
        } = error
        // console.log(data, 234, error)
        if (data?.code === 501) {
          if (!isToastShown) {
            isToastShown = true
            // toastError(response.data.msg)
            if (globalAbortController) {
              globalAbortController.abort()
              globalAbortController = null
            }
            toast.error('Token invalid, please login again')
            disconnectHandle?.()
            setTimeout(() => {
              isToastShown = false
            }, 2000)
          }
        }
        return {
          code: -1,
          msg: error.message
        }
      }
    )
  }

  request<T>(config: AxiosRequestConfig): Promise<IRes<T>> {
    if (!globalAbortController) {
      globalAbortController = new AbortController()
    }
    config.signal = globalAbortController.signal
    return new Promise((resolve, reject) => {
      this.instance
        .request<any, IRes<T>>(config)
        .then(res => {
          resolve(res)
        })
        .catch(error => {
          reject(error)
        })
        .finally(() => {
          //
        })
    })
  }

  get<T = any>(config: AxiosRequestConfig): Promise<IRes<T>> {
    return this.request<T>({ ...config, method: 'GET' })
  }

  post<T = any>(config: AxiosRequestConfig): Promise<IRes<T>> {
    const headers = { ...config.headers }
    return this.request<T>({ ...config, method: 'POST', headers })
    // return this.request<T>({ ...config, method: 'POST' });
  }

  put<T = any>(config: AxiosRequestConfig): Promise<IRes<T>> {
    return this.request<T>({ ...config, method: 'PUT' })
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<IRes<T>> {
    return this.request<T>({ ...config, method: 'DELETE' })
  }
}

export default Request

let disconnectHandle: () => void

export const setDisconnectHandle = (fn: () => void) => {
  disconnectHandle = fn
}
