import { Provider } from 'react-redux'
import {
  MintProvider,
  AccountProvider,
  PoolProvider,
  AntdProvider,
} from '@sentre/senhub'

import View from 'view'

import model from 'model'
import configs from 'configs'

import 'static/styles/light.less'
import 'static/styles/dark.less'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <AntdProvider appId={appId} prefixCls={appId}>
      <AccountProvider>
        <MintProvider>
          <PoolProvider>
            <Provider store={model}>
              <View />
            </Provider>
          </PoolProvider>
        </MintProvider>
      </AccountProvider>
    </AntdProvider>
  )
}

export * from 'static.app'
