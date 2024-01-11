import { Args, Command, Flags, ux } from '@oclif/core'

import CheckDisplayer from '../../logic/check/displayer.ts'
import LocalFileSystemProvider from '../../providers/LocalFileSystem/index.ts'
import WorktimeProvider from '../../providers/WorktimeProvider.ts'
import { WorktimeDayResume, WorktimeProviderOptions } from '../../providers/types.ts'
import { showTheShouldLeaveClockTime } from '../../tools/ui/worktimeDayResumeToConsole.ts'
import commonFlags from '../../utils/commonFlags.ts'

export default class HitCommand extends Command {
  static aliases = ['punch']

  static args = {
    marks: Args.string({ description: 'Person to say hello to', required: true }),
  }

  static description = 'adds a new hit'

  static examples = [
    `$ <%= config.bin %> <%= command.id %> 01:00`,
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