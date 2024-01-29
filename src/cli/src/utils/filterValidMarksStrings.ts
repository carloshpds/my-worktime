import { ux } from "@oclif/core"
import moment from "moment"

import { WorktimeDayMark } from "../providers/types.js"
import { translate } from "../tools/i18n/index.js"

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

    const actionMessage = ux.colorize('bgYellow', ` ${translate('cli.common.display.ignoredMark').toUpperCase()} `)

    const errorsMessages = {
      duplicatedMark: translate('cli.common.errors.duplicatedMark', {
        date,
        mark: newMark
      }),
      invalidMarkTime: translate('cli.common.errors.invalidMarkTime'),
      markInTheFuture: translate('cli.common.errors.markInTheFuture', {
        mark: newMark,
      })
    }

    if (!/^\d{2}:\d{2}$/.test(newMark)) {
      ux.log(`${actionMessage} ${errorsMessages.invalidMarkTime}`)
      validClock = false
    } else if (date && !ignoreDateCases) {
      if (date && moment().isBefore(moment(`${date} ${newMark}`, 'YYYY-MM-DD HH:mm'))) {
        ux.log(`${actionMessage} ${errorsMessages.markInTheFuture}`)
        validClock = false
      } else if (isRegistered && date) {
        ux.log(`${actionMessage} ${errorsMessages.duplicatedMark}`)
        validClock = false
      }
    }

    return validClock
  })

  return validNewMarks
}