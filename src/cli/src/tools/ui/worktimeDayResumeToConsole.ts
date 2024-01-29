import { ux } from "@oclif/core"

import { WorktimeDayResume } from "../../providers/types.js"
import { translate } from "../i18n/index.js"
import { prepareMarksToConsole } from "./marksToConsole.js"

export const prepareWorktimeDayResumeToConsole = (worktimeDayResume: WorktimeDayResume): string[] => {
  const marksToConsole = prepareMarksToConsole(worktimeDayResume.marks)
  return marksToConsole
}

export const showTheShouldLeaveClockTime = (worktimeDayResume: WorktimeDayResume): void => {
  if (worktimeDayResume.shouldLeaveClockTime) {
    const journeyTimeMessage = translate('cli.hit.calc.journeyTime', {
      clockTime: ux.colorize('bgCyan', ' ' + worktimeDayResume.journeyTime + ' ')
    })

    const shouldLeaveClockTimeMessage = translate('cli.hit.calc.shouldLeaveClockTime', {
      clockTime: ux.colorize('bgGreen', ' ' + worktimeDayResume.shouldLeaveClockTime + ' ')
    })


    ux.info(`⏳ ${journeyTimeMessage}`)
    ux.info(`✨ ${shouldLeaveClockTimeMessage}`)
  }
}