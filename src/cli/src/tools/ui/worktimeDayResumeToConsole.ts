import { ux } from "@oclif/core"

import { WorktimeDayResume } from "../../providers/types.ts"
import { translate } from "../i18n/index.ts"
import { prepareMarksToConsole } from "./marksToConsole.ts"

export const prepareWorktimeDayResumeToConsole = (worktimeDayResume: WorktimeDayResume): string[] => {
  const marksToConsole = prepareMarksToConsole(worktimeDayResume.marks)
  return marksToConsole
}

export const showTheShouldLeaveClockTime = (worktimeDayResume: WorktimeDayResume): void => {
  // ux.info(`\nSeu horário de saída ideal é ${ux.colorize('bgGreen', ' ' + worktimeDayResume.shouldLeaveClockTime + ' ')}`)
  if (worktimeDayResume.shouldLeaveClockTime) {
    const journeyTimeMessage = translate('cli.hit.calc.journeyTime', {
      clockTime: ux.colorize('bgCyan', ' ' + worktimeDayResume.journeyTime + ' ')
    })

    const shouldLeaveClockTimeMessage = translate('cli.hit.calc.shouldLeaveClockTime', {
      clockTime: ux.colorize('bgGreen', ' ' + worktimeDayResume.shouldLeaveClockTime + ' ')
    })


    ux.info(`\n⏳ ${journeyTimeMessage}`)
    ux.info(`✨ ${shouldLeaveClockTimeMessage}`)
  }
}