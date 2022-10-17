import IonIcon from '@sentre/antd-ionicon'
import { Avatar, Space, Typography } from 'antd'
import CategoryTag from 'components/categoryTag'

import BG from 'static/images/panel1.png'

const LaunchpadProfile = () => {
  return (
    <Space size={24}>
      <Avatar shape="square" size={68} src={BG} />
      <Space size={4} direction="vertical">
        <Typography.Title level={4}>Sentre Protocol</Typography.Title>
        <Space size={0}>
          {['defi', 'gamefi', 'DAO', 'AMM'].map((tag: any) => (
            <CategoryTag key={tag} category={tag} />
          ))}
        </Space>

        <IonIcon
          style={{ fontSize: 14, color: '#6B7288' }}
          name="logo-youtube"
        />
      </Space>
    </Space>
  )
}

export default LaunchpadProfile
