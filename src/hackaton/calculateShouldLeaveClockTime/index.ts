/**
 * Imports
 */
import * as moment from "moment"
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
  now: any // Abstração do Moment para o relógio neste exato momento
}

/**
 * Implementation
 */
export default ({ marks, journeyTimeInMinutes }: LeaveClockTimeParams): string => {
  const markPairs = toPairs(marks, [])

  if (markPairs.length == 1) {
    return moment(markPairs[0].start, 'HH:mm')
      .add(journeyTimeInMinutes, 'minutes')
      .format('HH:mm')
  }

  const worked = findJourneyCompletedPair(markPairs, journeyTimeInMinutes)

  const a = markPairs.find(it => it.endJourneyAt)

  if (a) {
    return a.endJourneyAt
  } else {
    const res = journeyTimeInMinutes - worked
    const tail = markPairs[markPairs.length - 1]
    
    return moment(tail.start, 'HH:mm')
      .add(tail.worked + res, 'minutes')
      .format('HH:mm')
  }
}

function toPairs(marks: any[], tuples: Array<any>) {
  const [
    a, 
    b = { clock: '23:59', auto: true }, 
    ...rest
  ] = marks

  const aTime = moment(a.clock, "HH:mm")
  const bTime = moment(b.clock, "HH:mm")

  const _tuples = [...tuples, { start: a.clock, end: b.clock, worked: bTime.diff(aTime, 'minutes'), auto: b.auto }]

  if (rest.length <= 0) {
    return _tuples
  } else {
    return toPairs(rest, _tuples)
  }
}

function findJourneyCompletedPair(marks: Array<any>, journey: number): number {
  return marks.reduce((current, data) => {
    let newCurrent = current

    if (data.auto) {
      const missing = journey - newCurrent
      
      data.hit = true
      data.overTimingMinutes = 0
      data.endJourneyAt = moment(data.start, "HH:mm")
        .add(missing, 'minutes')
        .format('HH:mm')
    } else {
      newCurrent = data.worked + newCurrent
      const overTime = newCurrent - journey

      if (newCurrent >= journey) {
        data.hit = true
        data.overTimingMinutes = overTime
        data.endJourneyAt = moment(data.end, "HH:mm")
          .subtract(overTime, 'minutes')
          .format('HH:mm')
      }
    }

    return newCurrent
  }, 0)
}
