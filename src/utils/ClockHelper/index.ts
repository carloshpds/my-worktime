import {WorktimeDayMark} from '../../providers/types'

class ClockHelper {
  debug: boolean | undefined = false

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  convertClockStringToMinutes(hourString: string, options = {considerSeconds: false}) {
    const formatedHourString = hourString.replace(/:/g, '')
    const hoursAsMinutes = parseInt(formatedHourString.substring(0, 2), 10) * 60
    const tailMinutes = parseInt(formatedHourString.substring(2), 10)
    return hoursAsMinutes + tailMinutes
  }

  humanizeMinutesToClock(minutes: number | string, options = {separator: ':'}): string {
    const minutesNumber = typeof minutes === 'number' ? Math.abs(minutes) : Math.abs(parseInt(minutes, 10))
    const realHoursNumbers = Math.floor(minutesNumber / 60)
    const realMinutes = minutesNumber % 60

    const humanizedHours   = String(realHoursNumbers).padStart(2, '0')
    const humanizedMinutes = String(realMinutes).padStart(2, '0')

    return `${humanizedHours}${options.separator}${humanizedMinutes}`
  }

  formatClockString(clock: string): string {
    clock = clock.replace(/:/g, '')

    if (clock.length !== 4) {
      throw new Error('[formatClockString]: Invalid clock format, use: HHmm')
    }

    return [clock.slice(0, 2), ':', clock.slice(2)].join('')
  }

  calculateBreakMinutes(marks: WorktimeDayMark[]) {
    let minutes = 0

    marks.forEach((mark, index) => {
      const isStartingPeriod = index % 2 === 0
      if (index >= 2 && isStartingPeriod) {
        const currentMarkInMinutes = this.convertClockStringToMinutes(mark.clock)
        const lastMarkInMinutes = this.convertClockStringToMinutes(marks[index - 1].clock)
        minutes += currentMarkInMinutes - lastMarkInMinutes
      }
      return mark.clock
    })

    return minutes
  }
}

export default new ClockHelper()
