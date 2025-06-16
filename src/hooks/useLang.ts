import storage from '@/utils/storage'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const langConfig = {
  en: 'English',
  cn: '繁體中文'
}

type LangKey = keyof typeof langConfig

export default function useLang() {
  const { i18n } = useTranslation()
  const [currentLng, setCurrentLng] = useState<LangKey>(i18n.language as LangKey)
  
  function changeLang(key: LangKey) {
    i18n.changeLanguage(key)
    setCurrentLng(key)
    storage.set('lang', key)
  }
  return {
    currentLng,
    langConfig,
    changeLang
  }
}
