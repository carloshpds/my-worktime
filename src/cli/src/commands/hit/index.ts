import { Args, Command, flags } from '@oclif/command'
import * as moment from 'moment'

export default class HitCommand extends Command {
  static args = {
    time: Args.string({ description: 'Person to say hello to', required: true }),
  }

  static description = 'adds a new hit'

  static examples = [
    `$ my-worktime hit 01:00`,
  ]

  static flags = {
    date: flags.string({ char: 'd', default: moment().format('YYYY-MM-DD'), description: 'Data relacionada a consulta de horas no padrão YYYY-MM-DD' }),
    debug: flags.boolean({ char: 'b', default: true, description: 'Debug - Exibe mais informações na execução' }),
    help: flags.help({ char: 'h' }),
  }

  async run() {
    const { args: { time }, flags: { date, debug, system } } = this.parse(HitCommand);

    if (debug) {
      this.log(`Adding ${time} on ${date}`);
    }

    this.log('Hit added');
  }

}