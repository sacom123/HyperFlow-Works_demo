import { Layout, Typography } from 'antd'

const { Header } = Layout
const { Title } = Typography

const AppHeader = () => {
  return (
    <Header
      style={{
        display: 'flex',
        alignItems: 'center',
        background: '#001529',
        padding: '0 24px',
      }}
    >
      <Title level={3} style={{ color: '#fff', margin: 0 }}>
        Hyperflow Works
      </Title>
    </Header>
  )
}

export default AppHeader

