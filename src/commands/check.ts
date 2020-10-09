import {Command, flags} from '@oclif/command'
import * as moment from 'moment'
import {WorktimeProviderOptions} from '../providers/types'
import ClockHelper from '../utils/ClockHelper'
import Ahgora from '../providers/Ahgora'
import * as chalk from 'chalk'
import { DATE_FORMAT, DATE_REGEXP } from '../utils/dateFormat'
import { executeQuery } from '../providers/executeQuery'
import Conf from 'conf'

export default class CheckCommand extends Command {
  static description = 'Checks your worktime'

  static examples = [
    '$ my-worktime check -u 321 -p 123 -c a22',
    '$ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48',
    '$ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48 -d 2020-09-23',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    user: flags.string({char: 'u', description: 'ID do usuário no sistema de ponto', env: 'MW_USER'}),
    password: flags.string({char: 'p', description: 'Senha do usuário no sistema', env: 'MW_PASS'}),
    system: flags.string({char: 's', description: 'Nome do sistema de ponto', default: 'ahgora', env: 'MW_SYSTEM'}),
    company: flags.string({char: 'c', description: 'ID da empresa no sistema de ponto', env: 'MW_COMPANY'}),
    date: flags.string({char: 'd', description: 'Data relacionada a consulta de horas no padrão YYYY-MM-DD', default: moment().format('YYYY-MM-DD')}),
    debug: flags.boolean({char: 'b', description: 'Debug - Exibe mais informações na execução', default: false}),
    journeytime: flags.string({char: 'j', description: 'Quantidade de horas a serem trabalhadas por dia', default: '08:00'}),
  }

  async run() {
    const {flags} = this.parse(CheckCommand)

    const config = new Conf();

    let options = config.get('options') as Partial<WorktimeProviderOptions>

    if (options) {
      options.date = moment().format("YYYY-MM-DD")
      options.momentDate = moment()

      await executeQuery(Ahgora, options)
      this.exit(0)
    }

    options = {
      userId: flags.user,
      password: flags.password,
      systemId: flags.system,
      companyId: flags.company,
      date: flags.date,
      debug: flags.debug,
      journeyTime: flags.journeytime,
    }

    if (!options.userId || !options.password || !options.systemId || !options.companyId) {
      this.log('Não foi possível recuperar as credenciais do sistema de ponto')
      this.log('Você pode definir as variáveis de ambiente "MW_USER" e "MW_PASS"')
      this.log('Use my-worktime -h para informar as credencias via linha de comando.')
      return
    }

    if(!DATE_REGEXP.test(options.date as string) || !moment().isValid()){
      this.error(chalk.red(`Este formato de data é inválido, utilize o padrão ${DATE_FORMAT}`))
      return
    }

    if (options.debug) {
      console.group('WorktimeOptions')
      console.log('Iniciando com os parâmetros')
      console.table(options)
      console.groupEnd()
    }

    // Runtime parameters
    options.momentDate = options.date ? moment(options.date) : moment()
    ClockHelper.debug = options.debug

    const providers: Record<string, any> = {
      ahgora: Ahgora,
    }

    await executeQuery(providers[options.systemId.toLowerCase()], options)
  }
}
