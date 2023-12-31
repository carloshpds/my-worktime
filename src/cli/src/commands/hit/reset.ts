import { Command, Flags, ux } from '@oclif/core'

import LocalFileSystemProvider from '../../providers/LocalFileSystem/index.ts'
import WorktimeProvider from '../../providers/WorktimeProvider.ts'
import { WorktimeProviderOptions } from '../../providers/types.ts'
import commonFlags from '../../utils/commonFlags.ts'
import { validateRunningDate } from '../../utils/validateDateOption.ts'

export default class HitResetCommand extends Command {
  static aliases = ['punch']

  static description = 'Resets all hits of the history or only from a given date'

  static examples = [
    `$ <%= config.bin %> <%= command.id %>`,
    `$ <%= config.bin %> <%= command.id %> --date=2020-01-01`,
    `$ <%= config.bin %> <%= command.id %> -d=2020-01-01`,
  ]

  static flags = {
    ...commonFlags(),
    system: Flags.string({ char: 's', default: 'local', description: 'Nome do sistema de ponto', options: ['local'] }),
  }

  async run() {
    ux.log('\n')
    const { flags: { date, debug, journeyTime, system } } = await this.parse(HitResetCommand);

    validateRunningDate.call(this, date)

    const options: WorktimeProviderOptions = WorktimeProvider.buildOptions({
      date,
      debug,
      journeyTime,
      systemId: system,
    })

    const provider = new LocalFileSystemProvider(options)

    try {
      ux.action.start(`Resetando batidas de ${ux.colorize('blue', date)}`)
      await provider.resetMarks()
      ux.action.stop(`Batidas de ${ux.colorize('blue', date)} resetadas`)
    } catch (error) {
      ux.error(`${error}`)
    }

  }

}