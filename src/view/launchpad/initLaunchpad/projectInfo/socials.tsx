import IonIcon from '@sentre/antd-ionicon'
import { Button, Col, Input, Row, Space } from 'antd'

type SocialsProps = {
  socials: string[]
  onChangeSocials: (socials: string[]) => void
}

const Socials = ({ socials, onChangeSocials }: SocialsProps) => {
  const onAddMore = () => {
    const nextData = [...socials]
    nextData.push('')
    return onChangeSocials(nextData)
  }

  const onRemove = (index: number) => {
    const nextData = [...socials]
    nextData.splice(index, 1)
    return onChangeSocials(nextData)
  }

  const onChange = (val: string, index: number) => {
    const nextData = [...socials]
    nextData[index] = val
    return onChangeSocials(nextData)
  }

  return (
    <Row gutter={[8, 8]}>
      {socials.map((social, index) => (
        <Col span={24} key={index}>
          <Space style={{ width: '100%' }} className="input-vc">
            <Input
              value={social}
              placeholder="Input link"
              style={{ width: '100%' }}
              onChange={(e) => onChange(e.target.value, index)}
            />
            {index !== 0 && (
              <Button
                type="text"
                icon={<IonIcon name="remove-circle-outline" />}
                onClick={() => onRemove(index)}
              />
            )}
          </Space>
        </Col>
      ))}
      <Col span={24}>
        <Button
          size="large"
          block
          type="dashed"
          icon={<IonIcon name="add-outline" />}
          onClick={onAddMore}
        >
          Add more
        </Button>
      </Col>
    </Row>
  )
}

export default Socials
