import { WorktimeDayMark } from '../../providers/types.js'

class ClockHelper {
  debug: boolean | undefined = false

  calculateBreakMinutes(marks: WorktimeDayMark[]) {
    let minutes = 0

    for (const [index, mark] of marks.entries()) {
      const isStartingPeriod = index % 2 === 0
      if (index >= 2 && isStartingPeriod) {
        const currentMarkInMinutes = this.convertClockStringToMinutes(mark.clock)
        const lastMarkInMinutes = this.convertClockStringToMinutes(marks[index - 1].clock)
        minutes += currentMarkInMinutes - lastMarkInMinutes
      }

      mark.clock; continue;
    }

    return minutes
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  convertClockStringToMinutes(hourString: string, options = { considerSeconds: false }) {
    const formatedHourString = hourString.replaceAll(':', '')
    const hoursAsMinutes = Number.parseInt(formatedHourString.slice(0, 2), 10) * 60
    const tailMinutes = Number.parseInt(formatedHourString.slice(2), 10)
    return hoursAsMinutes + tailMinutes
  }

  formatClockString(clock: string): string {
    clock = clock.replaceAll(':', '')

    if (clock.length !== 4) {
      throw new Error('[formatClockString]: Invalid clock format, use: HHmm')
    }

    return [clock.slice(0, 2), ':', clock.slice(2)].join('')
  }

  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  humanizeMinutesToClock(minutes: number | string, options = { separator: ':' }): string {
    const minutesNumber = typeof minutes === 'number' ? Math.abs(minutes) : Math.abs(Number.parseInt(minutes, 10))
    const realHoursNumbers = Math.floor(minutesNumber / 60)
    const realMinutes = minutesNumber % 60

    const humanizedHours = String(realHoursNumbers).padStart(2, '0')
    const humanizedMinutes = String(realMinutes).padStart(2, '0')

    return `${humanizedHours}${options.separator}${humanizedMinutes}`
  }
}

export default new ClockHelper()
