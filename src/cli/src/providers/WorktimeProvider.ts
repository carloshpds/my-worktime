import * as moment from 'moment'

import ClockHelper from '../utils/ClockHelper/index.js'
import { WorktimeDayMark, WorktimeDayResume, WorktimeDayWorkedTime, WorktimeProviderOptions } from './types.js'

export default abstract class WorktimeProvider {
  [prop: string]: any
  marks: WorktimeDayMark[] = []

  options: WorktimeProviderOptions

  urls: {
    [prop: string]: any;
    getDayResume: null | string;
  } = { getDayResume: null };

  constructor(options: WorktimeProviderOptions) {
    this.options = options
  }

  static buildOptions(options: Partial<WorktimeProviderOptions>): WorktimeProviderOptions {
    const defaultOptions: WorktimeProviderOptions = {
      companyId: '',
      date: '',
      debug: false,
      journeyTime: '',
      momentDate: moment(),
      password: '',
      systemId: '',
      useMocks: false,
      userId: '',
    }

    return Object.assign(defaultOptions, options)
  }

  calculateBreakMinutes(marks: WorktimeDayMark[] = this.marks) {
    let minutes = 0

    for (const [index, mark] of marks.entries()) {
      const isStartingPeriod = index % 2 === 0
      if (index >= 2 && isStartingPeriod) {
        const currentMarkInMinutes = ClockHelper.convertClockStringToMinutes(mark.clock)
        const lastMarkInMinutes = ClockHelper.convertClockStringToMinutes(marks[index - 1].clock)
        minutes += currentMarkInMinutes - lastMarkInMinutes
      }

      mark.clock; continue;
    }

    return minutes
  }

  calculateWorkedTimeMinutes(marks: WorktimeDayMark[] = this.marks, date: string = this.options.date): WorktimeDayWorkedTime {
    let registeredWorkedMinutes = 0
    let workedMinutesUntilNow = 0
    const now = moment()

    for (const [index, mark] of marks.entries()) {
      const isClosingPeriod = index % 2 === 1
      if (isClosingPeriod) {
        const currentMarkInMinutes = ClockHelper.convertClockStringToMinutes(mark.clock)
        const lastMarkInMinutes = ClockHelper.convertClockStringToMinutes(marks[index - 1].clock)
        registeredWorkedMinutes += currentMarkInMinutes - lastMarkInMinutes
      }

      mark.clock; continue;
    }

    const lastPeriodIsOpen: boolean = this.isMissingMark(marks)
    const breakMinutes = this.calculateBreakMinutes(marks)
    const todayIsTheCurrentDate = moment(date).isSame(now, 'day')
    const nowClock = now.format('HH:mm')

    if (lastPeriodIsOpen && todayIsTheCurrentDate) {
      const lastStartingPeriodMarkMinutes = ClockHelper.convertClockStringToMinutes(marks.at(-1).clock)
      this.options.debug && console.log('nowClock', nowClock)

      let partialWorkedMinutesUntilNow = ClockHelper.convertClockStringToMinutes(nowClock)
      partialWorkedMinutesUntilNow -= lastStartingPeriodMarkMinutes

      workedMinutesUntilNow = partialWorkedMinutesUntilNow + registeredWorkedMinutes
    } else if (registeredWorkedMinutes) {
      workedMinutesUntilNow = registeredWorkedMinutes
    }

    const journeyTimeInMinutes = ClockHelper.convertClockStringToMinutes(this.options.journeyTime as string)

    const shouldLeaveMarks: WorktimeDayMark[] = ([] as WorktimeDayMark[]).concat(marks)
    if (lastPeriodIsOpen && registeredWorkedMinutes > journeyTimeInMinutes) {
      shouldLeaveMarks.pop()
    }

    let missingMinutesToCompleteJourney = journeyTimeInMinutes - registeredWorkedMinutes
    const minutesFromTheLastMark = ClockHelper.convertClockStringToMinutes(shouldLeaveMarks.at(-1).clock)
    const breakMinutesToCalculateShouldLeaveClockTime = breakMinutes > 60 && registeredWorkedMinutes > journeyTimeInMinutes && !lastPeriodIsOpen ? breakMinutes - 60 : 0
    const shouldLeaveClockTime = ClockHelper.humanizeMinutesToClock((minutesFromTheLastMark + missingMinutesToCompleteJourney) - breakMinutesToCalculateShouldLeaveClockTime)

    if (lastPeriodIsOpen) {
      missingMinutesToCompleteJourney = journeyTimeInMinutes - workedMinutesUntilNow
    }

    return {
      breakMinutes,
      isMissingPairMark: lastPeriodIsOpen,
      journeyTimeInMinutes,
      marks,
      missingMinutesToCompleteJourney,
      now,
      registeredWorkedMinutes,
      shouldLeaveClockTime,
      workedMinutesUntilNow,
    }
  }

  calculateWorktimeDayResume(marks: WorktimeDayMark[] = this.marks, date: string = this.options.date): WorktimeDayResume {
    let worktimeDayResume: WorktimeDayResume = {
      breakMinutes: 0,
      isMissingPairMark: false,
      marks,
      missingMinutesToCompleteJourney: 0,
      registeredWorkedMinutes: 0,
      workedMinutesUntilNow: 0
    }

    if (marks.length > 0) {
      worktimeDayResume = this.calculateWorkedTimeMinutes(marks, date)
    }

    return worktimeDayResume
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getWorktimeDayResume(requestOptions?: any): Promise<WorktimeDayResume> {
    try {
      this.marks = await this.getDateMarks()
      const worktimeDayResume: WorktimeDayResume = this.calculateWorktimeDayResume(this.marks)
      return worktimeDayResume
    } catch (error) {
      throw error
    }
  }

  isMissingMark(marks = this.marks): boolean {
    return marks.length > 0 && marks.length % 2 === 1
  }

  abstract getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]>
}
