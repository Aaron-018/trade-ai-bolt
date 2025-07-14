import React, { FC, ReactElement } from 'react'
import copy from 'copy-to-clipboard'
import toast from '@/utils/toast'
import { useTranslation } from 'react-i18next'

export interface CopyToClipboardProps {
  text: string
  successText?: string
  children: ReactElement
  onCopy?: (text: string, result: boolean) => void
  options?: {
    // copy-to-clipboard
    debug?: boolean
    message?: string
    format?: string
  }
}

const CopyToClipboard: FC<CopyToClipboardProps> = props => {
  const { t } = useTranslation('Public')
  const { text, successText, children, onCopy, options } = props

  const elem = React.Children.only(children)

  function onClick(event: MouseEvent) {
    const elem = React.Children.only(children)
    const result = copy(text, options)

    if (onCopy) {
      onCopy(text, result)
    } else {
      toast.success(successText || t('Copied'))
    }

    if (typeof elem?.props.onClick === 'function') {
      elem.props.onClick(event)
    }
  }

  return React.cloneElement(elem, { onClick })
}

export default CopyToClipboard
