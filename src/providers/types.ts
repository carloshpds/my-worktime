import { Moment } from "moment";

export interface WorktimeDayWorkedTime {
  registeredWorkedMinutes: number
  workedMinutesUntilNow: number
  shouldLeaveClockTime?: string
  isMissingPairMark: boolean
  breakMinutes: number
}

export interface WorktimeDayResume {
  registeredWorkedMinutes: number
  workedMinutesUntilNow: number
  breakMinutes: number
  shouldLeaveClockTime?: string
  isMissingPairMark: boolean
}

export interface WorktimeDayMark {
  clock: string
}

export interface WorktimeProviderOptions {
  userId: string
  password: string
  companyId: string
  systemId: string
  date: string
  momentDate: Moment
  debug?: boolean
  journeyTime?: string // Clock time HH:mm
}