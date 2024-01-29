import chalk from 'chalk'

import WorktimeProvider from '../../providers/WorktimeProvider.js'
import { WorktimeDayResume, WorktimeProviderOptions } from '../../providers/types.js'
import ClockHelper from '../../tools/ClockHelper/index.js'
import { formatMarkToConsole } from '../../tools/ui/marksToConsole.js'
import { prepareWorktimeDayResumeToConsole } from '../../tools/ui/worktimeDayResumeToConsole.js'

export default class CheckDisplayer {
  provider: WorktimeProvider

  constructor(provider: WorktimeProvider) {
    this.provider = provider
  }

  displayResult(worktimeDayResume: WorktimeDayResume, options: Partial<WorktimeProviderOptions>) {
    const marksToConsole = prepareWorktimeDayResumeToConsole(worktimeDayResume)

    let workedMinutesUntilNowOnConsole = ClockHelper.humanizeMinutesToClock(worktimeDayResume.workedMinutesUntilNow)

    if (worktimeDayResume.isMissingPairMark) {
      workedMinutesUntilNowOnConsole = chalk.yellow(workedMinutesUntilNowOnConsole) + ' '
    }

    if (worktimeDayResume.missingMinutesToCompleteJourney) {
      const humanizedMissingMinutes = ClockHelper.humanizeMinutesToClock(worktimeDayResume.missingMinutesToCompleteJourney)

      workedMinutesUntilNowOnConsole += chalk.gray(` - ${options.journeyTime} = `)
      workedMinutesUntilNowOnConsole += worktimeDayResume.missingMinutesToCompleteJourney > 0 ? chalk.red(`-${humanizedMissingMinutes} `) : chalk.green(`+${humanizedMissingMinutes} `);
    }

    console.log('')
    console.log(`🔢 Batidas: ${marksToConsole.join('   ')}`)
    console.log(`⏸  Horas de pausas: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.breakMinutes)}`)
    console.log(`🆗 Horas registradas: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.registeredWorkedMinutes)}`)
    console.log(`⏺  Horas trabalhadas até este momento: ${workedMinutesUntilNowOnConsole}`)
    console.log('')

    const marksWithCorrection = worktimeDayResume.marks.filter((mark) => mark.correction)

    if (marksWithCorrection.length > 0) {
      console.log(`${chalk.bgYellow.black('Justificativas')}`)
      console.log('')

      for (const mark of marksWithCorrection) {
        console.log(`  ${formatMarkToConsole(mark)}`)
        mark.correction && mark.correction.reason && console.log(`  ${chalk.bgYellow.black(mark.correction.reason)}`)
        console.log(chalk.white('---------'))
      }
    }
  }
}