import { useEffect, useState } from 'react'
import { initialLang } from '../data/i18n'

export function useLanguage() {
  const [lang, setLang] = useState(initialLang)
  useEffect(() => {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    try {
      localStorage.setItem('trilha-lang', lang)
    } catch {}
  }, [lang])
  const toggle = () => setLang((l) => (l === 'pt' ? 'en' : 'pt'))
  return [lang, toggle]
}
