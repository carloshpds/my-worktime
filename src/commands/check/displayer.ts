import * as chalk from 'chalk'
import { WorktimeDayResume, WorktimeProviderOptions } from '../../providers/types'
import WorktimeProvider from '../../providers/WorktimeProvider'
import ClockHelper from '../../utils/ClockHelper'

export default class CheckDisplayer {
  provider: WorktimeProvider

  constructor(provider: WorktimeProvider){
    this.provider = provider
  }

  displayResult(worktimeDayResume: WorktimeDayResume, options: Partial<WorktimeProviderOptions>){
    const marksToConsole = worktimeDayResume.marks.map((mark, index) => {
      const isLastMark = index === worktimeDayResume.marks.length - 1
      let markOnConsole = chalk.blueBright(mark.clock)

      if(isLastMark && worktimeDayResume.isMissingPairMark){
        markOnConsole = chalk.yellow(mark.clock) + chalk.gray(' Batida ímpar')
      }

      return `${markOnConsole}`
    })

    let workedMinutesUntilNowOnConsole = ClockHelper.humanizeMinutesToClock(worktimeDayResume.workedMinutesUntilNow)

    if(worktimeDayResume.isMissingPairMark){
      workedMinutesUntilNowOnConsole = chalk.yellow(workedMinutesUntilNowOnConsole) + ' '
    }

    if(worktimeDayResume.missingMinutesToCompleteJourney){
      const humanizedMissingMinutes = ClockHelper.humanizeMinutesToClock(worktimeDayResume.missingMinutesToCompleteJourney)

      workedMinutesUntilNowOnConsole += chalk.gray(` - ${options.journeyTime} = `)
      if(worktimeDayResume.missingMinutesToCompleteJourney > 0) {
        workedMinutesUntilNowOnConsole += chalk.red(`-${humanizedMissingMinutes} `)
      } else {
        workedMinutesUntilNowOnConsole += chalk.green(`+${humanizedMissingMinutes} `)
      }
    }

    console.log('')
    console.log(`🔢 Batidas: ${marksToConsole.join('   ')}`)
    console.log(`⏸  Horas de pausas: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.breakMinutes)}`)
    console.log(`🆗 Horas registradas: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.registeredWorkedMinutes)}`)
    console.log(`⏺  Horas trabalhadas até este momento: ${workedMinutesUntilNowOnConsole}`)
    console.log('')
  }
}