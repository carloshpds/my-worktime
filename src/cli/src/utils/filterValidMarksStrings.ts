import { ux } from "@oclif/core"
import moment from "moment"

import { WorktimeDayMark } from "../providers/types.ts"

export interface FilterValidMarksParams {
  date?: string,
  ignoreDateCases?: boolean,
  marksStrings: string | string[],
  registeredMarks: WorktimeDayMark[],
}

export default ({ date, ignoreDateCases, marksStrings, registeredMarks }: FilterValidMarksParams): string[] => {
  const marksToValidate = typeof marksStrings === 'string' ? marksStrings.split(',') : marksStrings
  const validNewMarks = marksToValidate.filter(newMark => {
    const isRegistered = registeredMarks.find(mark => mark.clock === newMark)
    let validClock = true

    if (!/^\d{2}:\d{2}$/.test(newMark)) {
      ux.log(`${ux.colorize('bgYellow', ' BATIDA IGNORADA ')} ${ux.colorize('blue', newMark)} não está no formato correto (HH:mm)`)
      validClock = false
    } else if (date && !ignoreDateCases) {
      if (date && moment().isBefore(moment(`${date} ${newMark}`, 'YYYY-MM-DD HH:mm'))) {
        ux.log(`${ux.colorize('bgYellow', ' BATIDA IGNORADA ')} ${ux.colorize('blue', newMark)} está no futuro`)
        validClock = false
      } else if (isRegistered && date) {
        ux.log(`${ux.colorize('bgYellow', ' BATIDA IGNORADA ')} ${ux.colorize('blue', newMark)} já está registrada em ${ux.colorize('blue', moment(date).format('L'))} (duplicada)`)
        validClock = false
      }
    }

    return validClock
  })

  return validNewMarks
}