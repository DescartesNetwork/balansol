type MintAddress = string

export function getTokenRoute(): Map<MintAddress, Map<MintAddress, string>> {
  const tokenRoute = new Map()
  return tokenRoute
}
