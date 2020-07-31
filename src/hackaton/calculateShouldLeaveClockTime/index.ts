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

interface WorkPeriod {
  start: string,
  end: string,
  worked: number,
  auto: boolean,
  hit: boolean,
  overTimingMinutes: number,
  endJourneyAt: string
}

/**
 * Implementation
 */
export default ({ marks, journeyTimeInMinutes }: LeaveClockTimeParams): string => {
  const periods: Array<WorkPeriod> = joinMarksToPeriod(marks, [])

  if (periods.length == 1) {
    return moment(periods[0].start, 'HH:mm')
      .add(journeyTimeInMinutes, 'minutes')
      .format('HH:mm')
  }

  const workPeriods = setUpEndJourneyAt(periods, journeyTimeInMinutes)
  const time = calculateWorkedTime(workPeriods)

  let lastHit
  if (lastHit = workPeriods.find(it => it.endJourneyAt)) {
    return lastHit.endJourneyAt
  } else {
    const res = journeyTimeInMinutes - time
    const tail = workPeriods[workPeriods.length - 1]
    
    return moment(tail.start, 'HH:mm')
      .add(tail.worked + res, 'minutes')
      .format('HH:mm')
  }
}

function joinMarksToPeriod(marks: any[], tuples: Array<WorkPeriod>) {
  const [
    a, 
    b = { clock: '23:59', auto: true }, 
    ...rest
  ] = marks

  const newTuples = [...tuples, toWorkPeriod(a, b)]

  if (rest.length <= 0) {
    return newTuples
  } else {
    return joinMarksToPeriod(rest, newTuples)
  }
}

function setUpEndJourneyAt(marks: Array<WorkPeriod>, journey: number): Array<WorkPeriod> {
  marks.reduce((current, data) => {
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

  return marks
}

function toWorkPeriod(a: WorktimeDayMark, b: any) {
  return { 
    start: a.clock, 
    end: b.clock, 
    worked: moment(b.clock, "HH:mm").diff(moment(a.clock, "HH:mm"), 'minutes'), 
    auto: b.auto,
    hit: false,
    endJourneyAt: '',
    overTimingMinutes: 0
  }
}

function calculateWorkedTime(marks: Array<WorkPeriod>): number {
  return marks.reduce((current, data) => data.worked + current, 0)
}
