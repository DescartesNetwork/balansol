import { Button, Col, Input, Row, Typography } from 'antd'
import Socials from './socials'
import SpaceVertical from './spaceVertical'
import VCInfo, { VC } from './vcInfo'

import { useGlobalLaunchpad } from '../index'
import { InitLaunchpadStep, ProjectInfoData } from 'constant'
import { useAppRouter } from 'hooks/useAppRouter'
import { validURL } from 'helper'
import { useMemo } from 'react'

type ProjectInfoProp = {
  setStep: (val: InitLaunchpadStep) => void
}

const ProjectInfo = ({ setStep }: ProjectInfoProp) => {
  const [launchpadData, setLaunchpadData] = useGlobalLaunchpad()
  const { pushHistory } = useAppRouter()

  const { description, projectName, socials } = launchpadData.projectInfo
  const { whitepaper, vCs, github, website } = launchpadData.projectInfo

  const onChangeInfo = (name: keyof ProjectInfoData, value: string) => {
    const nextProjectInfo = {
      ...launchpadData.projectInfo,
      [name]: value,
    }
    return setLaunchpadData({ ...launchpadData, projectInfo: nextProjectInfo })
  }

  const onChangeVC = (vCs: VC[]) => {
    const nextData = { ...launchpadData }
    const nextProjectInfo = { ...launchpadData.projectInfo, vCs }
    return setLaunchpadData({ ...nextData, projectInfo: nextProjectInfo })
  }

  const onChangeSocials = (socials: string[]) => {
    const nextData = { ...launchpadData }
    const nextProjectInfo = { ...launchpadData.projectInfo, socials }
    return setLaunchpadData({ ...nextData, projectInfo: nextProjectInfo })
  }

  const onConfirm = async () => {
    return setStep(InitLaunchpadStep.projectPhoto)
  }

  console.log(launchpadData)

  const disabled = useMemo(() => {
    if (socials.length > 1)
      for (const social of socials) if (!validURL(social)) return true

    return (
      !projectName ||
      !description ||
      (!website && !validURL(website)) ||
      (!whitepaper && !validURL(whitepaper)) ||
      (!github && !validURL(github)) ||
      projectName.length > 20 ||
      description.length > 150
    )
  }, [description, github, projectName, socials, website, whitepaper])

  return (
    <Row gutter={[20, 20]}>
      {/* Name */}
      <Col span={24}>
        <SpaceVertical
          label={
            <Row justify="space-between">
              <Col>
                <Typography.Text>Project name</Typography.Text>
              </Col>
              <Col>
                <Typography.Text type="secondary">
                  <span style={{ color: projectName.length > 20 ? 'red' : '' }}>
                    {projectName.length}
                  </span>
                  /20 characters
                </Typography.Text>
              </Col>
            </Row>
          }
        >
          <Input
            placeholder="Input your project name"
            value={projectName}
            onChange={(e) => onChangeInfo('projectName', e.target.value)}
          />
        </SpaceVertical>
      </Col>

      {/* Description */}
      <Col span={24}>
        <SpaceVertical
          label={
            <Row justify="space-between">
              <Col>
                <Typography.Text>Description</Typography.Text>
              </Col>
              <Col>
                <Typography.Text type="secondary">
                  <span
                    style={{ color: description.length > 150 ? 'red' : '' }}
                  >
                    {description.length}
                  </span>
                  /150 characters
                </Typography.Text>
              </Col>
            </Row>
          }
        >
          <Input.TextArea
            value={description}
            rows={4}
            placeholder="Summarize about your project..."
            className="description"
            onChange={(e) => onChangeInfo('description', e.target.value)}
          />
        </SpaceVertical>
      </Col>

      {/* Website + Whitepaper + Github */}
      <Col span={24}>
        <SpaceVertical label="Website">
          <Input
            placeholder="Input link"
            value={website}
            onChange={(e) => onChangeInfo('website', e.target.value)}
          />
        </SpaceVertical>
      </Col>
      <Col span={24}>
        <SpaceVertical label="Whitepaper">
          <Input
            placeholder="Input link"
            value={whitepaper}
            onChange={(e) => onChangeInfo('whitepaper', e.target.value)}
          />
        </SpaceVertical>
      </Col>
      <Col span={24}>
        <SpaceVertical label="Github">
          <Input
            placeholder="Input link"
            value={github}
            onChange={(e) => onChangeInfo('github', e.target.value)}
          />
        </SpaceVertical>
      </Col>

      {/* VC */}
      <Col span={24}>
        <SpaceVertical label="Leading venture capital (Optional)">
          <VCInfo onChangeVC={onChangeVC} vCs={vCs} />
        </SpaceVertical>
      </Col>

      {/* Socials */}
      <Col span={24}>
        <SpaceVertical label="Socials (Optional)">
          <Socials onChangeSocials={onChangeSocials} socials={socials} />
        </SpaceVertical>
      </Col>

      {/* Action */}
      <Col span={24} style={{ marginTop: 12 }}>
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Button
              onClick={() => pushHistory('/launchpad')}
              block
              ghost
              size="large"
            >
              Cancel
            </Button>
          </Col>
          <Col span={12}>
            <Button
              disabled={disabled}
              onClick={onConfirm}
              block
              type="primary"
              size="large"
            >
              Continue
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ProjectInfo
