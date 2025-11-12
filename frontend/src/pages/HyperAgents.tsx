import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
// import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import {
  MenuOutlined,
  CloseOutlined,
} from '@ant-design/icons'
import LanguageSelector from '../components/LanguageSelector'
import SettingsModal from '../components/SettingsModal'
import './HyperAgents.css'
import headerLogo from '../assets/images/header-logo.avif'
import formIcon from '../assets/images/form-icon.svg'
import apiIcon from '../assets/images/api-icon.svg'
import libraryIcon from '../assets/images/library-icon.svg'
import lightbulbIcon from '../assets/images/lightbulb-icon.svg'
import chevronRightIcon from '../assets/images/chevron-right.svg'
import settingIcon from '../assets/images/setting-icon.svg'
import BellIcon from '../assets/images/bell-icon.svg'

const HyperAgents = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('Favorites')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeTab, setActiveTab] = useState('Hyper Agents')
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)

  // 반응형 브레이크포인트 설정 (Figma 기준: 1440x810)
  const isMobile = useMediaQuery({ maxWidth: 767 })
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 })
  const isFHD = useMediaQuery({ minWidth: 1025, maxWidth: 1920 })
  const isQHD = useMediaQuery({ minWidth: 1921, maxWidth: 2560 })
  const isUHD = useMediaQuery({ minWidth: 2561 })

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
    <div className="hyper-agents-page">
      {/* 우측 상단 Header - Premium 버튼 + 사용자 아바타 */}
      <div className="hyper-agents-top-header">
        <button className="hyper-agents-premium-btn">
          <span className="hyper-agents-premium-text">Premium</span>
        </button>
        <div className="hyper-agents-user-avatar">
          <span className="hyper-agents-user-initial">H</span>
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <button 
        className="hyper-agents-mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="hyper-agents-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SideBar */}
      <div className={`hyper-agents-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="hyper-agents-sidebar-background"></div>
        
        {/* Header - 사이드바 내부 상단 */}
        <div className="hyper-agents-sidebar-header">
          <img src={headerLogo} alt="HyperFlow" className="hyper-agents-header-logo" />
          <div className="hyper-agents-header-actions">
            <button className="hyper-agents-header-action-btn" title="Notifications">
              <img src={BellIcon} alt="Notifications" className="hyper-agents-header-icon" />
            </button>
            <button 
              className="hyper-agents-header-action-btn" 
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="hyper-agents-header-icon">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 메뉴 배경 (Active 상태) - Hyper Agent가 active */}
        <div className="hyper-agents-menu-background"></div>

        {/* Main Content Section - 메뉴와 필터를 포함 */}
        <div className="hyper-agents-sidebar-main-content">
          {/* 메뉴 */}
          <div className="hyper-agents-menu-section">
            <div className="hyper-agents-menu-item" onClick={() => handleMenuClick('Hyper Chat')}>
              <img src={formIcon} alt="Form" className="hyper-agents-menu-icon" />
              <span>{t('dashboard.menu.hyperChat', 'Hyper Chat')}</span>
            </div>
            <div className="hyper-agents-menu-item active" onClick={() => handleMenuClick('Hyper Agent')}>
              <img src={apiIcon} alt="API" className="hyper-agents-menu-icon" />
              <span>{t('dashboard.menu.hyperAgent', 'Hyper Agent')}</span>
            </div>
            <div className="hyper-agents-menu-item" onClick={() => handleMenuClick('Library')}>
              <img src={libraryIcon} alt="Library" className="hyper-agents-menu-icon hyper-agents-menu-icon-library" />
              <span>{t('dashboard.menu.library', 'Library')}</span>
            </div>
            {/* Knowledge bases 메뉴 */}
            <div className="hyper-agents-menu-item hyper-agents-menu-item-knowledge" onClick={() => handleMenuClick('Knowledge bases')}>
              <img src={lightbulbIcon} alt="Knowledge bases" className="hyper-agents-menu-icon hyper-agents-menu-icon-lightbulb" />
              <span>{t('dashboard.menu.knowledgeBases', 'Knowledge bases')}</span>
            </div>
          </div>

          {/* Knowledge Bases Section - 필터와 빈 상태 */}
          <div className="hyper-agents-knowledge-bases-section">
            {/* 필터 */}
            <div className="hyper-agents-filter-section">
              <div
                className={`hyper-agents-filter-tab ${selectedFilter === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('All')}
              >
                {t('dashboard.filter.all', 'All')}
              </div>
              <div
                className={`hyper-agents-filter-tab ${selectedFilter === 'Favorites' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('Favorites')}
              >
                {t('dashboard.filter.favorites', 'Favorites')}
              </div>
            </div>

            {/* Knowledge Bases Empty State - All 또는 Favorites 선택 시 표시 */}
            {(selectedFilter === 'All' || selectedFilter === 'Favorites') && (
              <div className="hyper-agents-knowledge-empty-state">
                {t('dashboard.emptyState', '사례(case)없음')}
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="hyper-agents-sidebar-footer">
          {/* 구분선 */}
          <div className="hyper-agents-sidebar-divider"></div>

          {/* Share 배너 */}
          <div className="hyper-agents-share-banner">
            <div className="hyper-agents-share-content">
              <div className="hyper-agents-share-title">
                {t('dashboard.share.title', 'Share HyperFlow with a Team')}
              </div>
              <div className="hyper-agents-share-subtitle">
                {t('dashboard.share.subtitle', 'Receive 500 Credits')}
              </div>
            </div>
            <img src={chevronRightIcon} alt="Arrow" className="hyper-agents-share-arrow" />
          </div>

          {/* Setting */}
          <button className="hyper-agents-setting-btn" onClick={() => setSettingsModalOpen(true)}>
            <img src={settingIcon} alt="Settings" className="hyper-agents-setting-icon" />
          </button>
        </div>
      </div>

      {/* Main Content - Figma: x: 664, y: 96, width: 776px */}
      <div className={`hyper-agents-main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Tabs Section */}
        <div className="hyper-agents-tabs-section">
          <div
            className={`hyper-agents-tab ${activeTab === 'Hyper Agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('Hyper Agents')}
          >
            <span className="hyper-agents-tab-text">{t('dashboard.tabs.hyperAgents', 'Hyper Agents')}</span>
            {activeTab === 'Hyper Agents' && <div className="hyper-agents-tab-underline"></div>}
          </div>
          <div
            className={`hyper-agents-tab ${activeTab === 'Agent I created' ? 'active' : ''}`}
            onClick={() => setActiveTab('Agent I created')}
          >
            <span className="hyper-agents-tab-text">{t('dashboard.tabs.agentICreated', 'Agent I created')}</span>
            {activeTab === 'Agent I created' && <div className="hyper-agents-tab-underline"></div>}
          </div>
        </div>

        {/* Content Area - Empty State */}
        <div className="hyper-agents-content-area">
          <div className="hyper-agents-empty-state">
            {t('dashboard.emptyState', '사례(case)없음')}
          </div>
        </div>
      </div>

      <LanguageSelector />

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </div>
  )
}

export default HyperAgents

