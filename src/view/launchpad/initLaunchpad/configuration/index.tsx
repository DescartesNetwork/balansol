import { useTheme } from '@sentre/senhub'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'
import moment from 'moment'

import { Button, Col, DatePicker, InputNumber } from 'antd'
import { Row, Select, Space, Typography } from 'antd'
import { MintSelection } from '@sen-use/app'
import CategoryTag from 'components/categoryTag'
import SpaceVertical from '../projectInfo/spaceVertical'
import IonIcon from '@sentre/antd-ionicon'

import { CATEGORY, DATE_FORMAT, InitLaunchpadStep, Launchpad } from 'constant'
import { useGlobalLaunchpad } from '../index'

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

  const onChange = (name: keyof Launchpad, value: string | number) =>
    setLaunchpadData({ ...launchpadData, [name]: value })

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
                value={launchpadData.token_a}
                placeholder="Select a token"
                onChange={(val) => onChange('token_a', val)}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                onChange={(val) => onChange('total_raise', val)}
                value={
                  launchpadData.total_raise
                    ? launchpadData.total_raise
                    : undefined
                }
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
                value={launchpadData.purchaseToken}
                onChange={(val) => onChange('purchaseToken', val)}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                placeholder="Input fundraising goal"
                onChange={(val) => onChange('fundraising', val)}
                value={
                  launchpadData.fundraising
                    ? launchpadData.fundraising
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
            value={launchpadData.fee ? launchpadData.fee : undefined}
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
          >
            {Object.keys(CATEGORY).map((item) => (
              <Select.Option key={item}>{item}</Select.Option>
            ))}
          </Select>
        </SpaceVertical>
      </Col>

      {/* Price */}
      <Col span={12}>
        <SpaceVertical label="Start price">
          <InputNumber
            placeholder="Input price"
            onChange={(val) => onChange('startPrice', val)}
            value={
              launchpadData.startPrice ? launchpadData.startPrice : undefined
            }
          />
        </SpaceVertical>
      </Col>
      <Col span={12}>
        <SpaceVertical label="Floor price">
          <InputNumber
            placeholder="Input price"
            onChange={(val) => onChange('floorPrice', val)}
            value={
              launchpadData.floorPrice ? launchpadData.floorPrice : undefined
            }
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
            value={
              launchpadData.startTime
                ? moment(launchpadData.startTime)
                : moment(Date.now())
            }
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
            onChange={(date) => onChange('startTime', date?.valueOf() || 0)}
            clearIcon={null}
            value={
              launchpadData.endTime
                ? moment(launchpadData.endTime)
                : moment(Date.now())
            }
            showTime={{ showSecond: false }}
            placement="bottomRight"
            format={DATE_FORMAT}
          />
        </SpaceVertical>
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
              // disabled={disabled}
              // onClick={onConfirm}
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

export default Configuration
