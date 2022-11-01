import moment from 'moment'
import { util } from '@sentre/senhub'

import { Avatar, Col, Divider, Row, Space, Typography } from 'antd'
import { MintName, MintSymbol } from '@sen-use/app'
import Resource from './resource'
import IonIcon from '@sentre/antd-ionicon'

import { DATE_FORMAT } from 'constant'
import useMintSupply from 'shared/hooks/useMintSupply'
import { useLaunchpadData } from 'hooks/launchpad/useLaunchpadData'
import { getDataWebsite, validURL } from 'helper'

const ProjectInfo = ({ launchpadAddress }: { launchpadAddress: string }) => {
  const { metadata, launchpadData } = useLaunchpadData(launchpadAddress)
  const mintAddress = launchpadData.mint.toBase58()
  const tokenAddress = launchpadData.baseMint.toBase58()

  const launchpadSupply = useMintSupply(mintAddress)
  const tokenSupply = useMintSupply(tokenAddress)

  const onRedirect = (url?: string) => {
    if (!url || !validURL(url)) return
    return window.open(url, '_blank')
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Resource launchpadAddress={launchpadAddress} />
      </Col>

      {/* Description */}
      <Col span={24}>
        <Space direction="vertical">
          <Typography.Title level={5}>Description</Typography.Title>
          <Typography.Paragraph style={{ margin: 0 }}>
            {metadata?.description}
          </Typography.Paragraph>
        </Space>
      </Col>

      {/* Token info */}
      <Col span={24}>
        <Space direction="vertical">
          <Typography.Title level={5}>Token information</Typography.Title>

          <Space direction="vertical">
            <Typography.Text>
              <span style={{ color: '#9CA1AF' }}>Token Name: </span>
              <MintName mintAddress={mintAddress} /> (
              <MintSymbol mintAddress={mintAddress} />)
            </Typography.Text>
            <Typography.Text
              style={{ cursor: 'pointer' }}
              onClick={() => window.open(util.explorer(mintAddress), '_blank')}
            >
              <span style={{ color: '#9CA1AF' }}>Token Address: </span>
              {util.shortenAddress(mintAddress, 6)}
            </Typography.Text>
            <Typography.Text>
              <span style={{ color: '#9CA1AF' }}>Token supply: </span>
              {util
                .numeric(tokenSupply && tokenSupply.toString())
                .format('0,0.[00000]')}{' '}
              (
              <MintSymbol mintAddress={mintAddress} />)
            </Typography.Text>
            <Typography.Text>
              <span style={{ color: '#9CA1AF' }}>Launchpad supply: </span>
              {util
                .numeric(launchpadSupply && launchpadSupply.toString())
                .format('0,0.[00000]')}{' '}
              (
              <MintSymbol mintAddress={mintAddress} />)
            </Typography.Text>
            <Typography.Text>
              <span style={{ color: '#9CA1AF' }}>Launchpad start time: </span>
              {moment(launchpadData?.startTime.toNumber() * 1000).format(
                DATE_FORMAT,
              )}
            </Typography.Text>
            <Typography.Text>
              <span style={{ color: '#9CA1AF' }}>Launchpad end time: </span>
              {moment(launchpadData?.endTime.toNumber() * 1000).format(
                DATE_FORMAT,
              )}
            </Typography.Text>
          </Space>
        </Space>
      </Col>
      {!!metadata && !!metadata.socials.length && (
        <Col span={24}>
          <Space direction="vertical">
            <Typography.Title level={5}>Social media</Typography.Title>
            <Space style={{ cursor: 'pointer' }}>
              {metadata.socials.map((social, index) => {
                const data = getDataWebsite(social)
                return (
                  <Space key={index} onClick={() => onRedirect(social)}>
                    <IonIcon style={{ fontSize: 21 }} name={data?.iconName} />
                    <Typography.Text>{data?.websiteName}</Typography.Text>
                    {index !== metadata.socials.length - 1 && (
                      <Divider
                        style={{ borderColor: '#D3D3D6', margin: 2 }}
                        type="vertical"
                      />
                    )}
                  </Space>
                )
              })}
            </Space>
          </Space>
        </Col>
      )}
      {!!metadata && !!metadata.vCs.length && (
        <Col span={24}>
          <Space direction="vertical">
            <Typography.Title level={5}>
              Leading venture capital
            </Typography.Title>
            <Space style={{ cursor: 'pointer' }}>
              {metadata.vCs.map(({ link, logo }, index) => {
                return (
                  <Space key={index}>
                    <Avatar size={21} src={logo} />
                    <Typography.Text>{link}</Typography.Text>
                    {index !== metadata.vCs.length - 1 && (
                      <Divider
                        style={{ borderColor: '#D3D3D6', margin: 2 }}
                        type="vertical"
                      />
                    )}
                  </Space>
                )
              })}
            </Space>
          </Space>
        </Col>
      )}
    </Row>
  )
}

export default ProjectInfo
