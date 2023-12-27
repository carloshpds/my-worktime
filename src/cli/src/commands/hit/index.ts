import { Args, Command, Flags, ux } from '@oclif/core'
import moment from 'moment'

import CheckDisplayer from '../../logic/check/displayer.ts'
import LocalFileSystemProvider from '../../providers/LocalFileSystem/index.ts'
import WorktimeProvider from '../../providers/WorktimeProvider.ts'
import { WorktimeDayResume, WorktimeProviderOptions } from '../../providers/types.ts'
import { validateRunningDate } from '../../utils/validateDateOption.ts'

export default class HitCommand extends Command {
  static aliases = ['punch']

  static args = {
    time: Args.string({ description: 'Person to say hello to', required: true }),
  }

  static description = 'adds a new hit'

  static examples = [
    `$ my-worktime hit 01:00`,
  ]

  static flags = {
    date: Flags.string({ char: 'd', default: moment().format('YYYY-MM-DD'), description: 'Data relacionada a consulta de horas no padrão YYYY-MM-DD' }),
    debug: Flags.boolean({ char: 'b', default: true, description: 'Debug - Exibe mais informações na execução' }),
    help: Flags.help({ char: 'h' }),
  }

  async run() {
    ux.log('\n')
    const { args: { time: clocksString }, flags: { date, debug, system } } = await this.parse(HitCommand);

    validateRunningDate.call(this, date)

    const options: WorktimeProviderOptions = WorktimeProvider.buildOptions({
      date,
      debug,
      systemId: system,
    })

    const provider = new LocalFileSystemProvider(options)
    const worktimeDayResume: WorktimeDayResume = await provider.addMarksByClocksString(clocksString)
    const displayer = new CheckDisplayer(provider)

    displayer.displayResult(worktimeDayResume, options)
  }

}