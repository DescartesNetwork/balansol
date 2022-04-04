import { useWallet } from '@senhub/providers'
import { Col, Row } from 'antd'
import { SearchSelection } from 'app/constant'
import { AppState } from 'app/model'
import { useSelector } from 'react-redux'
import DetailsCard from './detailsCard'

const ListPools = () => {
  const { pools } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const {
    searchPools: { searchInput, selectionSearch },
  } = useSelector((state: AppState) => state)

  const checkRenderDetailsCard = (poolAddress: string) => {
    let poolData = pools[poolAddress]
    if (selectionSearch === SearchSelection.YourPools) {
      if (poolData.authority.toBase58() !== walletAddress) {
        console.log('Vo day')
        return (
          <Col xs={24} md={12} key={poolAddress}>
            <DetailsCard poolAddress={poolAddress} />{' '}
          </Col>
        )
      }
    }
    if (selectionSearch === SearchSelection.AllPools) {
      return (
        <Col xs={24} md={12} key={poolAddress}>
          <DetailsCard poolAddress={poolAddress} />{' '}
        </Col>
      )
    }
  }

  return (
    <Row gutter={[24, 24]}>
      {Object.keys(pools).map((poolAddress) =>
        checkRenderDetailsCard(poolAddress),
      )}
    </Row>
  )
}

export default ListPools
