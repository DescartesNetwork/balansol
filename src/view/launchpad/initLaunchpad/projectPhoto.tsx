import { Button, Col, Image, Row, Space, Typography, Upload } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import AvatarUploaded from './avatarUploaded'

import { InitLaunchpadStep } from 'constant'
import { UploadChangeParam } from 'antd/lib/upload'
import { fileToBase64 } from 'helper'
import { useGlobalLaunchpad } from './index'

type ProjectPhotoProp = {
  setStep: (val: InitLaunchpadStep) => void
}

const ProjectPhoto = ({ setStep }: ProjectPhotoProp) => {
  const [launchpadData, setLaunchpadData] = useGlobalLaunchpad()
  const coverPhoto = launchpadData.projectInfo.coverPhoto

  const onFileChange = (file: UploadChangeParam) => {
    const { fileList } = file
    const originFile = fileList[0].originFileObj as File
    fileToBase64(originFile, onChangePhoto, 0)
  }

  const onChangePhoto = async (imgBase64: string ) => {
    const nextProjectInfo = {
      ...launchpadData.projectInfo,
      coverPhoto: imgBase64,
    }
    return setLaunchpadData({ ...launchpadData, projectInfo: nextProjectInfo })
  }
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Text>
          The cover photo on your project will help create more impressions and
          attract users.
        </Typography.Text>
      </Col>
      <Col span={24} style={{ height: 241 }} className="project-photo">
        {!coverPhoto ? (
          <Upload.Dragger
            accept="image/png,image/jpg,image/webp"
            onChange={onFileChange}
            className="cover-photo"
          >
            <Space direction="vertical">
              <IonIcon style={{ fontSize: 40 }} name="cloud-upload-outline" />
              <Space direction="vertical" size={0}>
                <Typography.Text>Click or drag image to upload</Typography.Text>
                <Typography.Text type="secondary">
                  Should be 800x450px with JPG, PNG file.
                </Typography.Text>
              </Space>
            </Space>
          </Upload.Dragger>
        ) : (
          <AvatarUploaded iconSize={32} onRemove={() => onChangePhoto('')}>
            <Image
              src={coverPhoto.toString()}
              preview={false}
              style={{ width: '100%', height: '100%' }}
              className="cover-photo"
            />
          </AvatarUploaded>
        )}
      </Col>
      <Col span={24} />
      <Col span={24}>
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Button
              onClick={() => setStep(InitLaunchpadStep.projectInfo)}
              block
              ghost
              size="large"
            >
              Back
            </Button>
          </Col>
          <Col span={12}>
            <Button
              onClick={() => setStep(InitLaunchpadStep.configuration)}
              block
              type="primary"
              size="large"
              disabled={!coverPhoto}
            >
              Continue
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ProjectPhoto
