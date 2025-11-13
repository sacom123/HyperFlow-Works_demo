/**
 * Home Page Component / 랜딩 페이지 메인 컴포넌트
 * - Fully responsive design based on react-responsive / react-responsive 기반 완전 반응형 디자인
 * - Support for mobile, tablet, desktop, large desktop / 모바일, 태블릿, 데스크톱, 대형 데스크톱 지원
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Row, Col, Card } from 'antd'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import {
  ArrowRightOutlined,
  DragOutlined,
  RobotOutlined,
  PictureOutlined,
  FileSearchOutlined,
  MessageOutlined,
  UserOutlined,
  EditOutlined,
  MenuOutlined,
  RocketOutlined,
  ToolOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
import PricingModal from '../components/PricingModal'
import LanguageSelector from '../components/LanguageSelector'
import './Home.css'

const { Title, Paragraph } = Typography

// Common style for horizontal text display / 텍스트 가로 표시를 위한 공통 스타일
const horizontalTextStyle: React.CSSProperties = {
  writingMode: 'horizontal-tb',
  textOrientation: 'mixed',
  direction: 'ltr',
  unicodeBidi: 'normal',
  whiteSpace: 'normal',
  wordBreak: 'normal',
  textTransform: 'none',
  display: 'block',
  width: '100%',
}

// Calculate responsive value based on device type / 반응형 값 계산 함수
const getResponsiveValue = <T,>(
  mobile: T,
  tablet: T,
  fhd: T,
  qhd: T,
  uhd: T,
  isMobile: boolean,
  isTablet: boolean,
  isFHD: boolean,
  isQHD: boolean,
  isUHD: boolean
): T => {
  if (isMobile) return mobile
  if (isTablet) return tablet
  if (isFHD) return fhd
  if (isQHD) return qhd
  if (isUHD) return uhd
  return fhd // Default value (FHD) / 기본값 (FHD)
}

// LLM model data / LLM 모델 데이터
const LLM_MODELS = [
  { name: 'gpt-5', image: 'llm-gpt-5.avif', width: '104px' },
  { name: 'gemini-2.5-Pro', image: 'llm-gemini-2.5-pro.avif', width: '141px' },
  { name: 'gpt-4o', image: 'llm-gpt-4o.avif', width: '104px' },
  { name: 'deepseek', image: 'llm-deepseek.avif', width: '104px' },
  { name: 'claude-sonnet-4.5', image: 'llm-claude-sonnet-4.5.avif', width: '174px' },
  { name: 'gpt-5-mini', image: 'llm-gpt-5-mini.avif', width: '104px' },
  { name: 'gemini-2.5-Flash', image: 'llm-gemini-2.5-flash.avif', width: '159px' },
  { name: 'gpt-5-nano', image: 'llm-gpt-5-nano.avif', width: '108px' },
  { name: 'gemini-2.0-Flash', image: 'llm-gemini-2.0-flash.avif', width: '159px' },
]

// Feature card data (Based on Figma design - 6 cards) / 기능 카드 데이터 (Figma 디자인 기준 - 6개 카드)
const getFeatureCards = (t: any) => [
  {
    icon: DragOutlined,
    title: t('features.cards.dragDrop.title'),
    description: t('features.cards.dragDrop.description'),
  },
  {
    icon: RobotOutlined,
    title: t('features.cards.ragChatbot.title'),
    description: t('features.cards.ragChatbot.description'),
  },
  {
    icon: PictureOutlined,
    title: t('features.cards.multimodal.title'),
    description: t('features.cards.multimodal.description'),
  },
  {
    icon: RocketOutlined,
    title: t('features.cards.deployment.title'),
    description: t('features.cards.deployment.description'),
  },
  {
    icon: ToolOutlined,
    title: t('features.cards.noCode.title'),
    description: t('features.cards.noCode.description'),
  },
  {
    icon: SafetyOutlined,
    title: t('features.cards.security.title'),
    description: t('features.cards.security.description'),
  },
]

const Home = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const featureCards = getFeatureCards(t)

  // Responsive breakpoint settings / 반응형 브레이크포인트 설정
  const isMobile = useMediaQuery({ maxWidth: 767 }) // Mobile: 767px and below / 모바일: 767px 이하
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 }) // Tablet: 768px ~ 1024px / 태블릿: 768px ~ 1024px
  const isFHD = useMediaQuery({ minWidth: 1025, maxWidth: 1920 }) // FHD: 1025px ~ 1920px / FHD: 1025px ~ 1920px
  const isQHD = useMediaQuery({ minWidth: 1921, maxWidth: 2560 }) // QHD: 1921px ~ 2560px / QHD: 1921px ~ 2560px
  const isUHD = useMediaQuery({ minWidth: 2561 }) // UHD: 2561px and above / UHD: 2561px 이상

  const openPricingModal = () => setIsPricingModalOpen(true)
  const closePricingModal = () => setIsPricingModalOpen(false)

  const handleLogoClick = () => {
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoginClick = () => navigate('/login')
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPricingModalOpen) {
        closePricingModal()
      }
    }

    if (isPricingModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isPricingModalOpen])

  // Calculate responsive values / 반응형 값 계산
  const navPadding = getResponsiveValue(
    '0 20px', // Mobile
    '0 40px', // Tablet
    '0 80px', // FHD
    '0 100px', // QHD
    '0 120px', // UHD
    isMobile,
    isTablet,
    isFHD,
    isQHD,
    isUHD
  )
  const navGap = getResponsiveValue(
    '20px', // Mobile
    '30px', // Tablet
    '40px', // FHD
    '50px', // QHD
    '60px', // UHD
    isMobile,
    isTablet,
    isFHD,
    isQHD,
    isUHD
  )
  const navFontSize = getResponsiveValue(
    '16px', // Mobile
    '16px', // Tablet
    '18px', // FHD
    '20px', // QHD
    '22px', // UHD
    isMobile,
    isTablet,
    isFHD,
    isQHD,
    isUHD
  )
  const navMenuGap = getResponsiveValue(
    '20px', // Mobile
    '30px', // Tablet
    '40px', // FHD
    '50px', // QHD
    '60px', // UHD
    isMobile,
    isTablet,
    isFHD,
    isQHD,
    isUHD
  )

  const heroPadding = getResponsiveValue(
    '80px 20px 100px', // Mobile
    '90px 30px 110px', // Tablet
    '120px 40px 200px', // FHD
    '140px 50px 220px', // QHD
    '160px 60px 240px', // UHD
    isMobile,
    isTablet,
    isFHD,
    isQHD,
    isUHD
  )

  // Responsive grid settings / 반응형 그리드 설정
  const gridColumns = isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'
  const gridGap = isMobile ? '24px' : isTablet ? '20px' : '40px'
  const featuresSectionPadding = isMobile ? '80px 20px' : isTablet ? '120px 40px' : '120px 40px'

  return (
    <div className="landing-page">
      {/* Navigation Bar / 네비게이션 바 */}
      <nav className="navbar">
        <div
          className="nav-container"
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: navPadding,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: navGap,
            width: '100%',
          }}
        >
          <div
            className="nav-logo"
            onClick={handleLogoClick}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <img src="/images/logo.avif" alt="HyperFlow" className="nav-logo-image" />
          </div>

          {/* Mobile Menu / 모바일 메뉴 */}
          {isMobile ? (
            <>
              <Button
                className="nav-mobile-menu-btn"
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ display: 'block' }}
              />
              {isMobileMenuOpen && (
                <div className="nav-mobile-menu">
                  <a
                    href="#product"
                    className="nav-link active"
                    style={horizontalTextStyle}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.product')}
                  </a>
                  <a
                    href="#pricing"
                    className="nav-link"
                    style={horizontalTextStyle}
                    onClick={(e) => {
                      e.preventDefault()
                      openPricingModal()
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    {t('nav.pricing')}
                  </a>
                  <a
                    href="#blog"
                    className="nav-link"
                    style={horizontalTextStyle}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.blog')}
                  </a>
                  <a
                    href="#support"
                    className="nav-link"
                    style={horizontalTextStyle}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.support')}
                  </a>
                  <Button className="nav-login-btn" type="text" onClick={handleLoginClick}>
                    {t('nav.login')}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <>
              <div
                className="nav-menu"
                style={{
                  display: 'flex',
                  gap: navMenuGap,
                  alignItems: 'center',
                  flexShrink: 0,
                }}
              >
                <a
                  href="#product"
                  className="nav-link active"
                  style={{
                    fontSize: navFontSize,
                    padding: '0 4px',
                    minWidth: 'fit-content',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {t('nav.product')}
                </a>
                <a
                  href="#pricing"
                  className="nav-link"
                  style={{
                    fontSize: navFontSize,
                    padding: '0 4px',
                    minWidth: 'fit-content',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    openPricingModal()
                  }}
                >
                  {t('nav.pricing')}
                </a>
                <a
                  href="#blog"
                  className="nav-link"
                  style={{
                    fontSize: navFontSize,
                    padding: '0 4px',
                    minWidth: 'fit-content',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {t('nav.blog')}
                </a>
                <a
                  href="#support"
                  className="nav-link"
                  style={{
                    fontSize: navFontSize,
                    padding: '0 4px',
                    minWidth: 'fit-content',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {t('nav.support')}
                </a>
              </div>
              <Button
                className="nav-login-btn"
                type="text"
                onClick={handleLoginClick}
                style={{
                  minWidth: 'fit-content',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                  fontSize: navFontSize,
                }}
              >
                {t('nav.login')}
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Pricing Modal */}
      <PricingModal open={isPricingModalOpen} onClose={closePricingModal} />

      {/* Hero Section / 메인 콘텐츠 영역 */}
      <section className="hero-section" style={{ padding: heroPadding }}>
        <div className="hero-background">
          <div className="ellipse ellipse-1"></div>
          <div className="ellipse ellipse-2"></div>
          <div className="ellipse ellipse-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-tagline">{t('hero.tagline')}</div>
          <Title level={1} className="hero-title">
            {t('hero.title')
              .split('\n')
              .map((line: string, i: number) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && !isMobile && <br />}
                </React.Fragment>
              ))}
          </Title>
          <Paragraph className="hero-description">
            {t('hero.description')
              .split('\n')
              .map((line: string, i: number) => (
                <React.Fragment key={i}>
                  {line}
                  {i === 0 && !isMobile && <br />}
                </React.Fragment>
              ))}
          </Paragraph>
          <Button
            className="hero-cta-btn"
            type="primary"
            size={isMobile ? 'middle' : 'large'}
            onClick={handleLoginClick}
          >
            {t('hero.cta')}
          </Button>
        </div>
        {!isMobile && (
          <div
            className="hero-artwork"
            style={{
              width: isTablet ? '100%' : 'clamp(40%, 54vw, 60%)',
              transform: isTablet ? 'none' : 'translateX(5%)',
              position: isTablet ? 'relative' : 'absolute',
              right: 0,
              marginTop: isTablet ? '32px' : 0,
            }}
          >
            <img
              src="/images/hero-artwork.svg"
              alt="HyperFlow Artwork"
              className="hero-artwork-image"
            />
          </div>
        )}
      </section>

      {/* Features Intro Section / 기능 소개 섹션 */}
      <section className="features-intro-section">
        <div className="features-intro-wrapper">
          <Paragraph className="features-intro-text">{t('features.intro.text')}</Paragraph>
          <Title level={2} className="features-intro-title">
            {t('features.intro.title')}
          </Title>
        </div>
      </section>

      {/* Features Section / 주요 기능 카드 섹션 */}
      <section className="features-section" style={{ padding: featuresSectionPadding }}>
        <div className="section-header">
          <div className="section-ellipse"></div>
          <Title level={1} className="section-title">
            {t('features.sectionTitle')}
          </Title>
        </div>

        {/* Features Grid / 기능 카드 그리드 레이아웃 */}
        <div
          className="features-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: gridColumns,
            gap: gridGap,
            maxWidth: isMobile
              ? '100%'
              : isTablet
              ? '100%'
              : isFHD
              ? '1233px'
              : isQHD
              ? '1400px'
              : isUHD
              ? '1600px'
              : '1233px',
            margin: '0 auto',
            padding: isMobile ? '0 20px' : isTablet ? '0 20px' : '0 40px',
            position: 'relative',
            zIndex: 1,
            alignItems: 'stretch',
          }}
        >
          {featureCards.map((card, index) => {
            const IconComponent = card.icon
            return (
              <div key={index} className="feature-card-wrapper">
                <div className="feature-card">
                  <div className="feature-icon">
                    <IconComponent />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">{card.title}</h3>
                    <p className="feature-description">{card.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* LLM Support Section / 지원 LLM 목록 섹션 */}
      <section
        className="llm-section"
        style={{
          padding: getResponsiveValue(
            '60px 20px', // Mobile
            '80px 40px', // Tablet
            '103px 133px', // FHD (Figma: padding: 0px 133px, gap: 103px)
            '120px 150px', // QHD
            '140px 160px', // UHD
            isMobile,
            isTablet,
            isFHD,
            isQHD,
            isUHD
          ),
          marginTop: getResponsiveValue(
            '60px', // Mobile
            '80px', // Tablet
            '60px', // FHD
            '70px', // QHD
            '80px', // UHD
            isMobile,
            isTablet,
            isFHD,
            isQHD,
            isUHD
          ),
          marginBottom: getResponsiveValue(
            '60px', // Mobile
            '80px', // Tablet
            '60px', // FHD
            '70px', // QHD
            '80px', // UHD
            isMobile,
            isTablet,
            isFHD,
            isQHD,
            isUHD
          ),
          marginLeft: getResponsiveValue(
            '0', // Mobile
            '0', // Tablet
            'auto', // FHD
            'auto', // QHD
            'auto', // UHD
            isMobile,
            isTablet,
            isFHD,
            isQHD,
            isUHD
          ),
          marginRight: getResponsiveValue(
            '0', // Mobile
            '0', // Tablet
            'auto', // FHD
            'auto', // QHD
            'auto', // UHD
            isMobile,
            isTablet,
            isFHD,
            isQHD,
            isUHD
          ),
          borderRadius: isMobile ? '0' : '10px',
          maxWidth: getResponsiveValue(
            '100%', // Mobile
            '100%', // Tablet
            '1579px', // FHD (Figma: width: 1579)
            '1800px', // QHD
            '2000px', // UHD
            isMobile,
            isTablet,
            isFHD,
            isQHD,
            isUHD
          ),
        }}
      >
        <div className="llm-background"></div>
        <div className="llm-content">
          <Title
            level={1}
            className="llm-title"
            style={{
              fontSize: getResponsiveValue(
                '20px', // Mobile
                '28px', // Tablet
                '32px', // FHD (Figma: fontSize: 32)
                'clamp(32px, 2vw, 40px)', // QHD
                'clamp(40px, 2vw, 48px)', // UHD
                isMobile,
                isTablet,
                isFHD,
                isQHD,
                isUHD
              ),
              marginBottom: getResponsiveValue(
                '30px', // Mobile
                '40px', // Tablet
                '103px', // FHD (Figma: gap: 103px)
                '120px', // QHD
                '140px', // UHD
                isMobile,
                isTablet,
                isFHD,
                isQHD,
                isUHD
              ),
              padding: getResponsiveValue(
                '0 20px', // Mobile
                '0 40px', // Tablet
                '0', // FHD
                '0', // QHD
                '0', // UHD
                isMobile,
                isTablet,
                isFHD,
                isQHD,
                isUHD
              ),
            }}
          >
            {t('llm.title')}
          </Title>
          <div className="llm-models-wrapper">
            <div className="llm-models-track">
              {LLM_MODELS.map((llm, index) => (
                <div
                  key={`first-${llm.name}-${index}`}
                  className="llm-model-card"
                  style={{ width: llm.width }}
                >
                  <div className="llm-model-image">
                    <img src={`/images/${llm.image}`} alt={llm.name} />
                  </div>
                  <div className="llm-model-name">{llm.name}</div>
                </div>
              ))}
              {/* Duplicate set for infinite loop / 무한 루프를 위한 복제 */}
              {LLM_MODELS.map((llm, index) => (
                <div
                  key={`second-${llm.name}-${index}`}
                  className="llm-model-card"
                  style={{ width: llm.width }}
                >
                  <div className="llm-model-image">
                    <img src={`/images/${llm.image}`} alt={llm.name} />
                  </div>
                  <div className="llm-model-name">{llm.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Workflow Section / 고급 워크플로우 기능 섹션 */}
      <section
        className="advanced-workflow-section"
        style={{
          padding: getResponsiveValue(
            '60px 20px', // Mobile
            '80px 40px', // Tablet
            '100px 40px', // FHD
            '120px 50px', // QHD
            '140px 60px', // UHD
            isMobile,
            isTablet,
            isFHD,
            isQHD,
            isUHD
          ),
        }}
      >
        <div className="advanced-workflow-grid">
          <Card className="advanced-workflow-card">
            <div className="advanced-workflow-image">
              <img src="/images/workflow-image-01.avif" alt="순환형 플로우" />
            </div>
            <div className="advanced-workflow-content">
              <Title level={3} className="advanced-workflow-title">
                {t('advancedWorkflow.circularFlow.title')}
              </Title>
              <Paragraph className="advanced-workflow-description">
                {t('advancedWorkflow.circularFlow.description')}
              </Paragraph>
            </div>
          </Card>
          <Card className="advanced-workflow-card">
            <div className="advanced-workflow-image">
              <img src="/images/workflow-image-02.avif" alt="슈퍼노드" />
            </div>
            <div className="advanced-workflow-content">
              <Title level={3} className="advanced-workflow-title">
                {t('advancedWorkflow.superNode.title')}
              </Title>
              <Paragraph className="advanced-workflow-description">
                {t('advancedWorkflow.superNode.description')}
              </Paragraph>
            </div>
          </Card>
          <Card className="advanced-workflow-card">
            <div className="advanced-workflow-image">
              <img src="/images/workflow-image-03.avif" alt="프로세스·데이터 통합" />
            </div>
            <div className="advanced-workflow-content">
              <Title level={3} className="advanced-workflow-title">
                {t('advancedWorkflow.processData.title')}
              </Title>
              <Paragraph className="advanced-workflow-description">
                {t('advancedWorkflow.processData.description')}
              </Paragraph>
            </div>
          </Card>
          <Card className="advanced-workflow-card">
            <div className="advanced-workflow-image">
              <img src="/images/workflow-image-04.avif" alt="이중 실행 엔진" />
            </div>
            <div className="advanced-workflow-content">
              <Title level={3} className="advanced-workflow-title">
                {t('advancedWorkflow.dualEngine.title')}
              </Title>
              <Paragraph className="advanced-workflow-description">
                {t('advancedWorkflow.dualEngine.description')}
              </Paragraph>
            </div>
          </Card>
          <Card className="advanced-workflow-card">
            <div className="advanced-workflow-image">
              <img src="/images/workflow-image-05.avif" alt="통합 자산 스토어" />
            </div>
            <div className="advanced-workflow-content">
              <Title level={3} className="advanced-workflow-title">
                {t('advancedWorkflow.assetStore.title')}
              </Title>
              <Paragraph className="advanced-workflow-description">
                {t('advancedWorkflow.assetStore.description')}
              </Paragraph>
            </div>
          </Card>
        </div>
      </section>

      {/* Super Node Section / 슈퍼노드 소개 섹션 */}
      <section className="supernode-section">
        <div className="supernode-wrapper">
          <Title level={2} className="supernode-section-title">
            {t('superNodeSection.title')}
          </Title>
          <Card className="supernode-card">
            <Title level={2} className="supernode-title">
              {t('superNodeSection.cardTitle')}
            </Title>
            <Paragraph className="supernode-description">
              {t('superNodeSection.cardDescription')}
            </Paragraph>
            <Button className="supernode-btn" type="primary">
              {t('superNodeSection.button')}
              <ArrowRightOutlined />
            </Button>
          </Card>
        </div>
      </section>

      {/* Workflow Section / 시작하기 가이드 섹션 */}
      <section
        className="workflow-section"
        style={{
          padding: getResponsiveValue(
            '60px 20px', // Mobile
            '80px 40px', // Tablet
            '100px 40px', // FHD
            '120px 50px', // QHD
            '140px 60px', // UHD
            isMobile,
            isTablet,
            isFHD,
            isQHD,
            isUHD
          ),
        }}
      >
        <div className="workflow-header">
          <Title level={1} className="workflow-main-title" style={{ color: '#000000' }}>
            {t('workflow.title')}
          </Title>
          <Paragraph className="workflow-subtitle" style={{ color: '#000000' }}>
            {t('workflow.subtitle')}
          </Paragraph>
        </div>
        <div className="workflow-steps">
          <Card className="workflow-step-card">
            <div className="step-icon-circle">
              <div className="step-icon">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.34 1.45L27.32 33.11"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 1.45L18 33.11"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M31.66 1.45L8.68 33.11"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="step-number">01</div>
            <Title level={3} className="step-title">
              {t('workflow.steps.dataConnection.title')}
            </Title>
            <Paragraph className="step-description">
              {t('workflow.steps.dataConnection.description')}
            </Paragraph>
            <div className="step-images step-images-01">
              <div className="step-image step-image-01">
                <img src="/images/workflow-start-step-01-image-01.avif" alt="Data connection 1" />
              </div>
              <div className="step-image step-image-02">
                <img src="/images/workflow-start-step-01-image-02.avif" alt="Data connection 2" />
              </div>
            </div>
          </Card>
          <Card className="workflow-step-card">
            <div className="step-icon-circle">
              <div className="step-icon">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.34 1.45L27.32 33.11"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 1.45L18 33.11"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M31.66 1.45L8.68 33.11"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="step-number">02</div>
            <Title level={3} className="step-title">
              {t('workflow.steps.workflowDesign.title')}
            </Title>
            <Paragraph className="step-description">
              {t('workflow.steps.workflowDesign.description')}
            </Paragraph>
            <div className="step-images step-images-02">
              <div className="step-image step-image-single">
                <img src="/images/workflow-start-step-02-image.avif" alt="Workflow design" />
              </div>
            </div>
          </Card>
          <Card className="workflow-step-card">
            <div className="step-icon-circle">
              <div className="step-icon">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4.34 1.45L27.32 33.11"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18 1.45L18 33.11"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M31.66 1.45L8.68 33.11"
                    stroke="rgba(255, 255, 255, 0.85)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="step-number">03</div>
            <Title level={3} className="step-title">
              {t('workflow.steps.deployManage.title')}
            </Title>
            <Paragraph className="step-description">
              {t('workflow.steps.deployManage.description')}
            </Paragraph>
            <div className="step-images step-images-three">
              <div className="step-image step-image-large">
                <img src="/images/workflow-start-step-03-image-01.avif" alt="Deploy 1" />
              </div>
              <div className="step-image step-image-small-1">
                <img src="/images/workflow-start-step-03-image-02.avif" alt="Deploy 2" />
              </div>
              <div className="step-image step-image-small-2">
                <img src="/images/workflow-start-step-03-image-03.avif" alt="Deploy 3" />
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Templates Section / 템플릿 갤러리 섹션 */}
      <section
        className="templates-section"
        style={{
          padding: getResponsiveValue(
            '60px 20px', // Mobile
            '80px 40px', // Tablet
            '100px 40px', // FHD
            '120px 50px', // QHD
            '140px 60px', // UHD
            isMobile,
            isTablet,
            isFHD,
            isQHD,
            isUHD
          ),
        }}
      >
        <div className="templates-header">
          <Title level={2} className="templates-title">
            {t('templates.title')}
          </Title>
          <Paragraph className="templates-subtitle">{t('templates.subtitle')}</Paragraph>
        </div>
        <Row
          gutter={getResponsiveValue(
            [16, 16] as [number, number], // Mobile
            [20, 20] as [number, number], // Tablet
            [24, 24] as [number, number], // FHD
            [28, 28] as [number, number], // QHD
            [32, 32] as [number, number], // UHD
            isMobile,
            isTablet,
            isFHD,
            isQHD,
            isUHD
          )}
          className="templates-grid"
          align="stretch"
        >
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <Card className="template-card">
              <div className="template-icon">
                <FileSearchOutlined />
              </div>
              <Title level={3} className="template-title" style={horizontalTextStyle}>
                {t('templates.documentSearch.title')}
              </Title>
              <Paragraph className="template-description" style={horizontalTextStyle}>
                {t('templates.documentSearch.description')}
              </Paragraph>
              <div className="template-features">
                <div className="template-feature">
                  {t('templates.documentSearch.features.instantSearch')}
                </div>
                <div className="template-feature">
                  {t('templates.documentSearch.features.knowledgeRef')}
                </div>
                <div className="template-feature">
                  {t('templates.documentSearch.features.fileFormats')}
                </div>
                <div className="template-feature">
                  {t('templates.documentSearch.features.autoSummary')}
                </div>
              </div>
              <Button className="template-button" type="primary">
                {t('templates.documentSearch.button')}
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <Card className="template-card">
              <div className="template-icon">
                <MessageOutlined />
              </div>
              <Title level={3} className="template-title" style={horizontalTextStyle}>
                {t('templates.customerService.title')}
              </Title>
              <Paragraph className="template-description" style={horizontalTextStyle}>
                {t('templates.customerService.description')}
              </Paragraph>
              <div className="template-features">
                <div className="template-feature">
                  {t('templates.customerService.features.autoResponse')}
                </div>
                <div className="template-feature">
                  {t('templates.customerService.features.faqAuto')}
                </div>
                <div className="template-feature">
                  {t('templates.customerService.features.humanConnect')}
                </div>
                <div className="template-feature">
                  {t('templates.customerService.features.autoSummary')}
                </div>
              </div>
              <Button className="template-button" type="primary">
                {t('templates.customerService.button')}
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <Card className="template-card">
              <div className="template-icon">
                <UserOutlined />
              </div>
              <Title level={3} className="template-title" style={horizontalTextStyle}>
                {t('templates.personalized.title')}
              </Title>
              <Paragraph className="template-description" style={horizontalTextStyle}>
                {t('templates.personalized.description')}
              </Paragraph>
              <div className="template-features">
                <div className="template-feature">
                  {t('templates.personalized.features.realtimeAnalysis')}
                </div>
                <div className="template-feature">
                  {t('templates.personalized.features.behaviorPattern')}
                </div>
                <div className="template-feature">
                  {t('templates.personalized.features.knowledgeLearning')}
                </div>
                <div className="template-feature">
                  {t('templates.personalized.features.personalized')}
                </div>
              </div>
              <Button className="template-button" type="primary">
                {t('templates.personalized.button')}
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={6} xl={6}>
            <Card className="template-card">
              <div className="template-icon">
                <EditOutlined />
              </div>
              <Title level={3} className="template-title" style={horizontalTextStyle}>
                {t('templates.contentGeneration.title')}
              </Title>
              <Paragraph className="template-description" style={horizontalTextStyle}>
                {t('templates.contentGeneration.description')}
              </Paragraph>
              <div className="template-features">
                <div className="template-feature">
                  {t('templates.contentGeneration.features.autoWriting')}
                </div>
                <div className="template-feature">
                  {t('templates.contentGeneration.features.seoOptimization')}
                </div>
                <div className="template-feature">
                  {t('templates.contentGeneration.features.variousStyles')}
                </div>
                <div className="template-feature">
                  {t('templates.contentGeneration.features.brandTone')}
                </div>
              </div>
              <Button className="template-button" type="primary">
                {t('templates.contentGeneration.button')}
              </Button>
            </Card>
          </Col>
        </Row>
      </section>

      {/* LowContent Section / 마무리 CTA 섹션 */}
      <section
        className="low-content-section"
        style={{
          padding: getResponsiveValue(
            '60px 20px', // Mobile
            '100px 40px', // Tablet
            '100px 40px', // FHD
            '120px 50px', // QHD
            '140px 60px', // UHD
            isMobile,
            isTablet,
            isFHD,
            isQHD,
            isUHD
          ),
          borderRadius: isMobile ? '0' : '20px',
        }}
      >
        <Title level={2} className="low-content-title">
          {t('lowContent.title')}
        </Title>
        <Paragraph className="low-content-text">{t('lowContent.text')}</Paragraph>
      </section>

      {/* Footer / 푸터 영역 */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/images/logo.avif" alt="HyperFlow" className="footer-logo-image" />
            <div className="footer-tagline">{t('footer.tagline')}</div>
          </div>
          <div className="footer-text">{t('footer.copyright')}</div>
          <div className="footer-social">
            <a
              href="https://discord.com/channels/1320564661959131186/1320571842343469137"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Discord"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/@HyperFlowAI"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="YouTube"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/mirinae-team-751482226/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Language Selector / 언어 선택기 */}
      <LanguageSelector />
    </div>
  )
}

export default Home
