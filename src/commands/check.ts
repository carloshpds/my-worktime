import {Command, flags} from '@oclif/command'
import * as moment from 'moment'
import {WorktimeProviderOptions, WorktimeDayResume} from '../providers/types'
import ClockHelper from '../utils/ClockHelper'
import Ahgora from '../providers/Ahgora'
import WorktimeProvider from '../providers/WorktimeProvider'
import * as ora from 'ora'

export default class CheckCommand extends Command {
  static description = 'Checks your worktime'

  static examples = [
    '$ worktime check -u 16238 -p 123 -s ahgora -c a382748 -j 08:48',
    '$ worktime check -u 16238 -p 123 -c a382748',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    user: flags.string({char: 'u', description: 'ID do usuário no sistema de ponto', required: true}),
    password: flags.string({char: 'p', description: 'Senha do usuário no sistema', required: true}),
    system: flags.string({char: 's', description: 'Nome do sistema de ponto', required: true, default: 'ahgora'}),
    company: flags.string({char: 'c', description: 'ID da empresa no sistema de ponto', required: true, default: 'ahgora'}),
    date: flags.string({char: 'd', description: 'Data relacionada a consulta de horas no padrão YYYY-MM-DD', default: moment().format('YYYY-MM-DD')}),
    debug: flags.boolean({char: 'b', description: 'Debug - Exibe mais informações na execução'}),
    journeytime: flags.string({char: 'j', description: 'Quantidade de horas a serem trabalhadas por dia', default: '08:00'}),
  }

  async run() {
    const {flags} = this.parse(CheckCommand)

    const options: Partial<WorktimeProviderOptions> = {
      userId: flags.user     || process.env.WORKTIME_USER,
      password: flags.password || process.env.WORKTIME_PASSWORD,
      systemId: flags.system || process.env.WORKTIME_SYSTEM,
      companyId: flags.company || process.env.WORKTIME_COMPANY,
      date: flags.date || process.env.WORKTIME_DATE,
      debug: flags.debug,
      journeyTime: flags.journeytime || process.env.WORKTIME_JOURNEYTIME,
    }

    if (!options.userId || !options.password || !options.systemId || !options.companyId) {
      this.log('Não foi possível recuperar as credenciais do sistema de ponto')
      this.log('Você pode definir as variáveis de ambiente "WORKTIME_USER" e "WORKTIME_PASSWORD"')
      this.log('Use worktime -h para informar as credencias via linha de comando.')
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

    const CurrentProviderClass = providers[options.systemId.toLowerCase()]
    const loader = ora('Iniciando...').start()

    if (CurrentProviderClass) {
      try {
        const worktimeProvider: WorktimeProvider = new CurrentProviderClass(options)
        loader.text = `Buscando dados no ${worktimeProvider.name}`

        const worktimeDayResume: WorktimeDayResume = await worktimeProvider.getWorktimeDayResume()
        loader.succeed(`Dados encontrados, seu horário de saída ideal é ${worktimeDayResume.shouldLeaveClockTime}`)
        // console.log(marks.map(mark => mark.clock).join(' '))
        worktimeDayResume.marks.length && console.table(worktimeDayResume.marks)
      } catch (error) {
        options.debug && console.error(error)
        loader.fail('Não foi possível calcular. Verifique os parâmetros e tente novamente')
      }
    } else {
      loader.fail('Parece que ainda não suportamos o seu sistema de ponto :(')
    }
  }
}
