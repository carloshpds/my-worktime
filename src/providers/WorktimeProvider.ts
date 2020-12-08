import {WorktimeProviderOptions, WorktimeDayMark, WorktimeDayResume, WorktimeDayWorkedTime} from './types'
import * as moment from 'moment'
import ClockHelper from '../utils/ClockHelper'

export default abstract class WorktimeProvider {
  marks: WorktimeDayMark[] = []

  urls: {
    getDayResume: string | null;
    [prop: string]: any;
  } = {getDayResume: null};

  [prop: string]: any

  abstract getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]>

  constructor(options: WorktimeProviderOptions) {
    this.options = options
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

  calculateBreakMinutes(marks: WorktimeDayMark[] = this.marks) {
    let minutes = 0

    marks.forEach((mark, index) => {
      const isStartingPeriod = index % 2 === 0
      if (index >= 2 && isStartingPeriod) {
        const currentMarkInMinutes = ClockHelper.convertClockStringToMinutes(mark.clock)
        const lastMarkInMinutes = ClockHelper.convertClockStringToMinutes(marks[index - 1].clock)
        minutes += currentMarkInMinutes - lastMarkInMinutes
      }
      return mark.clock
    })

    return minutes
  }

  calculateWorkedTimeMinutes(marks: WorktimeDayMark[] = this.marks, date: string = this.options.date): WorktimeDayWorkedTime {
    let registeredWorkedMinutes = 0
    let workedMinutesUntilNow = 0
    const now = moment()

    marks.forEach((mark, index) => {
      const isClosingPeriod = index % 2 === 1
      if (isClosingPeriod) {
        const currentMarkInMinutes = ClockHelper.convertClockStringToMinutes(mark.clock)
        const lastMarkInMinutes = ClockHelper.convertClockStringToMinutes(marks[index - 1].clock)
        registeredWorkedMinutes += currentMarkInMinutes - lastMarkInMinutes
      }
      return mark.clock
    })

    const lastPeriodIsOpen: boolean = this.isMissingMark(marks)
    const breakMinutes = this.calculateBreakMinutes(marks)
    const todayIsTheCurrentDate = moment(date).isSame(now, 'day')
    const nowClock = now.format('HH:mm')

    if (lastPeriodIsOpen && todayIsTheCurrentDate) {
      const lastStartingPeriodMarkMinutes = ClockHelper.convertClockStringToMinutes(marks[marks.length - 1].clock)
      this.options.debug && console.log('nowClock', nowClock)

      let partialWorkedMinutesUntilNow = ClockHelper.convertClockStringToMinutes(nowClock)
      partialWorkedMinutesUntilNow -= lastStartingPeriodMarkMinutes

      workedMinutesUntilNow = partialWorkedMinutesUntilNow + registeredWorkedMinutes
    } else if (registeredWorkedMinutes) {
      workedMinutesUntilNow = registeredWorkedMinutes
    }

    const journeyTimeInMinutes = ClockHelper.convertClockStringToMinutes(this.options.journeyTime)

    const shouldLeaveMarks: WorktimeDayMark[] = ([] as WorktimeDayMark[]).concat(marks)
    if (lastPeriodIsOpen && registeredWorkedMinutes > journeyTimeInMinutes) {
      shouldLeaveMarks.pop()
    }

    let missingMinutesToCompleteJourney = journeyTimeInMinutes - registeredWorkedMinutes
    const minutesFromTheLastMark = ClockHelper.convertClockStringToMinutes(shouldLeaveMarks[shouldLeaveMarks.length - 1].clock)
    const breakMinutesToCalculateShouldLeaveClockTime = breakMinutes > 60 && registeredWorkedMinutes > journeyTimeInMinutes && !lastPeriodIsOpen ? breakMinutes - 60 : 0
    const shouldLeaveClockTime = ClockHelper.humanizeMinutesToClock((minutesFromTheLastMark + missingMinutesToCompleteJourney) - breakMinutesToCalculateShouldLeaveClockTime)

    if(lastPeriodIsOpen){
      missingMinutesToCompleteJourney = journeyTimeInMinutes - workedMinutesUntilNow
    }

    return {
      registeredWorkedMinutes,
      workedMinutesUntilNow,
      isMissingPairMark: lastPeriodIsOpen,
      shouldLeaveClockTime,
      breakMinutes,
      journeyTimeInMinutes,
      missingMinutesToCompleteJourney,
      marks,
      now,
    }
  }

  calculateWorktimeDayResume(marks: WorktimeDayMark[] = this.marks, date: string = this.options.date): WorktimeDayResume {
    let worktimeDayResume: WorktimeDayResume = {
      isMissingPairMark: false,
      registeredWorkedMinutes: 0,
      workedMinutesUntilNow: 0,
      missingMinutesToCompleteJourney: 0,
      breakMinutes: 0,
      marks
    }

    if(marks.length){
      worktimeDayResume = this.calculateWorkedTimeMinutes(marks, date)
    }

    return worktimeDayResume
  }

  isMissingMark(marks = this.marks): boolean {
    return marks.length > 0 && marks.length % 2 === 1
  }
}
