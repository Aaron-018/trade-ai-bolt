import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import storage from '@/utils/storage'

import en from './lang/en.json'
import cn from './lang/cn.json'

const resources = {
  en,
  cn
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  })

function initLocalLanguage() {
  const localeLang = storage.get('lang')
  const lang = localeLang || 'en'
  i18n.changeLanguage(lang)
}

initLocalLanguage()

export const changeLanguage = (lang: string) => {
  i18n.changeLanguage(lang)
}

export default i18n
