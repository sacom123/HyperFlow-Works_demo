import { Modal, Typography, Row, Col, Card, Button } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import './PricingModal.css'

const { Title, Paragraph } = Typography

interface PricingModalProps {
  open: boolean
  onClose: () => void
}

const PricingModal = ({ open, onClose }: PricingModalProps) => {
  const pricingPlans = [
    {
      name: 'Pricing',
      price: '$29/mo',
      features: [
        'Keyword optimization',
        'Automated meta tags',
        'SEO monitoring',
        'Monthly reports',
      ],
      buttonText: 'Join waitlist',
      buttonType: 'default' as const,
      isPopular: false,
    },
    {
      name: 'Pro',
      price: '$79/mo',
      features: [
        'Keyword optimization',
        'Automated meta tags',
        'SEO monitoring',
        'Monthly reports',
        'Content suggestions',
        'Link optimization',
      ],
      buttonText: 'Join waitlist',
      buttonType: 'primary' as const,
      isPopular: true,
    },
    {
      name: 'Pricing',
      price: '$29/mo',
      features: [
        'Keyword optimization',
        'Automated meta tags',
        'SEO monitoring',
        'Monthly reports',
      ],
      buttonText: 'Join waitlist',
      buttonType: 'default' as const,
      isPopular: false,
    },
  ]

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width="90%"
      style={{ maxWidth: '1200px' }}
      className="pricing-modal"
      styles={{ mask: { backdropFilter: 'blur(10px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' } }}
    >
      <div className="pricing-modal-content">
        <Button
          className="pricing-modal-close"
          type="text"
          icon={<CloseOutlined />}
          onClick={onClose}
          aria-label="Close modal"
        />
        
        <div className="pricing-header">
          <Title level={2} className="pricing-title">
            Pricing
          </Title>
          <Paragraph className="pricing-description">
            Choose the right plan to meet your SEO needs and start optimizing today.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]} className="pricing-cards">
          {pricingPlans.map((plan, index) => (
            <Col xs={24} md={8} key={index}>
              <Card
                className={`pricing-card ${plan.isPopular ? 'pricing-card-popular' : ''}`}
              >
                <div className="pricing-card-header">
                  <Title level={3} className="pricing-card-name">
                    {plan.name}
                  </Title>
                  <Title level={2} className="pricing-card-price">
                    {plan.price}
                  </Title>
                </div>
                
                <div className="pricing-card-divider"></div>
                
                <div className="pricing-card-features">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="pricing-feature-row">
                      <CheckOutlined className="pricing-feature-icon" />
                      <span className="pricing-feature-text">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  type={plan.buttonType}
                  className="pricing-card-button"
                  block
                  size="large"
                >
                  {plan.buttonText}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Modal>
  )
}

export default PricingModal

