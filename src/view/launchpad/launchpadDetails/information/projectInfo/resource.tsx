import IonIcon from '@sentre/antd-ionicon'
import { Divider, Space, Typography } from 'antd'

const Resource = () => {
  return (
    <Space style={{ cursor: 'pointer' }}>
      <Space onClick={() => window.open('https://sentre.io', '_blank')}>
        <IonIcon name="globe-outline" />
        <Typography.Text>Website</Typography.Text>
        <Divider
          style={{ borderColor: '#D3D3D6', margin: 2 }}
          type="vertical"
        />
      </Space>
      <Space onClick={() => window.open('https://sentre.io', '_blank')}>
        <IonIcon name="book-outline" />
        <Typography.Text>Whitepaper</Typography.Text>
        <Divider
          style={{ borderColor: '#D3D3D6', margin: 2 }}
          type="vertical"
        />
      </Space>
      <Space onClick={() => window.open('https://sentre.io', '_blank')}>
        <IonIcon name="logo-github" />
        <Typography.Text>Github</Typography.Text>
      </Space>
    </Space>
  )
}

export default Resource
