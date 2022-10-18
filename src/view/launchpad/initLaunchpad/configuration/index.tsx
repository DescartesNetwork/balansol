import { useTheme } from '@sentre/senhub'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import moment from 'moment'

import { Button, Col, DatePicker, InputNumber } from 'antd'
import { Row, Select, Space, Typography } from 'antd'
import { MintSelection } from '@sen-use/app'
import CategoryTag from 'components/categoryTag'
import SpaceVertical from '../projectInfo/spaceVertical'
import IonIcon from '@sentre/antd-ionicon'
import LaunchpadLineChart from 'view/launchpad/launchpadLineChart'

import {
  CATEGORY,
  DATE_FORMAT,
  InitLaunchpadStep,
  Launchpad,
  ProjectInfoData,
} from 'constant'
import { useGlobalLaunchpad } from '../index'
import { Ipfs } from 'shared/ipfs'

type ConfigurationProps = {
  setStep: (val: InitLaunchpadStep) => void
}

const tagRender = (props: CustomTagProps) => {
  const category = props.label as keyof typeof CATEGORY
  return <CategoryTag category={category} />
}

const Configuration = ({ setStep }: ConfigurationProps) => {
  const [launchpadData, setLaunchpadData] = useGlobalLaunchpad()
  const theme = useTheme()
  const { baseMint, startWeights, endWeights, mint, fee } = launchpadData
  const { startTime, endTime, projectInfo, baseAmount } = launchpadData

  const onChange = (name: keyof Launchpad, value: string | number) =>
    setLaunchpadData({ ...launchpadData, [name]: value })

  const onChangeProjectInfo = (
    name: keyof ProjectInfoData,
    value: string | number,
  ) => {
    const nextProjectInfo = { ...launchpadData.projectInfo, [name]: value }
    return setLaunchpadData({ ...launchpadData, projectInfo: nextProjectInfo })
  }

  const onCreate = async () => {
    const { digest } = await Ipfs.methods.launchpad.set(projectInfo)
    console.log(digest)
  }

  const disabled =
    !mint ||
    !baseAmount ||
    !baseMint ||
    !projectInfo.fundraisingGoal ||
    !fee ||
    !projectInfo.category.length ||
    !startTime ||
    !endTime ||
    !startWeights ||
    !endWeights

  return (
    <Row gutter={[20, 20]}>
      {/* Your token */}
      <Col span={24}>
        <SpaceVertical
          label={
            <Row justify="space-between">
              <Col>
                <Typography.Text>Your token</Typography.Text>
              </Col>
              <Col>
                <Typography.Text className="caption" type="secondary">
                  Available: 0
                </Typography.Text>
              </Col>
            </Row>
          }
        >
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <MintSelection
                style={{
                  background: theme === 'dark' ? '#142042' : '#e6eaf5',
                  width: '100%',
                  textAlign: 'left',
                  height: 40,
                  paddingLeft: 12,
                }}
                value={mint}
                placeholder="Select a token"
                onChange={(val) => onChange('mint', val)}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                onChange={(val) => onChange('baseAmount', val)}
                value={baseAmount ? baseAmount : undefined}
                placeholder="Input total raise"
              />
            </Col>
          </Row>
        </SpaceVertical>
      </Col>

      {/* Purchase token */}
      <Col span={24}>
        <SpaceVertical
          label={
            <Space direction="vertical">
              <Typography.Text>Purchase token</Typography.Text>
              <Typography.Text className="caption" type="secondary">
                Should be a stablecoin
              </Typography.Text>
            </Space>
          }
        >
          <Row gutter={[12, 12]}>
            <Col span={12}>
              <MintSelection
                style={{
                  width: '100%',
                  textAlign: 'left',
                  height: 40,
                  paddingLeft: 12,
                  background: theme === 'dark' ? '#142042' : '#e6eaf5',
                }}
                placeholder="Select a token"
                value={baseMint}
                onChange={(val) => onChange('baseMint', val)}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                placeholder="Input fundraising goal"
                onChange={(val) => onChangeProjectInfo('fundraisingGoal', val)}
                value={
                  projectInfo.fundraisingGoal
                    ? projectInfo.fundraisingGoal
                    : undefined
                }
              />
            </Col>
          </Row>
        </SpaceVertical>
      </Col>

      {/* Fee */}
      <Col span={24}>
        <SpaceVertical label="Swap fee">
          <InputNumber
            onChange={(val) => onChange('fee', val)}
            value={fee ? fee : undefined}
            placeholder="Input swap fee"
          />
        </SpaceVertical>
      </Col>

      {/* Category */}
      <Col span={24}>
        <SpaceVertical
          label={
            <Space direction="vertical">
              <Typography.Text>Type of project</Typography.Text>
              <Typography.Text className="caption" type="secondary">
                E.g. defi, gamefi, lending, DAO... (maximum 4 tags)
              </Typography.Text>
            </Space>
          }
        >
          <Select
            className="select-category"
            mode="multiple"
            showArrow
            style={{ width: '100%', paddingLeft: 8 }}
            tagRender={tagRender}
            placeholder="Select types"
            onChange={(categories) =>
              onChangeProjectInfo('category', categories)
            }
          >
            {Object.keys(CATEGORY).map((item) => (
              <Select.Option
                disabled={
                  projectInfo.category.length >= 4 &&
                  !projectInfo.category.includes(item)
                }
                key={item}
              >
                {item}
              </Select.Option>
            ))}
          </Select>
        </SpaceVertical>
      </Col>

      {/* weights */}
      <Col span={12}>
        <SpaceVertical label="Start price">
          <InputNumber
            placeholder="Input price"
            onChange={(val) => onChange('startWeights', val)}
            value={startWeights ? startWeights : undefined}
          />
        </SpaceVertical>
      </Col>
      <Col span={12}>
        <SpaceVertical label="Floor price">
          <InputNumber
            placeholder="Input price"
            onChange={(val) => onChange('endWeights', val)}
            value={endWeights ? endWeights : undefined}
          />
        </SpaceVertical>
      </Col>

      {/* Time */}
      <Col span={12}>
        <SpaceVertical label="Start Time">
          <DatePicker
            placeholder="Select time"
            suffixIcon={<IonIcon name="time-outline" />}
            className="date-option"
            onChange={(date) => onChange('startTime', date?.valueOf() || 0)}
            clearIcon={null}
            value={startTime ? moment(startTime) : moment(Date.now())}
            showTime={{ showSecond: false }}
            placement="bottomRight"
            format={DATE_FORMAT}
          />
        </SpaceVertical>
      </Col>
      <Col span={12}>
        <SpaceVertical label="End Time">
          <DatePicker
            placeholder="Select time"
            suffixIcon={<IonIcon name="time-outline" />}
            className="date-option"
            onChange={(date) => onChange('endTime', date?.valueOf() || 0)}
            clearIcon={null}
            value={endTime ? moment(endTime) : moment(Date.now())}
            showTime={{ showSecond: false }}
            placement="bottomRight"
            format={DATE_FORMAT}
          />
        </SpaceVertical>
      </Col>

      {/* Chart */}
      <Col span={24}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Typography.Text>Preview</Typography.Text>
          </Col>
          <Col span={24}>
            <LaunchpadLineChart />
          </Col>
        </Row>
      </Col>

      {/* Action */}
      <Col span={24} style={{ marginTop: 12 }}>
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Button
              onClick={() => setStep(InitLaunchpadStep.projectPhoto)}
              block
              ghost
              size="large"
            >
              Back
            </Button>
          </Col>
          <Col span={12}>
            <Button
              disabled={disabled}
              onClick={onCreate}
              block
              type="primary"
              size="large"
            >
              Create
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Configuration
