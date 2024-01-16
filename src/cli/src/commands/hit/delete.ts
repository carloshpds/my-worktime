import { Args, Command, Flags, ux } from '@oclif/core'

import CheckDisplayer from '../../logic/check/displayer.ts'
import LocalFileSystemProvider from '../../providers/LocalFileSystem/index.ts'
import WorktimeProvider from '../../providers/WorktimeProvider.ts'
import { WorktimeProviderOptions } from '../../providers/types.ts'
import { translate } from '../../tools/i18n/index.ts'
import commonFlags from '../../utils/commonFlags.ts'

export default class HitDeleteCommand extends Command {
  static aliases = ['punch']

  static args = {
    marks: Args.string({ description: translate('cli.hit.delete.args.marks.description'), required: true }),
  }

  static description = translate('cli.hit.delete.description')

  static examples = [
    `$ <%= config.bin %> <%= command.id %> 13:00`,
    `$ <%= config.bin %> <%= command.id %> 13:00 --date=2020-01-01`,
    `$ <%= config.bin %> <%= command.id %> 13:00,18:00 -d=2020-01-01`,
  ]

  static flags = {
    ...commonFlags(),
    system: Flags.string({ char: 's', default: 'local', description: translate('cli.common.flags.system.description'), options: ['local'] }),
  }

  async run() {
    ux.log('\n')
    const { args: { marks: clocksString }, flags: { date, debug, journeyTime, system } } = await this.parse(HitDeleteCommand);

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