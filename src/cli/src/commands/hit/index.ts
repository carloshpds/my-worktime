import { Args, Command, Flags, ux } from '@oclif/core'

import CheckDisplayer from '../../logic/check/displayer.js'
import LocalFileSystemProvider from '../../providers/LocalFileSystem/index.js'
import WorktimeProvider from '../../providers/WorktimeProvider.js'
import { WorktimeDayResume, WorktimeProviderOptions } from '../../providers/types.js'
import { translate } from '../../tools/i18n/index.js'
import { showTheShouldLeaveClockTime } from '../../tools/ui/worktimeDayResumeToConsole.js'
import commonFlags from '../../utils/commonFlags.js'

export default class HitCommand extends Command {
  static aliases = ['punch']

  static args = {
    marks: Args.string({ description: translate('cli.hit.calc.args.marks.description'), required: true }),
  }

  static description = translate('cli.hit.add.description')

  static examples = [
    `$ <%= config.bin %> <%= command.id %> 01:00`,
    `$ <%= config.bin %> <%= command.id %> 09:00,12:00,13:00 -s local`,
  ]

  static flags = {
    ...commonFlags(),
    system: Flags.string({ char: 's', default: 'local', description: 'Nome do sistema de ponto', options: ['local'] }),
  }

  async run() {
    ux.log('\n')
    const { args: { marks: clocksString }, flags: { date, debug, journeyTime, system } } = await this.parse(HitCommand);

    const options: WorktimeProviderOptions = WorktimeProvider.buildOptions({
      date,
      debug,
      journeyTime,
      systemId: system,
    })

    const provider = new LocalFileSystemProvider(options)
    const worktimeDayResume: WorktimeDayResume = await provider.addMarksByClocksString(clocksString)
    const displayer = new CheckDisplayer(provider)

    showTheShouldLeaveClockTime(worktimeDayResume)
    displayer.displayResult(worktimeDayResume, options)
  }

}