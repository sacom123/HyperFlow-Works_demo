import { useState, useEffect } from 'react'
import { Dropdown, Button } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
import './LanguageSelector.css'

const languages = [
  { code: 'ko', name: '한국어', nativeName: '한국어' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ja', name: '日本語', nativeName: '日本語' },
  { code: 'zh-CN', name: '简体中文', nativeName: '简体中文' },
  { code: 'zh-TW', name: '繁體中文', nativeName: '繁體中文' },
  { code: 'es', name: 'Español', nativeName: 'Español' },
  { code: 'fr', name: 'Français', nativeName: 'Français' },
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano' },
  { code: 'pt', name: 'Português', nativeName: 'Português' },
  { code: 'ru', name: 'Русский', nativeName: 'Русский' },
  { code: 'ar', name: 'العربية', nativeName: 'العربية' },
  { code: 'hi', name: 'हिन्दी', nativeName: 'हिन्दी' },
  { code: 'id', name: 'Bahasa Indonesia', nativeName: 'Bahasa Indonesia' },
  { code: 'th', name: 'ไทย', nativeName: 'ไทย' },
  { code: 'vi', name: 'Tiếng Việt', nativeName: 'Tiếng Việt' },
  { code: 'nl', name: 'Nederlands', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polski', nativeName: 'Polski' },
  { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe' },
  { code: 'sv', name: 'Svenska', nativeName: 'Svenska' },
]

const LanguageSelector = () => {
  const { i18n } = useTranslation()
  const getCurrentLang = () => {
    const langCode = i18n.language || 'ko'
    // zh-CN, zh-TW 같은 하이픈이 있는 언어 코드 처리
    const baseLang = langCode.split('-')[0]
    return languages.find((lang) => lang.code === langCode || lang.code.startsWith(baseLang)) || languages[0]
  }
  const [currentLang, setCurrentLang] = useState(getCurrentLang())

  // 언어 변경 감지
  useEffect(() => {
    const updateLang = () => {
      setCurrentLang(getCurrentLang())
    }
    i18n.on('languageChanged', updateLang)
    return () => {
      i18n.off('languageChanged', updateLang)
    }
  }, [i18n])

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
  }

  const items: MenuProps['items'] = languages.map((lang) => ({
    key: lang.code,
    label: (
      <div
        className={`language-item ${currentLang.code === lang.code ? 'active' : ''}`}
        onClick={() => handleLanguageChange(lang.code)}
      >
        <span className="language-native">{lang.nativeName}</span>
        <span className="language-name">{lang.name}</span>
      </div>
    ),
  }))

  return (
    <div className="language-selector">
      <Dropdown
        menu={{ items }}
        placement="topRight"
        trigger={['click']}
        overlayClassName="language-dropdown-menu"
      >
        <Button
          type="text"
          icon={<GlobalOutlined />}
          className="language-button"
          title={currentLang.nativeName}
        >
          <span className="language-code">{currentLang.code.toUpperCase()}</span>
        </Button>
      </Dropdown>
    </div>
  )
}

export default LanguageSelector

