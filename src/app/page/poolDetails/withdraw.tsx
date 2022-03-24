import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN, utils, web3 } from '@project-serum/anchor'
import { useAccount, useMint, useWallet } from '@senhub/providers'
import { utils as utilsSenJS } from '@senswap/sen-js'

import { Button, Col, Modal, Row, Typography } from 'antd'
import TokenWillReceive from './tokenWillReceive'
import MintInput from 'app/components/mintInput'
import { PoolAvatar } from 'app/components/pools/poolAvatar'
import { MintSymbol } from 'shared/antd/mint'
import IonIcon from 'shared/antd/ionicon'

import { notifyError, notifySuccess } from 'app/helper'
import {
  calcMintReceiveRemoveSingleSide,
  getMintInfo,
} from 'app/helper/oracles'
import { AppState } from 'app/model'
import { LPTDECIMALS } from 'app/constant/index'
import { useOracles } from 'app/hooks/useOracles'

const Withdraw = ({ poolAddress }: { poolAddress: string }) => {
  const [visible, setVisible] = useState(false)
  const [lptAmount, setLptAmount] = useState('')
  const [mintsSelected, setMinsSelected] = useState<Record<string, boolean>>({})
  const [isSelectedAll, setIsSelectedAll] = useState(false)
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { accounts } = useAccount()
  const { getMint } = useMint()
  const { undecimalizeMintAmount } = useOracles()

  const onSubmit = async () => {
    try {
      await checkInitializedAccount()
      let amount = utilsSenJS.decimalize(lptAmount, LPTDECIMALS)
      const { txId } = await window.balansol.removeSidedLiquidity(
        poolAddress,
        Object.keys(mintsSelected).find((mint) => mintsSelected[mint]) || '',
        new BN(String(amount)),
      )
      notifySuccess('Withdraw', txId)
    } catch (error) {
      notifyError(error)
    }
  }

  const checkInitializedAccount = async () => {
    for (const mint of poolData.mints) {
      const tokenAccount = await utils.token.associatedAddress({
        owner: new web3.PublicKey(walletAddress),
        mint,
      })
      if (!accounts[tokenAccount.toBase58()]) {
        const { wallet, splt } = window.sentre
        if (!wallet) throw new Error('Login first')
        await splt.initializeAccount(mint.toBase58(), walletAddress, wallet)
      }
    }
  }

  const selectMint = (mint: string) => {
    if (isSelectedAll && mintsSelected[mint]) {
      setIsSelectedAll(false)
      setMinsSelected({ [`${mint}`]: true })
      return
    }
    if (mintsSelected[mint]) {
      setMinsSelected({ [`${mint}`]: !mintsSelected[mint] })
    } else setMinsSelected({ [`${mint}`]: true })
    calcMintReceiveSingleSide(mint)
  }

  const calcMintReceiveSingleSide = async (mint: string) => {
    let minPltAddress = poolData.mintLpt.toBase58()
    let mintPool = await getMint({ address: minPltAddress })
    let lptSupply = mintPool[minPltAddress]?.supply
    let amount = utilsSenJS.decimalize(lptAmount, LPTDECIMALS)
    const mintPoolInfo = getMintInfo(poolData, mint)

    console.log('poolData: ', poolData, minPltAddress)
    console.log('lptSupply: ', lptSupply)
    console.log('mintPoolsInfo: ', mintPoolInfo)

    let result = calcMintReceiveRemoveSingleSide(
      new BN(String(amount)),
      new BN(String(lptSupply)),
      Number(mintPoolInfo.normalizedWeight),
      mintPoolInfo.reserve,
      new BN(String(poolData.fee)),
    )
    console.log('result: ', await undecimalizeMintAmount(result, mint))
  }

  const selectAllMint = () => {
    let allMintsSelected: any = {}
    poolData.mints.map(
      (mint) =>
        (allMintsSelected = {
          ...allMintsSelected,
          [`${mint.toBase58()}`]: true,
        }),
    )
    setIsSelectedAll(true)
    setMinsSelected(allMintsSelected)
  }

  return (
    <Fragment>
      <Button className="btn-outline" onClick={() => setVisible(true)} block>
        Withdraw
      </Button>
      {/* Modal withdraw */}
      <Modal
        title={<Typography.Title level={4}>Withdraw</Typography.Title>}
        visible={visible}
        onCancel={() => setVisible(false)}
        className="modal-balansol"
        footer={null}
        destroyOnClose={true}
        centered={true}
        closeIcon={<IonIcon name="close-outline" />}
      >
        <Row gutter={[0, 24]} className="withdraw">
          <Col span={24}>
            <Row gutter={[0, 12]}>
              <Col span={24}>
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                  You want to reveice
                </Typography.Text>
              </Col>
              <Col span={24}>
                <Row gutter={[12, 12]}>
                  {poolData.mints.map((mint, index) => {
                    let mintAddress: string = mint.toBase58()
                    return (
                      <Col key={index}>
                        <Button
                          className={`btn-toke-name ${
                            mintsSelected[mintAddress] ? 'selected' : ''
                          }`}
                          onClick={() => selectMint(mintAddress)}
                        >
                          <span className="title">
                            <MintSymbol mintAddress={mintAddress || ''} />
                          </span>
                        </Button>
                      </Col>
                    )
                  })}
                  <Col>
                    <Button
                      className={`btn-toke-name ${
                        isSelectedAll ? 'selected' : ''
                      }`}
                      onClick={() => selectAllMint()}
                    >
                      <span className="title">All</span>
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <MintInput
              selectedMint={poolData.mintLpt.toBase58()}
              amount={lptAmount}
              onChangeAmount={(amount) => setLptAmount(amount)}
              mintLabel={
                <Typography.Text type="secondary">Balansol LP</Typography.Text>
              }
              mintAvatar={<PoolAvatar poolAddress={poolAddress} />}
            />
          </Col>
          <Col span={24}>
            <Row gutter={[0, 14]} style={{ width: '100%' }}>
              <Col span={24}>
                <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                  You will receive
                </Typography.Text>
              </Col>
              {Object.keys(mintsSelected).map((mint) => {
                return mintsSelected[mint] ? (
                  <TokenWillReceive
                    key={mint}
                    mintAddress={mint}
                    amount={lptAmount}
                  />
                ) : null
              })}
            </Row>
          </Col>
          <Col span={24}>
            <Button
              className="balansol-btn"
              type="primary"
              block
              onClick={onSubmit}
            >
              Withdraw
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default Withdraw
