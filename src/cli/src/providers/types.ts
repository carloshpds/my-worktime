import { Moment } from 'moment'

export interface WorktimeDayWorkedTime {
  breakMinutes: number;
  isMissingPairMark: boolean;
  journeyTimeInMinutes: number;
  marks: WorktimeDayMark[];
  missingMinutesToCompleteJourney: number;
  now: Moment;
  registeredWorkedMinutes: number;
  shouldLeaveClockTime: string;
  workedMinutesUntilNow: number;
}

export interface WorktimeDayResume {
  breakMinutes: number;
  isMissingPairMark: boolean;
  marks: WorktimeDayMark[];
  missingMinutesToCompleteJourney: number;
  registeredWorkedMinutes: number;
  shouldLeaveClockTime?: string;
  workedMinutesUntilNow: number;
}

export interface WorktimeDayMark {
  clock: string;
  correction?: {
    approved: boolean,
    approvedBy?: string
    date: string,
    reason?: string,
  },
}

export interface WorktimeProviderOptions {
  companyId: string;
  date: string;
  debug?: boolean;
  journeyTime?: string; // Clock time HH:mm
  momentDate: Moment | undefined;
  password: string;
  systemId: string;
  useMocks?: boolean;
  userId: string;
}
