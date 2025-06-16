import { toast as toastify, ToastOptions } from 'react-toastify'

const Default_Message = 'Network Error'
const handleErrorMsg = (e: any) => {
  if (!e) return Default_Message
  if (e?.message && e.message.includes('Insufficient')) {
    return 'Insufficient balance'
  }
  if (e.message) return e.message
  return e
}

const toast = {
  success(text: string, options?: ToastOptions) {
    toastify.success(text, options)
  },
  error(text: any, options?: ToastOptions) {
    const _text = handleErrorMsg(text)
    toastify.error(_text, options)
  },
  info(text: string, options?: ToastOptions) {
    toastify.info(text, options)
  }
}

export default toast
