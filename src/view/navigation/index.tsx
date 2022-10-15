import { Fragment, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppRoute } from '@sentre/senhub'

import { Col, Row, Segmented } from 'antd'

import './index.less'

export const VISIBLE_ROUTES = ['swap', 'pools', 'launchpad']
export const HOMEPAGE_TABS = [
  { label: 'Swap', value: 'swap' },
  { label: 'Pools', value: 'pools' },
  { label: 'Launchpad', value: 'launchpad' },
]

const Navigation = () => {
  const { to } = useAppRoute()
  const { pathname } = useLocation()

  const activeRoute = useMemo(() => {
    const temp = pathname.split('/')
    return temp[temp.length - 1]
  }, [pathname])
  const visible = useMemo(() => {
    for (const route of VISIBLE_ROUTES) {
      if (activeRoute === route) return true
    }
    return false
  }, [activeRoute])

  if (!visible) return <Fragment />
  return (
    <Row gutter={[24, 24]} justify="center">
      <Col>
        <Segmented
          className="navigation"
          options={HOMEPAGE_TABS}
          value={activeRoute}
          onChange={(val) => to(`/${val.toString()}`)}
          block
        />
      </Col>
    </Row>
  )
}

export default Navigation
