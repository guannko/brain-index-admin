import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import ru from '../i18n/ru.json'
import en from '../i18n/en.json'

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    en: { translation: en },
  },
  lng: localStorage.getItem('lang') || 'ru',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

export default i18n
