import React, { useCallback, useEffect, useState } from 'react'
import { useMint } from '@senhub/providers'

import { Card, Input, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'

const KEYSIZE = 3

const Search = ({
  onChange,
  disabled = false,
}: {
  onChange: (data: string[]) => void
  disabled?: boolean
}) => {
  const [mintAddresses, setMintAddresses] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const { tokenProvider } = useMint()
  const { pools } = useSelector((state: AppState) => state)

  const sortMintAddresses = useCallback(async () => {
    // Get all mints in token provider
    const allMintAddress: Record<string, boolean> = {}

    for (const pool of Object.values(pools)) {
      for (const mint of pool.mints) {
        allMintAddress[mint.toBase58()] = true
      }
    }
    // Return
    return setMintAddresses(Object.keys(allMintAddress))
  }, [pools])

  useEffect(() => {
    sortMintAddresses()
  }, [sortMintAddresses])

  const search = useCallback(async () => {
    if (!keyword || keyword.length < KEYSIZE) return onChange(mintAddresses)
    const raw = await tokenProvider.find(keyword)
    const data = raw
      .filter(({ address }) => mintAddresses.includes(address))
      .map(({ address }) => address)
    // Search by address
    mintAddresses.forEach((mintAddress) => {
      if (data.includes(mintAddress)) return
      if (!mintAddress.toLowerCase().includes(keyword.toLowerCase())) return
      return data.push(mintAddress)
    })
    return onChange(data)
  }, [keyword, onChange, tokenProvider, mintAddresses])

  useEffect(() => {
    search()
  }, [search])

  return (
    <Card className="card-child" bodyStyle={{ padding: 8 }} bordered={false}>
      <Input
        placeholder="Search"
        value={keyword}
        size="small"
        bordered={false}
        suffix={
          <Button
            type="text"
            style={{ marginRight: -7 }}
            size="small"
            onClick={keyword ? () => setKeyword('') : () => {}}
            icon={
              <IonIcon name={keyword ? 'close-outline' : 'search-outline'} />
            }
            disabled={disabled}
          />
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKeyword(e.target.value)
        }
        disabled={disabled}
      />
    </Card>
  )
}

export default Search
