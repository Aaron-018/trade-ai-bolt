import Request from './request'
import config from '../config'

const http = new Request({
  baseURL: config.baseUrl
  // timeout: config.timeout
})

export default http
