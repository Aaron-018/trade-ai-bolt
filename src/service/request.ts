import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'

interface PendingTask {
  config: AxiosRequestConfig
  resolve: Function
}

let axiosInstance: AxiosInstance


type IRes<T> = {
  code: number
  data: T
  msg: string
}

class Request {
  instance: AxiosInstance

  constructor(props?: AxiosRequestConfig) {
    axiosInstance = axios.create(props)
    this.instance = axiosInstance
    this.setInterceptors()
  }

  setInterceptors() {
    this.instance.interceptors.request.use(config => {

      config.headers = Object.assign(config.headers, {
        //
      })
      return config
    })

    this.instance.interceptors.response.use(
      async response => {
        const { data, config } = response
        return data
      },
      error => {
        const { config } = error
        return {
          code: -1,
          msg: error.message
        }
      }
    )
  }

  request<T>(config: AxiosRequestConfig): Promise<IRes<T>> {
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
