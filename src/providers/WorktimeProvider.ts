import { WorktimeProviderOptions, WorktimeDayMark, WorktimeDayResume, WorktimeDayWorkedTime } from "./types"
import * as moment from "moment"
import ClockHelper from "../utils/ClockHelper"
import calculateShouldLeaveClockTime from "../hackaton/calculateShouldLeaveClockTime"

export default abstract class WorktimeProvider {
  name: string
  options: WorktimeProviderOptions
  marks: WorktimeDayMark[] = []
  urls: {
    getDayResume: string
    [prop: string]: any
  }
  [prop: string]: any

  abstract getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]>

  constructor(options: WorktimeProviderOptions){
    this.options = options
  }

  async getWorktimeDayResume(requestOptions?: any): Promise<WorktimeDayResume> {
    try {
      this.marks = await this.getDateMarks()
      const worktimeDayResume: WorktimeDayResume = this.calculateWorktimeDayResume(this.marks)
      return worktimeDayResume
    } catch (err) {
      throw err
    }
  }

  calculateBreakMinutes(marks: WorktimeDayMark[] = this.marks) {
    let minutes = 0

    marks.forEach((mark, index) => {
      const isStartingPeriod = index % 2 === 0
      if(index >= 2 && isStartingPeriod){
        const currentMarkInMinutes = ClockHelper.convertClockStringToMinutes(mark.clock)
        const lastMarkInMinutes = ClockHelper.convertClockStringToMinutes(marks[index - 1].clock)
        minutes += currentMarkInMinutes - lastMarkInMinutes
      }
      return mark.clock
    })

    return minutes
  }

  getHoursBetweenStartAndDesired(hour: any, marks: WorktimeDayMark[]) {
    const momentMark = moment(hour, 'hh:mm')
    return marks.filter(item => {
      return moment(momentMark).isAfter(moment(item.clock, 'hh:mm'))
    })
  }

  calculateWorkedTimeMinutes(marks: WorktimeDayMark[] = this.marks, date: string = this.options.date): WorktimeDayWorkedTime {
    let registeredWorkedMinutes = 0
    let workedMinutesUntilNow = 0
    let now = moment()

    marks.forEach((mark, index) => {
      const isClosingPeriod = index % 2 === 1
      if(isClosingPeriod){
        const currentMarkInMinutes = ClockHelper.convertClockStringToMinutes(mark.clock)
        const lastMarkInMinutes = ClockHelper.convertClockStringToMinutes(marks[index - 1].clock)
        registeredWorkedMinutes += currentMarkInMinutes - lastMarkInMinutes
      }
      return mark.clock
    })

    const lastPeriodIsOpen = this.isMissingMark(marks)
    const breakMinutes = this.calculateBreakMinutes(marks)
    const todayIsTheCurrentDate = moment(date).isSame(now, 'day')
    const nowClock = now.format('HH:mm')

    if(lastPeriodIsOpen && todayIsTheCurrentDate){
      const lastStartingPeriodMarkMinutes = ClockHelper.convertClockStringToMinutes(marks[marks.length - 1].clock)
      this.options.debug && console.log('nowClock', nowClock)

      let partialWorkedMinutesUntilNow = ClockHelper.convertClockStringToMinutes(nowClock)
      partialWorkedMinutesUntilNow -= lastStartingPeriodMarkMinutes

      workedMinutesUntilNow = partialWorkedMinutesUntilNow + registeredWorkedMinutes
    } else if (registeredWorkedMinutes) {
      workedMinutesUntilNow = registeredWorkedMinutes
    }

    const journeyTimeInMinutes = ClockHelper.convertClockStringToMinutes(this.options.journeyTime)

    return {
      registeredWorkedMinutes,
      workedMinutesUntilNow,
      isMissingPairMark: lastPeriodIsOpen,
      // shouldLeaveClockTime,
      breakMinutes,
      journeyTimeInMinutes,
      now
    }
  }

  calculateWorktimeDayResume(marks: WorktimeDayMark[] = this.marks, date: string = this.options.date): WorktimeDayResume {
    const worktimeDayResume: WorktimeDayResume = this.calculateWorkedTimeMinutes(marks, date)
    return worktimeDayResume
  }

  isMissingMark(marks = this.marks){
    return marks.length && marks.length % 2 === 1
  }
}
