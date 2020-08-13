/**
 * Imports
 */
import * as moment from "moment"
import { Moment } from "moment"
import { WorktimeDayMark } from "../../providers/types"
import ClockHelper from "../../utils/ClockHelper"


/**
 * Types
 */
interface LeaveClockTimeParams {
  journeyTimeInMinutes: number, // Quantidade de minutos a serem trabalhados por dia
  registeredWorkedMinutes: number, // Quantidade de minutos já trabalhados no dia
  workedMinutesUntilNow: number, // Quantidade de minutos que seriam computados como trabalhados caso o usuário batesse o ponto agora
  breakMinutes: number, // Quantidade de minutos relacionados a intervalos (almoço, café e etc...)
  isMissingPairMark: boolean, // Há batidas ímpares?
  marks: WorktimeDayMark[], // Batidas do ponto do usuário
  now: Moment // Abstração do Moment para o relógio neste exato momento
}

/**
 * Implementation
 */
const getHoursBetweenStartAndDesired = (hour: any, marks: WorktimeDayMark[]) => {
  const momentMark = moment(hour, 'hh:mm')
  return marks.filter(item => {
    return moment(momentMark).isAfter(moment(item.clock, 'hh:mm'))
  })
}
​
export default (data: LeaveClockTimeParams): string => {
  const { journeyTimeInMinutes, marks, now } = data
  let registeredWorkedMinutes = 0
​
    marks.forEach((mark, index) => {
      const isClosingPeriod = index % 2 === 1
      if (isClosingPeriod) {
        const currentMarkInMinutes = ClockHelper.convertClockStringToMinutes(mark.clock)
        const lastMarkInMinutes = ClockHelper.convertClockStringToMinutes(marks[index - 1].clock)
        registeredWorkedMinutes += currentMarkInMinutes - lastMarkInMinutes
      }
      return mark.clock
    })
​
    let missingJourneyMinutes = journeyTimeInMinutes - registeredWorkedMinutes
    let shouldLeaveClockTime = null
​
    const firstMarkInMinutes = ClockHelper.convertClockStringToMinutes(marks[0].clock)
    const lastMarkInMinutes = ClockHelper.convertClockStringToMinutes(marks[marks.length - 1].clock)
​
    const shouldStopWithoutBreaks = firstMarkInMinutes + journeyTimeInMinutes
    const hour = ClockHelper.humanizeMinutesToClock(shouldStopWithoutBreaks)
​
    const newMarks = getHoursBetweenStartAndDesired(hour, marks)
    const breaks = ClockHelper.calculateBreakMinutes(newMarks.length % 2 === 1 ? newMarks : marks)

    const sum = missingJourneyMinutes !== 0 ? shouldStopWithoutBreaks + breaks : lastMarkInMinutes
    shouldLeaveClockTime = ClockHelper.humanizeMinutesToClock(sum)
​
    return shouldLeaveClockTime
}
