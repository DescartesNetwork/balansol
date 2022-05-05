import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import configs from 'app/configs'

const {
  manifest: { appId },
} = configs
const APP_ROUTE = `/app/${appId}`

export const useAppRouter = () => {
  const { search, pathname } = useLocation()
  const history = useHistory()

  const query = useMemo(() => {
    return new URLSearchParams(search)
  }, [search])

  const getQuery = useCallback((queryId: string) => query.get(queryId), [query])

  const pushHistory = useCallback(
    (url: string) => history.push(`${APP_ROUTE}${url}`),
    [history],
  )

  return { getQuery, pushHistory, appRoute: APP_ROUTE, pathname }
}
