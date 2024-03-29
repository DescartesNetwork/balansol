import SentreIcon from 'static/images/sen.svg'
import { Avatar, Space, Tooltip, Typography } from 'antd'

export type PoweredBySentreProps = {
  title?: string
  spacing?: number
  iconSize?: number
}

const PoweredBySentre = ({
  title = 'Powered by',
  spacing = 4,
  iconSize = 20,
}: PoweredBySentreProps) => {
  return (
    <Space size={spacing} style={{ cursor: 'pointer' }}>
      <Typography.Text style={{ fontSize: 12, color: '#7A7B85' }}>
        {title}
      </Typography.Text>
      <Tooltip title="Sentre Protocol">
        <Avatar src={SentreIcon} size={iconSize} />
      </Tooltip>
    </Space>
  )
}

export default PoweredBySentre
