import { useMemo, useState } from 'react'
import { createGlobalState } from 'react-use'

import { Card, Col, Row, Steps } from 'antd'
import ProjectInfo from './projectInfo'
import ProjectPhoto from './projectPhoto'
import Configuration from './configuration'

import { InitLaunchpadStep, Launchpad, ProjectInfoData } from 'constant'

import './index.less'

const DEFAULT_INFO: ProjectInfoData = {
  projectName: '',
  description: '',
  website: '',
  github: '',
  whitepaper: '',
  vCs: [{ logo: '', link: '' }],
  socials: [''],
  coverPhoto: '',
  category: [],
  baseAmount: 0,
}

export const DEFAULT_LAUNCHPAD: Launchpad = {
  projectInfo: DEFAULT_INFO,
  mint: '',
  stableMint: '',
  amount: 0,
  fee: 0,
  startPrice: 0,
  endPrice: 0,
  startTime: Date.now(), //now
  endTime: Date.now() + 3 * (24 * 60 * 60 * 1000), // Add more 3 days
}

export const useGlobalLaunchpad =
  createGlobalState<Launchpad>(DEFAULT_LAUNCHPAD)

const InitLaunchPad = () => {
  const [step, setStep] = useState(InitLaunchpadStep.projectInfo)

  const processInit = useMemo(() => {
    switch (step) {
      case InitLaunchpadStep.projectInfo:
        return <ProjectInfo setStep={setStep} />
      case InitLaunchpadStep.projectPhoto:
        return <ProjectPhoto setStep={setStep} />
      case InitLaunchpadStep.configuration:
        return <Configuration setStep={setStep} />
    }
  }, [step])

  return (
    <Row justify="center">
      <Col xs={24} sm={20} md={18} lg={12}>
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={[32, 32]}>
            <Col span={24}>
              <Steps size="small" current={step} direction="horizontal">
                <Steps.Step title="Project info" />
                <Steps.Step title="Cover photo" />
                <Steps.Step title="Configuration" />
              </Steps>
            </Col>
            <Col span={24}>{processInit}</Col>
          </Row>
        </Card>
      </Col>
    </Row>
  )
}

export default InitLaunchPad
