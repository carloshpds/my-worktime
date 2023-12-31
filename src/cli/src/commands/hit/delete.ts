import { Args, Command, Flags, ux } from '@oclif/core'

import CheckDisplayer from '../../logic/check/displayer.ts'
import LocalFileSystemProvider from '../../providers/LocalFileSystem/index.ts'
import WorktimeProvider from '../../providers/WorktimeProvider.ts'
import { WorktimeProviderOptions } from '../../providers/types.ts'
import commonFlags from '../../utils/commonFlags.ts'
import { validateRunningDate } from '../../utils/validateDateOption.ts'

export default class HitResetCommand extends Command {
  static aliases = ['punch']

  static args = {
    marks: Args.string({ description: 'Person to say hello to', required: true }),
  }

  static description = 'Resets all hits of the history or only from a given date'

  static examples = [
    `$ <%= config.bin %> <%= command.id %> 13:00`,
    `$ <%= config.bin %> <%= command.id %> 13:00 --date=2020-01-01`,
    `$ <%= config.bin %> <%= command.id %> 13:00,18:00 -d=2020-01-01`,
  ]

  static flags = {
    ...commonFlags(),
    system: Flags.string({ char: 's', default: 'local', description: 'Nome do sistema de ponto', options: ['local'] }),
  }

  async run() {
    ux.log('\n')
    const { args: { marks: clocksString }, flags: { date, debug, journeyTime, system } } = await this.parse(HitResetCommand);

    validateRunningDate.call(this, date)

    const options: WorktimeProviderOptions = WorktimeProvider.buildOptions({
      date,
      debug,
      journeyTime,
      systemId: system,
    })

    const provider = new LocalFileSystemProvider(options)

    try {
      const worktimeDayResume = await provider.deleteMarks(clocksString)
      const displayer = new CheckDisplayer(provider)
      displayer.displayResult(worktimeDayResume, options)
    } catch (error) {
      ux.error(`${error}`)
    }

  }

}