import { useState } from 'react'
import { useTheme, util } from '@sentre/senhub'
import moment from 'moment'

import { Button, Col, DatePicker, InputNumber } from 'antd'
import { Row, Select, Space, Typography } from 'antd'
import LaunchpadChartInit from 'view/launchpad/launchpadLineChart/launchpadChartInit'
import { MintSelection } from '@sen-use/app'
import CategoryTag from 'components/categoryTag'
import SpaceVertical from '../projectInfo/spaceVertical'
import IonIcon from '@sentre/antd-ionicon'

import { CATEGORY, Launchpad, ProjectInfoData } from 'constant'
import { DATE_FORMAT, InitLaunchpadStep } from 'constant'
import { DEFAULT_LAUNCHPAD, useGlobalLaunchpad } from '../index'
import { useCreateLaunchpad } from 'hooks/launchpad/actions/useCreateLaunchpad'
import { useWrapAccountBalance } from 'hooks/useWrapAccountBalance'
import { RangePickerProps } from 'antd/lib/date-picker'
import { useAppRouter } from 'hooks/useAppRouter'
import { notifyError } from '@sen-use/app'
import type { CustomTagProps } from 'rc-select/lib/BaseSelect'

type ConfigurationProps = {
  setStep: (val: InitLaunchpadStep) => void
}

const tagRender = (props: CustomTagProps) => {
  const category = props.label as keyof typeof CATEGORY
  return <CategoryTag category={category} />
}

const Configuration = ({ setStep }: ConfigurationProps) => {
  const [loading, setLoading] = useState(false)
  const [launchpadData, setLaunchpadData] = useGlobalLaunchpad()
  const { onCreateLaunchpad } = useCreateLaunchpad()
  const { stableMint, startPrice, endPrice, mint } = launchpadData
  const { startTime, endTime, projectInfo, amount } = launchpadData
  const { balance } = useWrapAccountBalance(mint)
  const theme = useTheme()
  const { pushHistory } = useAppRouter()

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
    try {
      setLoading(true)
      const nextData: Launchpad = JSON.parse(JSON.stringify(launchpadData))
      const nextSocials = []

      for (const social of launchpadData.projectInfo.socials)
        if (social) nextSocials.push(social)

      nextData.projectInfo.socials = nextSocials

      await onCreateLaunchpad(nextData)
      setLaunchpadData(DEFAULT_LAUNCHPAD)
      return pushHistory('/launchpad')
    } catch (error) {
      notifyError(error)
    } finally {
      setLoading(false)
    }
  }

  const disabledStartDate: RangePickerProps['disabledDate'] = (current) => {
    return current < moment().subtract(1, 'minutes')
  }

  const disabledEndDate: RangePickerProps['disabledDate'] = (current) => {
    return (
      (current && current > moment(startTime).add(7, 'days')) ||
      current < moment()
    )
  }

  const disabled =
    !mint ||
    !amount ||
    !stableMint ||
    !projectInfo.baseAmount ||
    !projectInfo.category.length ||
    !startTime ||
    !endTime ||
    !startPrice ||
    !endPrice

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
                <Typography.Text
                  onClick={() => onChange('amount', balance)}
                  style={{ cursor: 'pointer' }}
                  className="caption"
                  type="secondary"
                >
                  Available: {util.numeric(balance).format('0,0.[0000]')}
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
                onChange={(val) => onChange('amount', val)}
                value={amount ? amount : undefined}
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
                value={stableMint}
                onChange={(val) => onChange('stableMint', val)}
              />
            </Col>
            <Col span={12}>
              <InputNumber
                placeholder="Input fundraising goal"
                onChange={(val) => onChangeProjectInfo('baseAmount', val)}
                value={
                  projectInfo.baseAmount ? projectInfo.baseAmount : undefined
                }
              />
            </Col>
          </Row>
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
            onChange={(val) => onChange('startPrice', val)}
            value={startPrice ? startPrice : undefined}
            className="input-price"
          />
        </SpaceVertical>
      </Col>
      <Col span={12}>
        <SpaceVertical label="Floor price">
          <InputNumber
            placeholder="Input price"
            onChange={(val) => onChange('endPrice', val)}
            value={endPrice ? endPrice : undefined}
            className="input-price"
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
            disabledDate={disabledStartDate}
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
            disabledDate={disabledEndDate}
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
            <LaunchpadChartInit
              startTime={startTime}
              endTime={endTime}
              startPrice={startPrice}
              endPrice={endPrice}
              mint={mint}
              baseMint={stableMint}
              balanceA={amount}
              balanceB={projectInfo.baseAmount}
            />
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
              loading={loading}
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
