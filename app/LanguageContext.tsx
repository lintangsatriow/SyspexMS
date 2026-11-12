"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'EN' | 'ID'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('EN')

  // Load pilihan bahasa dari LocalStorage saat web pertama kali dibuka
  useEffect(() => {
    const saved = localStorage.getItem('syspex_lang') as Language
    if (saved) {
      setLang(saved)
    }
  }, [])

  // Simpan pilihan ke LocalStorage setiap kali diubah
  const handleSetLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem('syspex_lang', newLang)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
