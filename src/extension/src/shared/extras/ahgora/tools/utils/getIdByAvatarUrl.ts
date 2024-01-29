export const getIdByAvatarUrl = (avatarUrl: string): string => {
  const matches = avatarUrl.match(/\/[0-9]+\//)
  return matches && matches.length ? matches[0].replace(/\//g, '') : ''
}