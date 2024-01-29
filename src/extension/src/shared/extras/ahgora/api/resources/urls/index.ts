type UserId = string | number;
export const ahgoraSiteUrl = window.location.hostname === 'localhost' ? 'https://www.ahgora.com.br/' : window.location.origin

export const ahgoraPages = {
  mirror: `${ahgoraSiteUrl}/mirror`,
}

export const gcUrls = {
  player(userId: UserId){
    return `${ahgoraSiteUrl}/player/${userId}`
  },

  match(matchId: string | number){
    return `${ahgoraSiteUrl}/lobby/match/${matchId}`
  },

  boxInitialMatches(userId: UserId) {
    return `${ahgoraSiteUrl}/api/box/init/${userId}`
  },

  boxMatchesHistory(userId: UserId){
    return `${ahgoraSiteUrl}/api/box/history/${userId}`
  },
}

export const ahgoraAssetsUrls = {
}