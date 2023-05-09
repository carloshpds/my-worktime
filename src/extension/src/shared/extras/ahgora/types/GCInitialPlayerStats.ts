import { GCMonthMatch } from "./GCMonthMatch";

export interface GCInitialPlayerStats {
  character: {
    totalHits: number;
    hitBox: {
      chest: number,
      head: number,
      leftArm: number,
      leftLeg: number,
      rightArm: number,
      rightLeg: number,
      stomach: number,
    }
  },
  lastMatches: GCMonthMatch[],
  loggedUser: {
    id: number,
    isSubscriber: boolean
  },
  matchesRating: {
    max: number,
    min: number
  },
  playerInfo: {
    calibrationMatches: number
    id: number
    isSubscriber: boolean
    level: number
    nick: string
    rating: number
    statsBackground: {
      id: number,
      image: string,
    }
  }
  stats: { stat: string, diff?: string, value: string }[]
}