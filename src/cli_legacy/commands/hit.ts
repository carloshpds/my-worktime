import {Command, flags} from '@oclif/command'
import * as moment from 'moment'

export default class HitCommand extends Command {
  static description = 'adds a new hit'

  static examples = [
    `$ my-worktime hit 01:00`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    time: flags.string({char: 't', description: 'Time to add (HH:mm)', required: true}),
    system: flags.string({char: 's', description: 'Nome do sistema de ponto', env: 'MW_SYSTEM', default: 'faker'}),
    date: flags.string({char: 'd', description: 'Data relacionada a consulta de horas no padrão YYYY-MM-DD', default: moment().format('YYYY-MM-DD')}),
    debug: flags.boolean({char: 'b', description: 'Debug - Exibe mais informações na execução', default: true}),
  }


}