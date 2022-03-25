import { Button, Col } from 'antd'
import { MintSymbol } from 'shared/antd/mint'

const ButtonSelectMint = ({
  mintAddress,
  isMintSelected,
  selectMint,
}: {
  mintAddress: string
  isMintSelected: boolean
  selectMint: (mint: string) => void
}) => {
  return (
    <Col>
      <Button
        className={`btn-toke-name ${isMintSelected ? 'selected' : ''}`}
        onClick={() => selectMint(mintAddress)}
      >
        <span className="title">
          <MintSymbol mintAddress={mintAddress || ''} />
        </span>
      </Button>
    </Col>
  )
}

export default ButtonSelectMint
