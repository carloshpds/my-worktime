import { Args, Command, Flags, ux } from '@oclif/core'

import LocalFileSystemProvider from '../../providers/LocalFileSystem/index.ts'
import WorktimeProvider from '../../providers/WorktimeProvider.ts'
import { WorktimeProviderOptions } from '../../providers/types.ts'
import { translate } from '../../tools/i18n/index.ts'
import { showTheShouldLeaveClockTime } from '../../tools/ui/worktimeDayResumeToConsole.ts'
import commonFlags from '../../utils/commonFlags.ts'
import filterValidMarks from '../../utils/filterValidMarksStrings.ts'

export default class HitResetCommand extends Command {
  static aliases = ['punch']

  static args = {
    marks: Args.string({
      description: translate('cli.hit.calc.args.marks.description'), required: true
    }),
  }

  static description = translate('cli.hit.calc.description')

  static examples = [
    `$ <%= config.bin %> <%= command.id %> 09:00,12:00,13:00 `,
    `$ <%= config.bin %> <%= command.id %> 09:00,12:00,13:00,14:00,15:00 --date=2020-01-01`,
    `$ <%= config.bin %> <%= command.id %> 09:00 -d=2020-01-01`,
  ]

  static flags = {
    ...commonFlags(),
    system: Flags.string({ char: 's', default: 'local', description: translate('cli.common.flags.system.description'), options: ['local'] }),
  }

  async run() {
    ux.log('\n')
    const { args: { marks: clocksString }, flags: { date, debug, journeyTime, system } } = await this.parse(HitResetCommand);

    const options: WorktimeProviderOptions = WorktimeProvider.buildOptions({
      date,
      debug,
      journeyTime,
      systemId: system,
    })

    const provider = new LocalFileSystemProvider(options)

    try {
      const marksStrings = filterValidMarks({
        date,
        ignoreDateCases: true,
        marksStrings: clocksString.split(','),
        registeredMarks: [],
      })

      const marksToCalculate = marksStrings.map(clock => ({ clock: clock.trim() }))

      const worktimeDayResume = provider.calculateWorktimeDayResume(marksToCalculate)

      if (worktimeDayResume.isMissingPairMark) {
        showTheShouldLeaveClockTime(worktimeDayResume)
      } else {
        ux.info(translate('cli.common.errors.isMissingPairMarkToCalculateClockOut'))
      }
    } catch (error) {
      ux.error(`${error}`)
    }

  }

}