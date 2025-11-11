import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CloseOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import './SettingsModal.css'
import settingsLogo from '../assets/images/settings-logo.avif'
import settingIcon from '../assets/images/setting-icon.svg'

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

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { t, i18n } = useTranslation()
  const [selectedMode, setSelectedMode] = useState<'light' | 'dark'>('dark')
  const [activeSidebarItem, setActiveSidebarItem] = useState('Settings')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const getCurrentLang = () => {
    const langCode = i18n.language || 'en'
    const baseLang = langCode.split('-')[0]
    return languages.find((lang) => lang.code === langCode || lang.code.startsWith(baseLang)) || languages[1]
  }

  const [currentLang, setCurrentLang] = useState(getCurrentLang())

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
    setCurrentLang(languages.find((lang) => lang.code === langCode) || languages[1])
  }

  const languageItems: MenuProps['items'] = languages.map((lang) => ({
    key: lang.code,
    label: (
      <div
        className={`settings-language-item ${currentLang.code === lang.code ? 'active' : ''}`}
        onClick={() => handleLanguageChange(lang.code)}
      >
        {lang.nativeName}
      </div>
    ),
  }))

  if (!isOpen) return null

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Left Sidebar */}
        <div className="settings-modal-sidebar">
          <div className="settings-modal-sidebar-header">
            <img src={settingsLogo} alt="HyperFlow" className="settings-modal-logo" />
          </div>

          <div className="settings-modal-sidebar-menu">
            <div
              className={`settings-modal-sidebar-item ${activeSidebarItem === 'Settings' ? 'active' : ''}`}
              onClick={() => setActiveSidebarItem('Settings')}
            >
              <img src={settingIcon} alt="Settings" className="settings-modal-sidebar-icon" />
              <span>{t('settings.sidebar.settings', 'Settings')}</span>
            </div>
            <div
              className={`settings-modal-sidebar-item ${activeSidebarItem === 'Usage' ? 'active' : ''}`}
              onClick={() => setActiveSidebarItem('Usage')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="settings-modal-sidebar-icon">
                <path d="M8 1V3M8 13V15M3 8H1M15 8H13M4.34315 4.34315L5.75736 5.75736M10.2426 10.2426L11.6569 11.6569M4.34315 11.6569L5.75736 10.2426M10.2426 5.75736L11.6569 4.34315" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span>{t('settings.sidebar.usage', 'Usage')}</span>
            </div>
            <div
              className={`settings-modal-sidebar-item ${activeSidebarItem === 'Connectors' ? 'active' : ''}`}
              onClick={() => setActiveSidebarItem('Connectors')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="settings-modal-sidebar-icon">
                <path d="M4 6L8 2L12 6M4 10L8 14L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{t('settings.sidebar.connectors', 'Connectors')}</span>
            </div>
            <div className="settings-modal-sidebar-divider"></div>
            <div
              className={`settings-modal-sidebar-item ${activeSidebarItem === 'Get help' ? 'active' : ''}`}
              onClick={() => setActiveSidebarItem('Get help')}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="settings-modal-sidebar-icon">
                <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 11.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6.5H8.005" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{t('settings.sidebar.getHelp', 'Get help')}</span>
            </div>
          </div>

          <div className="settings-modal-sidebar-footer">
            <button className="settings-modal-go-to-button">
              <span>{t('settings.goToHyperFlow', 'Go to HyperFlow')}</span>
              <ArrowRightOutlined className="settings-modal-go-to-icon" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="settings-modal-main">
          <div className="settings-modal-header">
            <h1 className="settings-modal-title">{t('settings.title', 'Settings')}</h1>
            <button className="settings-modal-close-btn" onClick={onClose} aria-label="Close settings">
              <CloseOutlined />
            </button>
          </div>

          <div className="settings-modal-divider"></div>

          <div className="settings-modal-content">
            {/* Language Section */}
            <div className="settings-modal-section">
              <label className="settings-modal-label">{t('settings.language', 'Language')}</label>
              <Dropdown
                menu={{ items: languageItems }}
                placement="bottomLeft"
                trigger={['click']}
                overlayClassName="settings-language-dropdown"
              >
                <button className="settings-modal-language-button">
                  <span>{currentLang.nativeName}</span>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="settings-modal-chevron">
                    <path d="M6.75 4.5L11.25 9L6.75 13.5" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </Dropdown>
            </div>

            {/* Mode Section */}
            <div className="settings-modal-section">
              <label className="settings-modal-label">{t('settings.mode', 'Mode')}</label>
              <div className="settings-modal-mode-buttons">
                <button
                  className={`settings-modal-mode-button ${selectedMode === 'light' ? 'active' : ''}`}
                  onClick={() => setSelectedMode('light')}
                >
                  {t('settings.mode.light', 'Light')}
                </button>
                <button
                  className={`settings-modal-mode-button ${selectedMode === 'dark' ? 'active' : ''}`}
                  onClick={() => setSelectedMode('dark')}
                >
                  {t('settings.mode.dark', 'Dark')}
                </button>
              </div>
            </div>

            {/* Manage Cookies Section */}
            <div className="settings-modal-section">
              <div className="settings-modal-cookies-section">
                <label className="settings-modal-label">{t('settings.manageCookies', 'Manage Cookies')}</label>
                <button className="settings-modal-manage-button">
                  {t('settings.manage', 'Manage')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal

