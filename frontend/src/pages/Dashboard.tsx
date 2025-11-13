import { useState, useEffect } from 'react'
import {
  PaperClipOutlined,
  PictureOutlined,
  VideoCameraOutlined,
  SoundOutlined,
  MenuOutlined,
  CloseOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons'
// import type { MenuProps } from 'antd'
import { useTranslation } from 'react-i18next'
// import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom'
import LanguageSelector from '../components/LanguageSelector'
import SettingsModal from '../components/SettingsModal'
import './Dashboard.css'
import headerLogo from '../assets/images/header-logo.avif'
import formIcon from '../assets/images/form-icon.svg'
import apiIcon from '../assets/images/api-icon.svg'
import libraryIcon from '../assets/images/library-icon.svg'
import lightbulbIcon from '../assets/images/lightbulb-icon.svg'
import chevronRightIcon from '../assets/images/chevron-right.svg'
import settingIcon from '../assets/images/setting-icon.svg'
import BellIcon from '../assets/images/bell-icon.svg'

const Dashboard = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [selectedFilter, setSelectedFilter] = useState('Favorites')
  const [message, setMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)

  // Responsive breakpoint settings (Figma: 1440x810) - Currently unused / 반응형 브레이크포인트 설정 (Figma 기준: 1440x810) - 현재 사용되지 않음
  // const isMobile = useMediaQuery({ maxWidth: 767 })
  // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 })
  // const isFHD = useMediaQuery({ minWidth: 1025, maxWidth: 1920 })
  // const isQHD = useMediaQuery({ minWidth: 1921, maxWidth: 2560 })
  // const isUHD = useMediaQuery({ minWidth: 2561 })

  // const modelMenuItems: MenuProps['items'] = [
  //   { key: 'gpt-4o', label: 'GPT 4o' },
  //   { key: 'gpt-4', label: 'GPT 4' },
  //   { key: 'claude', label: 'Claude' },
  // ]

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

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
    <div className="dashboard-page">
      {/* Top Header - Premium button + User avatar / 우측 상단 Header - Premium 버튼 + 사용자 아바타 */}
      <div className="dashboard-top-header">
        <button className="dashboard-premium-btn">
          <span className="dashboard-premium-text">Premium</span>
        </button>
        <div className="dashboard-user-avatar">
          <span className="dashboard-user-initial">H</span>
        </div>
      </div>

      {/* Mobile Menu Toggle Button / 모바일 메뉴 토글 버튼 */}
      <button 
        className="dashboard-mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        {sidebarOpen ? <CloseOutlined /> : <MenuOutlined />}
      </button>

      {/* Mobile Overlay / 모바일 오버레이 */}
      {sidebarOpen && (
        <div 
          className="dashboard-mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SideBar / 사이드바 */}
      <div className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="dashboard-sidebar-background"></div>
        
        {/* Sidebar Header / 사이드바 내부 상단 */}
        <div className="dashboard-sidebar-header">
          <img src={headerLogo} alt="HyperFlow" className="dashboard-header-logo" />
          <div className="dashboard-header-actions">
            <button className="dashboard-header-action-btn" title="Notifications">
              <img src={BellIcon} alt="Notifications" className="dashboard-header-icon" />
            </button>
            <button 
              className="dashboard-header-action-btn" 
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="dashboard-header-icon">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Menu background (Active state) / 메뉴 배경 (Active 상태) */}
        <div className="dashboard-menu-background"></div>

        {/* Main Content Section / 메뉴와 필터를 포함 */}
        <div className="dashboard-sidebar-main-content">
          {/* Menu / 메뉴 */}
          <div className="dashboard-menu-section">
            <div className="dashboard-menu-item active" onClick={() => handleMenuClick('Hyper Chat')}>
              <img src={formIcon} alt="Form" className="dashboard-menu-icon" />
              <span>{t('dashboard.menu.hyperChat', 'Hyper Chat')}</span>
            </div>
            <div className="dashboard-menu-item" onClick={() => handleMenuClick('Hyper Agent')}>
              <img src={apiIcon} alt="API" className="dashboard-menu-icon" />
              <span>{t('dashboard.menu.hyperAgent', 'Hyper Agent')}</span>
            </div>
            <div className="dashboard-menu-item" onClick={() => handleMenuClick('Library')}>
              <img src={libraryIcon} alt="Library" className="dashboard-menu-icon dashboard-menu-icon-library" />
              <span>{t('dashboard.menu.library', 'Library')}</span>
            </div>
            {/* Knowledge bases menu / Knowledge bases 메뉴 */}
            <div className="dashboard-menu-item dashboard-menu-item-knowledge" onClick={() => handleMenuClick('Knowledge bases')}>
              <img src={lightbulbIcon} alt="Knowledge bases" className="dashboard-menu-icon dashboard-menu-icon-lightbulb" />
              <span>{t('dashboard.menu.knowledgeBases', 'Knowledge bases')}</span>
            </div>
          </div>

          {/* Knowledge Bases Section / 필터와 빈 상태 */}
          <div className="dashboard-knowledge-bases-section">
            {/* Filter / 필터 */}
            <div className="dashboard-filter-section">
              <div
                className={`dashboard-filter-tab ${selectedFilter === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('All')}
              >
                {t('dashboard.filter.all', 'All')}
              </div>
              <div
                className={`dashboard-filter-tab ${selectedFilter === 'Favorites' ? 'active' : ''}`}
                onClick={() => setSelectedFilter('Favorites')}
              >
                {t('dashboard.filter.favorites', 'Favorites')}
              </div>
            </div>

            {/* Knowledge Bases Empty State / All 또는 Favorites 선택 시 표시 */}
            {(selectedFilter === 'All' || selectedFilter === 'Favorites') && (
              <div className="dashboard-knowledge-empty-state">
                {t('dashboard.emptyState', '사례(case)없음')}
              </div>
            )}
          </div>
        </div>

        {/* Footer Section / 푸터 섹션 */}
        <div className="dashboard-sidebar-footer">
          {/* Divider / 구분선 */}
          <div className="dashboard-sidebar-divider"></div>

          {/* Share Banner / Share 배너 */}
          <div className="dashboard-share-banner">
            <div className="dashboard-share-content">
              <div className="dashboard-share-title">
                {t('dashboard.share.title', 'Share HyperFlow with a Team')}
              </div>
              <div className="dashboard-share-subtitle">
                {t('dashboard.share.subtitle', 'Receive 500 Credits')}
              </div>
            </div>
            <img src={chevronRightIcon} alt="Arrow" className="dashboard-share-arrow" />
          </div>

          {/* Setting / 설정 */}
          <button className="dashboard-setting-btn" onClick={() => setSettingsModalOpen(true)}>
            <img src={settingIcon} alt="Settings" className="dashboard-setting-icon" />
          </button>
        </div>
      </div>

      {/* Main Content / 메인 콘텐츠 */}
      <div className={`dashboard-main-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        {/* Input Section / 입력 섹션 */}
        <div className="dashboard-input-section">
          <div className="dashboard-input-title">
            {t('dashboard.input.title', 'How may I help you today?')}
          </div>

          <div className="dashboard-input-container">
            <div className="dashboard-input-text-area">
              <textarea
                placeholder={t('dashboard.input.placeholder', 'How may I help you today?')}
                className="dashboard-input-field"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
              />
            </div>
            <div className="dashboard-input-actions">
              <div className="dashboard-input-tools">
                <button className="dashboard-tool-btn" title="Attach file">
                  <PaperClipOutlined />
                </button>
                <button className="dashboard-tool-btn" title="Attach file">
                  <PaperClipOutlined />
                </button>
                <button className="dashboard-tool-btn" title="Attach file">
                  <PaperClipOutlined />
                </button>
                <button className="dashboard-tool-btn dashboard-code-btn" title="Code block">
                  <span>&lt; / &gt;</span>
                </button>
              </div>
              <div className="dashboard-send-button-wrapper">
                <button
                  className="dashboard-send-btn"
                  onClick={handleSend}
                  disabled={!message.trim()}
                  title="Send message"
                >
                  <ArrowUpOutlined />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Buttons / Media 버튼들 */}
        <div className="dashboard-media-buttons">
          <button 
            className={`dashboard-media-btn ${selectedMedia === 'image' ? 'active' : ''}`}
            onClick={() => setSelectedMedia(selectedMedia === 'image' ? null : 'image')}
          >
            <PictureOutlined className="dashboard-media-icon" />
            <span>{t('dashboard.media.image', 'Image')}</span>
          </button>
          <button 
            className={`dashboard-media-btn ${selectedMedia === 'video' ? 'active' : ''}`}
            onClick={() => setSelectedMedia(selectedMedia === 'video' ? null : 'video')}
          >
            <VideoCameraOutlined className="dashboard-media-icon" />
            <span>{t('dashboard.media.video', 'Video')}</span>
          </button>
          <button 
            className={`dashboard-media-btn ${selectedMedia === 'audio' ? 'active' : ''}`}
            onClick={() => setSelectedMedia(selectedMedia === 'audio' ? null : 'audio')}
          >
            <SoundOutlined className="dashboard-media-icon" />
            <span>{t('dashboard.media.audio', 'Audio')}</span>
          </button>
        </div>
      </div>

      <LanguageSelector />

      {/* Settings Modal */}
      <SettingsModal isOpen={settingsModalOpen} onClose={() => setSettingsModalOpen(false)} />
    </div>
  )
}

export default Dashboard
