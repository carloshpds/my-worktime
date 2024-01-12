import { Command, Flags, ux } from '@oclif/core'

import LocalFileSystemProvider from '../../providers/LocalFileSystem/index.ts'
import WorktimeProvider from '../../providers/WorktimeProvider.ts'
import { WorktimeProviderOptions } from '../../providers/types.ts'
import { translate } from '../../tools/i18n/index.ts'
import commonFlags from '../../utils/commonFlags.ts'

export default class HitResetCommand extends Command {
  static aliases = ['punch']

  static description = translate('cli.hit.reset.description')

  static examples = [
    `$ <%= config.bin %> <%= command.id %>`,
    `$ <%= config.bin %> <%= command.id %> --date=2020-01-01`,
    `$ <%= config.bin %> <%= command.id %> -d=2020-01-01`,
  ]

  static flags = {
    ...commonFlags(),
    system: Flags.string({ char: 's', default: 'local', description: translate('cli.common.flags.system.description'), options: ['local'] }),
  }

  async run() {
    ux.log('\n')
    const { flags: { date, debug, journeyTime, system } } = await this.parse(HitResetCommand);

    const options: WorktimeProviderOptions = WorktimeProvider.buildOptions({
      date,
      debug,
      journeyTime,
      systemId: system,
    })

    const provider = new LocalFileSystemProvider(options)

    try {
      const formattedDate = ux.colorize('blue', provider.options.momentDate!.format('L'))
      const messages = {
        marksHasBeenReseted: translate('cli.hit.reset.marksHasBeenReseted', {
          date: formattedDate,
        }),
        resettingMarks: translate('cli.hit.reset.resettingMarks', {
          date: formattedDate,
        }),
      }

      ux.action.start(messages.resettingMarks)
      await provider.resetMarks()
      ux.action.stop(messages.marksHasBeenReseted)
    } catch (error) {
      ux.error(`${error}`)
    }

  }

}