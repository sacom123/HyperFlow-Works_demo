import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
// import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import {
  MenuOutlined,
  CloseOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons'
import LanguageSelector from '../components/LanguageSelector'
import SettingsModal from '../components/SettingsModal'
import './KnowledgeBase.css'
import headerLogo from '../assets/images/header-logo.avif'
import formIcon from '../assets/images/form-icon.svg'
import apiIcon from '../assets/images/api-icon.svg'
import libraryIcon from '../assets/images/library-icon.svg'
import lightbulbIcon from '../assets/images/lightbulb-icon.svg'
import chevronRightIcon from '../assets/images/chevron-right.svg'
import settingIcon from '../assets/images/setting-icon.svg'
import BellIcon from '../assets/images/bell-icon.svg'

const KnowledgeBase = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('Favorites')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)

  // 반응형 브레이크포인트 설정 (Figma 기준: 1440x810) - 현재 사용되지 않음
  // const isMobile = useMediaQuery({ maxWidth: 767 })
  // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 })
  // const isFHD = useMediaQuery({ minWidth: 1025, maxWidth: 1920 })
  // const isQHD = useMediaQuery({ minWidth: 1921, maxWidth: 2560 })
  // const isUHD = useMediaQuery({ minWidth: 2561 })

  // 반응형 값 계산 함수 - 현재 사용되지 않음
  // const getResponsiveValue = <T,>(
  //   mobile: T,
  //   tablet: T,
  //   fhd: T,
  //   qhd: T,
  //   uhd: T
  // ): T => {
  //   if (isMobile) return mobile
  //   if (isTablet) return tablet
  //   if (isFHD) return fhd
  //   if (isQHD) return qhd
  //   if (isUHD) return uhd
  //   return fhd
  // }

  // 모바일에서 사이드바 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  const handleMenuClick = (menu: string) => {
    if (menu === 'Hyper Chat') {
      navigate('/dashboard')
    } else if (menu === 'Hyper Agent') {
      navigate('/hyper-agents')
    } else if (menu === 'Library') {
      navigate('/library')
    } else if (menu === 'Knowledge bases') {
      navigate('/knowledge-base')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      console.log('File selected:', e.target.files[0])
      // 파일 업로드 로직 구현
    }
  }

  return (
    <div className="knowledge-base-page">
      {/* 우측 상단 Header - Premium 버튼 + 사용자 아바타 */}
      <div className="knowledge-base-top-header">
        <button className="knowledge-base-premium-btn">
          <span className="knowledge-base-premium-text">Premium</span>
        </button>
        <div className="knowledge-base-user-avatar">
          <span className="knowledge-base-user-initial">H</span>
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button 
        className="knowledge-base-mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="knowledge-base-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SideBar */}
      <div className={`knowledge-base-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="knowledge-base-sidebar-background"></div>
        
        {/* Header - 사이드바 내부 상단 */}
        <div className="knowledge-base-sidebar-header">
          <img src={headerLogo} alt="HyperFlow" className="knowledge-base-header-logo" />
          <div className="knowledge-base-header-actions">
            <button className="knowledge-base-header-action-btn" title="Notifications">
              <img src={BellIcon} alt="Notifications" className="knowledge-base-header-icon" />
            </button>
            <button 
              className="knowledge-base-header-action-btn" 
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="knowledge-base-header-icon">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 메뉴 배경 (Active 상태) - Knowledge bases가 네 번째 메뉴 아이템 */}
        <div className="knowledge-base-menu-background"></div>

        {/* Main Content Section - 메뉴와 필터를 포함 */}
        <div className="knowledge-base-sidebar-main-content">
          {/* 메뉴 */}
          <div className="knowledge-base-menu-section">
            <div className="knowledge-base-menu-item" onClick={() => handleMenuClick('Hyper Chat')}>
              <img src={formIcon} alt="Form" className="knowledge-base-menu-icon" />
              <span>{t('dashboard.menu.hyperChat', 'Hyper Chat')}</span>
            </div>
            <div className="knowledge-base-menu-item" onClick={() => handleMenuClick('Hyper Agent')}>
              <img src={apiIcon} alt="API" className="knowledge-base-menu-icon" />
              <span>{t('dashboard.menu.hyperAgent', 'Hyper Agent')}</span>
            </div>
            <div className="knowledge-base-menu-item" onClick={() => handleMenuClick('Library')}>
              <img src={libraryIcon} alt="Library" className="knowledge-base-menu-icon knowledge-base-menu-icon-library" />
              <span>{t('dashboard.menu.library', 'Library')}</span>
            </div>
            {/* Knowledge bases 메뉴 */}
            <div className="knowledge-base-menu-item active knowledge-base-menu-item-knowledge" onClick={() => handleMenuClick('Knowledge bases')}>
              <img src={lightbulbIcon} alt="Knowledge bases" className="knowledge-base-menu-icon knowledge-base-menu-icon-lightbulb" />
              <span>{t('dashboard.menu.knowledgeBases', 'Knowledge bases')}</span>
            </div>
          </div>

          {/* Knowledge Bases Section - 필터와 빈 상태 */}
          <div className="knowledge-base-knowledge-bases-section">
            {/* 필터 */}
            <div className="knowledge-base-filter-section">
              <div
                className={`knowledge-base-filter-tab ${selectedFilter === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('All')}
              >
                {t('dashboard.filter.all', 'All')}
              </div>
              <div
                className={`knowledge-base-filter-tab ${selectedFilter === 'Favorites' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('Favorites')}
              >
                {t('dashboard.filter.favorites', 'Favorites')}
              </div>
            </div>

            {/* Knowledge Bases Empty State - All 또는 Favorites 선택 시 표시 */}
            {(selectedFilter === 'All' || selectedFilter === 'Favorites') && (
              <div className="knowledge-base-knowledge-empty-state">
                {t('dashboard.emptyState', '사례(case)없음')}
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="knowledge-base-sidebar-footer">
          {/* 구분선 */}
          <div className="knowledge-base-sidebar-divider"></div>

          {/* Share 배너 */}
          <div className="knowledge-base-share-banner">
            <div className="knowledge-base-share-content">
              <div className="knowledge-base-share-title">
                {t('dashboard.share.title', 'Share HyperFlow with a Team')}
              </div>
              <div className="knowledge-base-share-subtitle">
                {t('dashboard.share.subtitle', 'Receive 500 Credits')}
              </div>
            </div>
            <img src={chevronRightIcon} alt="Arrow" className="knowledge-base-share-arrow" />
          </div>

          {/* Setting */}
          <button className="knowledge-base-setting-btn" onClick={() => setSettingsModalOpen(true)}>
            <img src={settingIcon} alt="Settings" className="knowledge-base-setting-icon" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`knowledge-base-main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Title and Description Section - Figma: x: 318, y: 110 */}
        <div className="knowledge-base-title-section">
          <h1 className="knowledge-base-title">{t('knowledgeBase.title', 'Knowledge Base')}</h1>
          <p className="knowledge-base-description">
            {t('knowledgeBase.description', 'HyperFlow manages and modifies the knowledge DB to provide optimized answers according to user needs and preferences, and supports RAG functionality.')}
          </p>
        </div>

        {/* Container - Figma: x: 282, y: 96, width: 1109, height: 624 */}
        <div className="knowledge-base-container">
          {/* Upload Area - Figma: x: 775, y: 351, width: 89, height: 89 */}
          <div className="knowledge-base-upload-area">
            <input
              type="file"
              id="knowledge-base-file-upload"
              className="knowledge-base-file-input"
              onChange={handleFileUpload}
              multiple
            />
            <label htmlFor="knowledge-base-file-upload" className="knowledge-base-upload-button">
              <ArrowUpOutlined className="knowledge-base-upload-icon" />
            </label>
            <p className="knowledge-base-upload-text">
              {t('knowledgeBase.uploadText', 'Please select a file to upload')}
            </p>
          </div>

          {/* ShareAlt Icon - Figma: x: 1081.5, y: 153 */}
          <div className="knowledge-base-share-icon">
            <svg width="18.75" height="18.75" viewBox="0 0 18.75 18.75" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.125 12.1875C12.8438 12.1875 12.6094 12.2812 12.4219 12.4688L7.96875 9.84375C7.98438 9.70312 8.01562 9.5625 8.01562 9.42188C8.01562 9.28125 7.98438 9.14062 7.96875 9L12.4219 6.375C12.6094 6.5625 12.8438 6.65625 13.125 6.65625C13.7812 6.65625 14.2969 6.14062 14.2969 5.48438C14.2969 4.82812 13.7812 4.3125 13.125 4.3125C12.4688 4.3125 11.9531 4.82812 11.9531 5.48438C11.9531 5.625 11.9844 5.76562 12 5.90625L7.54688 8.53125C7.35938 8.34375 7.125 8.25 6.84375 8.25C6.1875 8.25 5.67188 8.76562 5.67188 9.42188C5.67188 10.0781 6.1875 10.5938 6.84375 10.5938C7.125 10.5938 7.35938 10.5 7.54688 10.3125L12 12.9375C11.9844 13.0781 11.9531 13.2188 11.9531 13.3594C11.9531 14.0156 12.4688 14.5312 13.125 14.5312C13.7812 14.5312 14.2969 14.0156 14.2969 13.3594C14.2969 12.7031 13.7812 12.1875 13.125 12.1875Z" fill="#737373"/>
            </svg>
          </div>
        </div>
      </div>

      <LanguageSelector />

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </div>
  )
}

export default KnowledgeBase

