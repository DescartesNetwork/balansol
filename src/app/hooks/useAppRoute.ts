import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

export const useAppRouter = () => {
  const location = useLocation()
  const history = useHistory()

  const query = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  const getQuery = useCallback((queryId: string) => query.get(queryId), [query])

  const appRoute = useMemo(() => `/app/${appId}`, [])

  const pushHistory = useCallback(
    (url: string) => history.push(`${appRoute}${url}`),
    [appRoute, history],
  )

  return { getQuery, pushHistory, appRoute }
}
