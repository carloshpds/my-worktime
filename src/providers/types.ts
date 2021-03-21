import {Moment} from 'moment'

export interface WorktimeDayWorkedTime {
  journeyTimeInMinutes: number;
  registeredWorkedMinutes: number;
  workedMinutesUntilNow: number;
  shouldLeaveClockTime: string;
  isMissingPairMark: boolean;
  breakMinutes: number;
  now: Moment;
  marks: WorktimeDayMark[];
  missingMinutesToCompleteJourney: number;
}

export interface WorktimeDayResume {
  registeredWorkedMinutes: number;
  workedMinutesUntilNow: number;
  missingMinutesToCompleteJourney: number;
  breakMinutes: number;
  shouldLeaveClockTime?: string;
  isMissingPairMark: boolean;
  marks: WorktimeDayMark[];
}

export interface WorktimeDayMark {
  clock: string;
  correction?: {
    date: string,
    reason?: string,
    approved: boolean,
    approvedBy?: string
  },
}

export interface WorktimeProviderOptions {
  userId: string;
  password: string;
  companyId: string;
  systemId: string;
  date: string;
  momentDate: Moment;
  debug?: boolean;
  journeyTime?: string; // Clock time HH:mm
  useMocks?: boolean;
}
