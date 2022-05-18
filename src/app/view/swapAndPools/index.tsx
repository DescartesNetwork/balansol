import { useCallback } from 'react'

import { Row, Col, Segmented } from 'antd'
import Pools from '../pools'
import Swap from '../swap'

import { HOMEPAGE_TABS } from 'app/constant'
import { useAppRouter } from 'app/hooks/useAppRouter'

type SwapAndPoolsProps = {
  tabId: string
}

const SwapAndPools = ({ tabId }: SwapAndPoolsProps) => {
  const { pushHistory } = useAppRouter()

  const onChange = useCallback(
    (tabId: string) => pushHistory(`/${tabId}`),
    [pushHistory],
  )

  return (
    <Row gutter={[24, 24]} justify="center" style={{ paddingBottom: 12 }}>
      <Col>
        <Segmented
          className="swap-and-pool"
          options={Object.keys(HOMEPAGE_TABS).map((key) => {
            return { label: key, value: HOMEPAGE_TABS[key] }
          })}
          value={tabId}
          onChange={(val) => onChange(val.toString())}
          block
        />
      </Col>
      <Col span={24}>{tabId === 'pools' ? <Pools /> : <Swap />}</Col>
    </Row>
  )
}

export default SwapAndPools
