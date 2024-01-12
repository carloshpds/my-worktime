import { ux } from '@oclif/core'
import moment from 'moment'

import ClockHelper from '../tools/ClockHelper/index.ts'
import localSettingsManager from '../tools/LocalSettingsManager/index.ts'
import { isMissingPairMark } from '../utils/isMissingPairMark.ts'
import { validateRunningDate } from '../utils/validateDateOption.ts'
import { WorktimeDayMark, WorktimeDayResume, WorktimeDayWorkedTime, WorktimeProviderOptions } from './types.ts'

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

  static buildOptions(runtimeOptions: Partial<WorktimeProviderOptions>): WorktimeProviderOptions {
    validateRunningDate(runtimeOptions.date as string)

    const options: WorktimeProviderOptions = {
      companyId: '',
      date: '',
      debug: Boolean(process.env.DEBUG) || false,
      journeyTime: '',
      momentDate: moment(),
      password: '',
      systemId: '',
      useMocks: false,
      userId: '',
    }

    Object.assign(options, runtimeOptions)
    options.momentDate = options.date ? moment(options.date) : undefined;

    options.debug && console.table({ ...options, momentDate: undefined, password: '***' })
    localSettingsManager.settings.set('options.isDebugEnabled', runtimeOptions.debug)
    return options
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

    const lastMark = marks[marks.length - 1];
    if (lastPeriodIsOpen && todayIsTheCurrentDate && marks.length > 0 && lastMark) {
      const lastStartingPeriodMarkMinutes = ClockHelper.convertClockStringToMinutes(lastMark.clock)
      this.options.debug && ux.log(`\nHorário atual ${ux.colorize('bgCyan', nowClock)}`)

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
    const missinPairMark = shouldLeaveMarks[shouldLeaveMarks.length - 1]
    const minutesFromTheLastMark = ClockHelper.convertClockStringToMinutes(missinPairMark?.clock || 'ERROR')
    const breakMinutesToCalculateShouldLeaveClockTime = breakMinutes > 60 && registeredWorkedMinutes > journeyTimeInMinutes && !lastPeriodIsOpen ? breakMinutes - 60 : 0
    const shouldLeaveMinutes = (minutesFromTheLastMark + missingMinutesToCompleteJourney) - breakMinutesToCalculateShouldLeaveClockTime
    const shouldLeaveClockTime = ClockHelper.humanizeMinutesToClock(shouldLeaveMinutes)

    this.options.debug && console.table({
      breakMinutes,
      breakMinutesToCalculateShouldLeaveClockTime,
      journeyTimeInMinutes,
      minutesFromTheLastMark,
      missinPairMark,
      missinPairMarkClock: missinPairMark?.clock,
      missingMinutesToCompleteJourney,
      registeredWorkedMinutes,
      shouldLeaveClockTime,
      shouldLeaveMinutes,
    })

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
    const worktimeDayResume: WorktimeDayResume = {
      breakMinutes: 0,
      isMissingPairMark: false,
      journeyTime: this.options.journeyTime as string,
      marks,
      missingMinutesToCompleteJourney: 0,
      registeredWorkedMinutes: 0,
      workedMinutesUntilNow: 0,
    }

    if (marks.length > 0) {
      const workedDayResume = this.calculateWorkedTimeMinutes(marks, date)
      Object.assign(worktimeDayResume, workedDayResume)
    }

    return worktimeDayResume
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getWorktimeDayResume(requestOptions?: any): Promise<WorktimeDayResume> {
    this.marks = await this.getDateMarks()
    const worktimeDayResume: WorktimeDayResume = this.calculateWorktimeDayResume(this.marks)
    return worktimeDayResume
  }

  isMissingMark(marks = this.marks): boolean {
    return isMissingPairMark(marks)
  }

  abstract getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]>
}
