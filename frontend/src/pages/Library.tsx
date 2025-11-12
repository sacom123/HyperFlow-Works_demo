import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
// import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import {
  MenuOutlined,
  CloseOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import LanguageSelector from '../components/LanguageSelector'
import SettingsModal from '../components/SettingsModal'
import './Library.css'
import headerLogo from '../assets/images/header-logo.avif'
import formIcon from '../assets/images/form-icon.svg'
import apiIcon from '../assets/images/api-icon.svg'
import libraryIcon from '../assets/images/library-icon.svg'
import lightbulbIcon from '../assets/images/lightbulb-icon.svg'
import chevronRightIcon from '../assets/images/chevron-right.svg'
import settingIcon from '../assets/images/setting-icon.svg'
import BellIcon from '../assets/images/bell-icon.svg'

const Library = () => {
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

  return (
    <div className="library-page">
      {/* 우측 상단 Header - Premium 버튼 + 사용자 아바타 */}
      <div className="library-top-header">
        <button className="library-premium-btn">
          <span className="library-premium-text">Premium</span>
        </button>
        <div className="library-user-avatar">
          <span className="library-user-initial">H</span>
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button 
        className="library-mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="library-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SideBar */}
      <div className={`library-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="library-sidebar-background"></div>
        
        {/* Header - 사이드바 내부 상단 */}
        <div className="library-sidebar-header">
          <img src={headerLogo} alt="HyperFlow" className="library-header-logo" />
          <div className="library-header-actions">
            <button className="library-header-action-btn" title="Notifications">
              <img src={BellIcon} alt="Notifications" className="library-header-icon" />
            </button>
            <button 
              className="library-header-action-btn" 
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="library-header-icon">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 메뉴 배경 (Active 상태) - Library가 세 번째 메뉴 아이템 */}
        <div className="library-menu-background"></div>

        {/* Main Content Section - 메뉴와 필터를 포함 */}
        <div className="library-sidebar-main-content">
          {/* 메뉴 */}
          <div className="library-menu-section">
            <div className="library-menu-item" onClick={() => handleMenuClick('Hyper Chat')}>
              <img src={formIcon} alt="Form" className="library-menu-icon" />
              <span>{t('dashboard.menu.hyperChat', 'Hyper Chat')}</span>
            </div>
            <div className="library-menu-item" onClick={() => handleMenuClick('Hyper Agent')}>
              <img src={apiIcon} alt="API" className="library-menu-icon" />
              <span>{t('dashboard.menu.hyperAgent', 'Hyper Agent')}</span>
            </div>
            <div className="library-menu-item active" onClick={() => handleMenuClick('Library')}>
              <img src={libraryIcon} alt="Library" className="library-menu-icon library-menu-icon-library" />
              <span>{t('dashboard.menu.library', 'Library')}</span>
            </div>
            {/* Knowledge bases 메뉴 */}
            <div className="library-menu-item library-menu-item-knowledge" onClick={() => handleMenuClick('Knowledge bases')}>
              <img src={lightbulbIcon} alt="Knowledge bases" className="library-menu-icon library-menu-icon-lightbulb" />
              <span>{t('dashboard.menu.knowledgeBases', 'Knowledge bases')}</span>
            </div>
          </div>

          {/* Knowledge Bases Section - 필터와 빈 상태 */}
          <div className="library-knowledge-bases-section">
            {/* 필터 */}
            <div className="library-filter-section">
              <div
                className={`library-filter-tab ${selectedFilter === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('All')}
              >
                {t('dashboard.filter.all', 'All')}
              </div>
              <div
                className={`library-filter-tab ${selectedFilter === 'Favorites' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('Favorites')}
              >
                {t('dashboard.filter.favorites', 'Favorites')}
              </div>
            </div>

            {/* Knowledge Bases Empty State - All 또는 Favorites 선택 시 표시 */}
            {(selectedFilter === 'All' || selectedFilter === 'Favorites') && (
              <div className="library-knowledge-empty-state">
                {t('dashboard.emptyState', '사례(case)없음')}
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="library-sidebar-footer">
          {/* 구분선 */}
          <div className="library-sidebar-divider"></div>

          {/* Share 배너 */}
          <div className="library-share-banner">
            <div className="library-share-content">
              <div className="library-share-title">
                {t('dashboard.share.title', 'Share HyperFlow with a Team')}
              </div>
              <div className="library-share-subtitle">
                {t('dashboard.share.subtitle', 'Receive 500 Credits')}
              </div>
            </div>
            <img src={chevronRightIcon} alt="Arrow" className="library-share-arrow" />
          </div>

          {/* Setting */}
          <button className="library-setting-btn" onClick={() => setSettingsModalOpen(true)}>
            <img src={settingIcon} alt="Settings" className="library-setting-icon" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`library-main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Title Section - Figma: x: 289.5, y: 128.25 */}
        <div className="library-title-section">
          <h1 className="library-title">{t('library.title', 'My library')}</h1>
        </div>

        {/* 구분선 - Figma: x: 264.75, y: 297.37 */}
        <div className="library-divider"></div>

        {/* Table Container - Figma: x: 260.25, y: 99.75 */}
        <div className="library-table-container">
          {/* Description - 컨테이너 내부 */}
          <div className="library-description">
            {t('library.description', 'Manage and deploy your chatbots built with agents and flow graphs')}
          </div>

          {/* Table Header */}
          <div className="library-table-header">
            <div className="library-table-header-cell">{t('library.table.name', 'Name')}</div>
            <div className="library-table-header-cell">{t('library.table.memo', 'Memo')}</div>
            <div className="library-table-header-cell">{t('library.table.deploymentDate', 'Deployment Date')}</div>
            <div className="library-table-header-cell">{t('library.table.access', 'Access')}</div>
            <div className="library-table-header-cell">{t('library.table.status', 'Status')}</div>
            <div className="library-table-header-cell">{t('library.table.deploy', 'Deploy')}</div>
          </div>

          {/* Table Body - Empty State */}
          <div className="library-table-body">
            <div className="library-empty-state">
              {t('dashboard.emptyState', '사례(case)없음')}
            </div>
          </div>

          {/* ShareAlt Icon - Figma: x: 1081.5, y: 153 */}
          <div className="library-table-share-icon">
            <svg width="18.75" height="18.75" viewBox="0 0 18.75 18.75" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.125 12.1875C12.8438 12.1875 12.6094 12.2812 12.4219 12.4688L7.96875 9.84375C7.98438 9.70312 8.01562 9.5625 8.01562 9.42188C8.01562 9.28125 7.98438 9.14062 7.96875 9L12.4219 6.375C12.6094 6.5625 12.8438 6.65625 13.125 6.65625C13.7812 6.65625 14.2969 6.14062 14.2969 5.48438C14.2969 4.82812 13.7812 4.3125 13.125 4.3125C12.4688 4.3125 11.9531 4.82812 11.9531 5.48438C11.9531 5.625 11.9844 5.76562 12 5.90625L7.54688 8.53125C7.35938 8.34375 7.125 8.25 6.84375 8.25C6.1875 8.25 5.67188 8.76562 5.67188 9.42188C5.67188 10.0781 6.1875 10.5938 6.84375 10.5938C7.125 10.5938 7.35938 10.5 7.54688 10.3125L12 12.9375C11.9844 13.0781 11.9531 13.2188 11.9531 13.3594C11.9531 14.0156 12.4688 14.5312 13.125 14.5312C13.7812 14.5312 14.2969 14.0156 14.2969 13.3594C14.2969 12.7031 13.7812 12.1875 13.125 12.1875Z" fill="#737373"/>
            </svg>
          </div>
        </div>

        {/* Action Button - Figma: x: 711, y: 622 */}
        <div className="library-action-button-container">
          <button className="library-action-button">
            <span>{t('library.moveToFlowgraph', 'Move to Flowgraph')}</span>
            <ArrowRightOutlined className="library-action-button-icon" />
          </button>
        </div>
      </div>

      <LanguageSelector />

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </div>
  )
}

export default Library

