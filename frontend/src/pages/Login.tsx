import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Typography, Checkbox, message } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone, UserOutlined, DownOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import LanguageSelector from '../components/LanguageSelector'
import './Login.css'

const { Title, Text } = Typography

// Calculate responsive value based on device type / 반응형 값 계산 함수
const getResponsiveValue = <T,>(
  mobile: T,
  tablet: T,
  desktop: T,
  isMobile: boolean,
  isTablet: boolean,
  isDesktop: boolean
): T => {
  if (isMobile) return mobile
  if (isTablet) return tablet
  if (isDesktop) return desktop
  return desktop // Default value (Desktop) / 기본값 (Desktop)
}

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Responsive breakpoint settings / 반응형 브레이크포인트 설정
  const isMobile = useMediaQuery({ maxWidth: 767 }) // Mobile: 767px and below / 모바일: 767px 이하
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 }) // Tablet: 768px ~ 1024px / 태블릿: 768px ~ 1024px
  const isDesktop = useMediaQuery({ minWidth: 1025 }) // Desktop: 1025px and above / 데스크톱: 1025px 이상

  const handleLogin = async () => {
    if (!email || !password) {
      message.warning(t('login.warning.enterCredentials', '이메일과 비밀번호를 입력해주세요.'))
      return
    }

    setLoading(true)
    // 테스트용: 이메일/PWD가 입력되면 대시보드로 이동
    setTimeout(() => {
      setLoading(false)
      message.success(t('login.success', '로그인 성공!'))
      navigate('/dashboard')
    }, 500)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      // Google OAuth 인증 (테스트용)
      // 실제로는 Google OAuth API를 사용해야 합니다
      message.info(t('login.info.googleLogin', 'Google 로그인을 시도합니다...'))
      
      // 테스트용: Google 로그인도 대시보드로 이동
      setTimeout(() => {
        setLoading(false)
        message.success(t('login.successGoogle', 'Google 로그인 성공!'))
        navigate('/dashboard')
      }, 1000)
    } catch (error) {
      setLoading(false)
      message.error(t('login.error.google', 'Google 로그인에 실패했습니다.'))
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  // 반응형 값 계산
  const containerPadding = getResponsiveValue(
    '20px', // Mobile
    '40px', // Tablet
    '40px', // Desktop
    isMobile,
    isTablet,
    isDesktop
  )
  
  const logoSize = getResponsiveValue(
    { width: '100px', height: '55px' }, // Mobile
    { width: '120px', height: '66px' }, // Tablet
    { width: '133.5px', height: '73.5px' }, // Desktop
    isMobile,
    isTablet,
    isDesktop
  )
  
  const titleFontSize = getResponsiveValue(
    '32px', // Mobile
    '38px', // Tablet
    '45px', // Desktop
    isMobile,
    isTablet,
    isDesktop
  )
  
  const formMaxWidth = getResponsiveValue(
    '100%', // Mobile
    '440.25px', // Tablet
    '440.25px', // Desktop
    isMobile,
    isTablet,
    isDesktop
  )

  return (
    <div className="login-page">
      <div className="login-background">
        <div 
          className="login-ellipse"
          style={{
            width: getResponsiveValue(
              '400px', // Mobile
              '700px', // Tablet
              '988.5px', // Desktop
              isMobile,
              isTablet,
              isDesktop
            ),
            height: getResponsiveValue(
              '400px', // Mobile
              '700px', // Tablet
              '988.5px', // Desktop
              isMobile,
              isTablet,
              isDesktop
            ),
            left: getResponsiveValue(
              '50%', // Mobile
              '50%', // Tablet
              '226.5px', // Desktop
              isMobile,
              isTablet,
              isDesktop
            ),
            transform: getResponsiveValue(
              'translateX(-50%)', // Mobile
              'translateX(-50%)', // Tablet
              'none', // Desktop
              isMobile,
              isTablet,
              isDesktop
            ),
          }}
        ></div>
      </div>

      <div 
        className="login-container"
        style={{
          padding: containerPadding,
        }}
      >
        <div className="login-header">
          <div className="login-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <img 
              src="/images/login-logo-1bb63b.avif" 
              alt="HyperFlow Logo" 
              className="login-logo-image"
              style={{
                width: logoSize.width,
                height: logoSize.height,
              }}
            />
          </div>
          <Title
            level={1}
            className="login-title"
            onClick={() => navigate('/')}
            style={{ 
              cursor: 'pointer',
              fontSize: titleFontSize,
            }}
          >
            HyperFlow AI
          </Title>
        </div>

        <div 
          className="login-form-container"
          style={{
            maxWidth: formMaxWidth,
          }}
        >
          <div className="login-welcome-section">
            <Text className="login-welcome-text">
              {t('login.welcome', '다시 HyperFlow에 돌아오신 것을 환영합니다.')}
            </Text>
            <Text className="login-instruction-text">
              {t('login.instruction', '구글계정이나 이메일로 로그인 해주세요')}
            </Text>
          </div>

          {/* Google Login Button */}
          <Button
            className="login-google-button-new"
            size="large"
            block
            onClick={handleGoogleLogin}
            loading={loading}
          >
            <div className="login-google-content-new">
              <div className="login-google-profile">
                <UserOutlined className="login-google-profile-icon" />
                <div className="login-google-user-info">
                  <span className="login-google-user-name">선호(으)로 로그인</span>
                  <span className="login-google-user-email">sacom415263@gmail.com</span>
                </div>
                <DownOutlined className="login-google-dropdown" />
              </div>
              <div className="login-google-logo">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H15.9564C17.1882 14.2527 17.64 11.9454 17.64 9.20454Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18C11.43 18 13.467 17.1941 14.9564 15.8195L11.0477 13.5613C10.2418 14.1013 9.21091 14.4204 9 14.4204C6.65455 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40681 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54772 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65455 3.57955 9 3.57955Z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
            </div>
          </Button>

          {/* Divider */}
          <div className="login-divider">
            <div className="login-divider-line"></div>
            <span className="login-divider-text">{t('login.divider.text', '또는 이메일로 로그인')}</span>
            <div className="login-divider-line"></div>
          </div>

          {/* Email Login Form */}
          <div className="login-form">
            <Input
              className="login-input"
              placeholder={t('login.placeholder.email', 'gildonhong@example.com')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              size="large"
              autoFocus
            />

            <Input.Password
              className="login-input"
              placeholder={t('login.placeholder.password', '비밀번호를 입력해주세요.')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              size="large"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />

            <div className="login-remember-forgot">
              <Checkbox 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="login-remember-checkbox"
              >
                {t('login.rememberMe', '기억하기')}
              </Checkbox>
              <a href="#" className="login-forgot-link">
                {t('login.link.forgotPassword', '비밀번호를 잊어버리셨나요?')}
              </a>
            </div>

            <Button
              type="primary"
              className="login-button"
              size="large"
              block
              onClick={handleLogin}
              loading={loading}
              disabled={!email || !password}
            >
              {t('login.button.login', '로그인')}
            </Button>
          </div>

          {/* Footer Links */}
          <div className="login-footer">
            <div className="login-footer-signup">
              <Text className="login-footer-text">
                {t('login.link.haveAccount', '이미 계정이 있으신가요?')}
              </Text>
              <a href="#" className="login-footer-link">
                {t('login.link.signUp', '가입하기')}
              </a>
            </div>
            <div className="login-footer-links">
              <a href="#" className="login-footer-link-small">
                {t('login.link.terms', '이용약관')}
              </a>
              <span className="login-footer-separator">｜</span>
              <a href="#" className="login-footer-link-small">
                {t('login.link.privacy', '개인정보 보호방침')}
              </a>
            </div>
          </div>
        </div>
      </div>
      <LanguageSelector />
    </div>
  )
}

export default Login
