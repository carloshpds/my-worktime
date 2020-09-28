import {Command, flags} from '@oclif/command'
import * as moment from 'moment'
import {WorktimeProviderOptions, WorktimeDayResume} from '../providers/types'
import ClockHelper from '../utils/ClockHelper'
import Ahgora from '../providers/Ahgora'
import WorktimeProvider from '../providers/WorktimeProvider'
import * as ora from 'ora'
import * as chalk from 'chalk'

export default class CheckCommand extends Command {
  static description = 'Checks your worktime'

  static examples = [
    '$ my-worktime check -u 321 -p 123 -c a22',
    '$ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48',
    '$ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48 -d 2020-09-23',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    user: flags.string({char: 'u', description: 'ID do usuário no sistema de ponto', required: true, env: 'MW_USER'}),
    password: flags.string({char: 'p', description: 'Senha do usuário no sistema', required: true, env: 'MW_PASS'}),
    system: flags.string({char: 's', description: 'Nome do sistema de ponto', default: 'ahgora'}),
    company: flags.string({char: 'c', description: 'ID da empresa no sistema de ponto', required: true, default: 'ahgora'}),
    date: flags.string({char: 'd', description: 'Data relacionada a consulta de horas no padrão YYYY-MM-DD', default: moment().format('YYYY-MM-DD')}),
    debug: flags.boolean({char: 'b', description: 'Debug - Exibe mais informações na execução', default: false}),
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

        if(worktimeDayResume.marks.length){
          loader.succeed(`Dados encontrados, seu horário de saída ideal é ${chalk.black.bgGreen(' ' + worktimeDayResume.shouldLeaveClockTime + ' ')}`)
          this.printResult(worktimeDayResume)
        } else {
          loader.fail('Não há nenhuma batida para esta data ainda.')
        }

      } catch (error) {
        console.error(error)
        loader.fail('Não foi possível calcular. Verifique os parâmetros e tente novamente')
      }
    } else {
      loader.fail('Parece que ainda não suportamos o seu sistema de ponto :(')
    }
  }

  printResult(worktimeDayResume: WorktimeDayResume){
    const marksToConsole = worktimeDayResume.marks.map((mark, index) => {
      const isLastMark = index === worktimeDayResume.marks.length - 1
      let markOnConsole = chalk.green(mark.clock)

      if(isLastMark && worktimeDayResume.isMissingPairMark){
        markOnConsole = chalk.yellow(mark.clock) + chalk.gray(' Batida ímpar')
      }

      return `${markOnConsole}`
    })

    console.log('')
    console.log(`🔢 Batidas: ${marksToConsole.join('   ')}`)
    console.log(`🆗 Horas registradas: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.registeredWorkedMinutes)}`)
    console.log(`⏺  Horas trabalhadas até este momento: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.workedMinutesUntilNow)}`)
    console.log('')
  }
}
