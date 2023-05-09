import { GCMonthMatch } from "./GCMonthMatch";

export interface GCPlayerStatsHistory {
  character: {
    totalHits: number,
    hitbox: {
      chest: number,
      head: number,
      leftArm: number,
      leftLeg: number,
      rightArm: number
    },
  },

  matches: {
    loss: number,
    matches: number,
    wins: number
  },

  monthMatches: GCMonthMatch[],
  months: string[],

  monthRating: {
    max: number,
    min: number,
  },

  stat: { stat: string, diff?: string, value: string }[]
}

