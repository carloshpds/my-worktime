import { BooleanNumber } from "@/apps/shared/extras/gc/types/BooleanNumber";

export type GCMatchType = "lobby" | "ranked"

export interface GCMonthMatch {
  id: number | string
  map: string
  ratingDiff: number
  ratingPlayer: number
  scoreA: number
  scoreB: number
  teamNameA: string
  teamNameB: string
  type: GCMatchType
  win: BooleanNumber
}