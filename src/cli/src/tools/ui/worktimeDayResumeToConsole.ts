import { ux } from "@oclif/core"

import { WorktimeDayResume } from "../../providers/types.ts"
import { prepareMarksToConsole } from "./marksToConsole.ts"

export const prepareWorktimeDayResumeToConsole = (worktimeDayResume: WorktimeDayResume): string[] => {
  const marksToConsole = prepareMarksToConsole(worktimeDayResume.marks)
  return marksToConsole
}

export const showTheShouldLeaveClockTime = (worktimeDayResume: WorktimeDayResume): void => {
  ux.info(`\nSeu horário de saída ideal é ${ux.colorize('bgGreen', ' ' + worktimeDayResume.shouldLeaveClockTime + ' ')}`)
}