import { Moment } from "moment";

export interface WorktimeDayWorkedTime {
  registeredWorkedMinutes: number
  workedMinutesUntilNow: number
}

export interface WorktimeDayResume {
  registeredWorkedMinutes: number
  workedMinutesUntilNow: number
  breakMinutes: number
  shouldLeaveClockTime?: string
  missingPairMark: boolean
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

export interface WorktimeProvider {
  name: string
  options: WorktimeProviderOptions
  urls: Record<string, string>
  getWorktimeDayResume(requestOptions?: any): Promise<WorktimeDayResume>
  getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]>
  [prop: string]: any
}
