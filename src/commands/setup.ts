import {Command, flags} from '@oclif/command'

export default class Setup extends Command {
  static description = 'setup the correct properties for your job'

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({char: 'n', description: 'name to print'}),
    // flag with no value (-f, --force)
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Setup)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from /Users/opinheiro/otherProjects/my-worktime/src/commands/setup.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
