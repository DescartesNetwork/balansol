import { Avatar, Button, Col, Input, Row, Space, Upload } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import AvatarUploaded from '../avatarUploaded'

import { UploadChangeParam } from 'antd/lib/upload'
import { fileToBase64 } from 'helper'

export type VC = { logo: string; link: string }

type VCInfoProps = {
  vCs: VC[]
  onChangeVC: (vcs: VC[]) => void
}

const VCInfo = ({ vCs, onChangeVC }: VCInfoProps) => {
  const onAddMore = () => {
    const nextData = [...vCs]
    nextData.push({ logo: '', link: '' })
    return onChangeVC(nextData)
  }

  const onRemove = (index: number) => {
    const nextData = [...vCs]
    nextData.splice(index, 1)
    return onChangeVC(nextData)
  }

  const onFileChange = (file: UploadChangeParam, index: number) => {
    const { fileList } = file
    const originFile = fileList[0].originFileObj as File
    fileToBase64(originFile, formatImg, index)
  }

  const formatImg = async (imgBase64: string, index: number) => {
    const vCInfo: VC = {
      ...vCs[index],
      logo: imgBase64,
    }
    const nextData = [...vCs]
    nextData[index] = vCInfo
    return onChangeVC(nextData)
  }

  const onLinkChange = (val: string, index: number) => {
    const nextData = [...vCs]
    nextData[index] = { ...nextData[index], link: val }
    return onChangeVC(nextData)
  }

  const onRemoveLogo = (index: number) => {
    const nextData = [...vCs]
    nextData[index] = { ...nextData[index], logo: '' }
    return onChangeVC(nextData)
  }

  return (
    <Row gutter={[8, 8]}>
      {vCs.map(({ link, logo }, index) => (
        <Col span={24} key={index}>
          <Row gutter={12} align="middle">
            <Col xs={4} md={2}>
              {logo ? (
                <AvatarUploaded onRemove={() => onRemoveLogo(index)}>
                  <Avatar size={40} src={logo} />
                </AvatarUploaded>
              ) : (
                <Upload
                  className="upload-vc"
                  accept="image/png,image/jpg,image/webp"
                  maxCount={1}
                  onChange={(file) => onFileChange(file, index)}
                >
                  <Button
                    size="large"
                    block
                    type="dashed"
                    icon={<IonIcon name="attach-outline" />}
                  />
                </Upload>
              )}
            </Col>
            <Col xs={20} md={22}>
              <Space style={{ width: '100%' }} className="input-vc">
                <Input
                  value={link}
                  placeholder="Input name"
                  style={{ width: '100%' }}
                  onChange={(e) => onLinkChange(e.target.value, index)}
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
          </Row>
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

export default VCInfo
