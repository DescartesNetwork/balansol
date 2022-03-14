import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { BN } from '@project-serum/anchor'

import { Button, Input, Modal } from 'antd'

import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'

const Deposit = ({ poolAddress }: { poolAddress: string }) => {
  const [visible, setVisible] = useState(false)
  const [mintsAmount, setMintAmount] = useState<Record<string, number>>({})
  const {
    pools: { [poolAddress]: poolData },
  } = useSelector((state: AppState) => state)

  const onChange = (mint: string, value: string) => {
    const newMintsAmount = { ...mintsAmount }
    newMintsAmount[mint] = Number(value)
    setMintAmount(newMintsAmount)
  }

  const onSubmit = async () => {
    try {
      const amountsIn = poolData.mints.map(
        (mint) => new BN(mintsAmount[mint.toBase58()]),
      )
      const { txId } = await window.sen_balancer.addLiquidity(
        poolAddress,
        amountsIn,
      )
      notifySuccess('Deposit', txId)
    } catch (error) {
      notifyError(error)
    }
  }

  return (
    <Fragment>
      <Button onClick={() => setVisible(true)}>Deposit</Button>
      {/* Modal deposit */}
      <Modal
        title="Basic Modal"
        visible={visible}
        onCancel={() => setVisible(false)}
      >
        {poolData.mints.map((mint) => {
          return (
            <Input
              onChange={(e) => onChange(mint.toBase58(), e.target.value)}
              key={mint.toBase58()}
            />
          )
        })}
        <Button onClick={onSubmit}>Submit</Button>
      </Modal>
    </Fragment>
  )
}

export default Deposit
