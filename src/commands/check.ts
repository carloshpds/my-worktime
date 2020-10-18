import {Command, flags} from '@oclif/command'
import * as moment from 'moment'
import {WorktimeProviderOptions} from '../providers/types'
import ClockHelper from '../utils/ClockHelper'
import Ahgora from '../providers/Ahgora'
import * as chalk from 'chalk'
import { DATE_FORMAT, DATE_REGEXP } from '../utils/dateFormat'
import { executeQuery } from '../providers/executeQuery'
import Conf from 'conf'
import * as keytar from 'keytar'

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
    system: flags.string({char: 's', description: 'Nome do sistema de ponto', env: 'MW_SYSTEM'}),
    company: flags.string({char: 'c', description: 'ID da empresa no sistema de ponto', env: 'MW_COMPANY'}),
    date: flags.string({char: 'd', description: 'Data relacionada a consulta de horas no padrão YYYY-MM-DD', default: moment().format('YYYY-MM-DD')}),
    debug: flags.boolean({char: 'b', description: 'Debug - Exibe mais informações na execução', default: false}),
    journeytime: flags.string({char: 'j', description: 'Quantidade de horas a serem trabalhadas por dia', default: '08:00'}),
  }

  async run() {
    const {flags} = this.parse(CheckCommand)
    const config = new Conf();
    let configOptions = config.get('options') as Partial<WorktimeProviderOptions>
    const providers: Record<string, any> = {
      ahgora: Ahgora,
    }

    if (!flags.user && !flags.password && !flags.system && !flags.company) {
      if (configOptions) {
        configOptions.date = moment().format("YYYY-MM-DD")
        configOptions.momentDate = moment()
  
        const passwords = await keytar.findCredentials('My-Worktime')

        if (passwords.length != 0 && configOptions.systemId) {
            const password = passwords.filter(pwd => pwd.account === configOptions.systemId?.toLowerCase()).map(pwd => pwd.password)

            if (!password || password.length != 1) {
              this.error("Ocorreu um erro ao obter senha do Keychain. O setup foi efetuado?")
            }

            await executeQuery(providers[configOptions.systemId?.toLowerCase()], configOptions, password[0])
            this.exit(0)
        } else {
          this.error("As configurações estão incompletas. Favor execute o setup novamente.")
        }
        
      }
      this.describeUsage()
      this.exit(1)
    } else if (!flags.user || !flags.password || !flags.system || !flags.company) {
      this.describeUsage()
      this.exit(1)
    }

    const options: Partial<WorktimeProviderOptions> = {
      userId: flags.user,
      systemId: flags.system,
      companyId: flags.company,
      date: flags.date,
      debug: flags.debug,
      journeyTime: flags.journeytime,
    }

    if(!DATE_REGEXP.test(options.date as string) || !moment().isValid()){
      this.error(chalk.red(`Este formato de data é inválido, utilize o padrão ${DATE_FORMAT}`))
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
    /*
     await executeQuery(providers[flags.system.toLowerCase()], options, flags.password)
  }

  describeUsage() {
      this.log('Não foi possível recuperar as credenciais do sistema de ponto!')
      this.log('Use `my-worktime setup` para configurar a CLI')
      this.log('Use `my-worktime check -h` para obter informações de como passar as credencias via linha de comando.')
      this.log('Alternativamente, você também pode definir as variáveis de ambiente "MW_USER" e "MW_PASS"')
*/
    const CurrentProviderClass = providers[options.systemId.toLowerCase()]
    const loader = ora('Iniciando...').start()

    if (CurrentProviderClass) {
      try {
        const worktimeProvider: WorktimeProvider = new CurrentProviderClass(options)
        loader.text = `Buscando dados no ${worktimeProvider.name}`

        const worktimeDayResume: WorktimeDayResume = await worktimeProvider.getWorktimeDayResume()

        if(worktimeDayResume.marks.length){
          loader.succeed(`Dados encontrados, seu horário ideal de saída é ${chalk.black.bgBlueBright(' ' + worktimeDayResume.shouldLeaveClockTime + ' ')}`)
          this.printResult(worktimeDayResume, options)
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

  printResult(worktimeDayResume: WorktimeDayResume, options: Partial<WorktimeProviderOptions>){
    const marksToConsole = worktimeDayResume.marks.map((mark, index) => {
      const isLastMark = index === worktimeDayResume.marks.length - 1
      let markOnConsole = chalk.blueBright(mark.clock)

      if(isLastMark && worktimeDayResume.isMissingPairMark){
        markOnConsole = chalk.yellow(mark.clock) + chalk.gray(' Batida ímpar')
      }

      return `${markOnConsole}`
    })

    let workedMinutesUntilNowOnConsole = ClockHelper.humanizeMinutesToClock(worktimeDayResume.workedMinutesUntilNow)

    if(worktimeDayResume.isMissingPairMark){
      workedMinutesUntilNowOnConsole = chalk.yellow(workedMinutesUntilNowOnConsole) + ' '
    }

    if(worktimeDayResume.missingMinutesToCompleteJourney){
      const humanizedMissingMinutes = ClockHelper.humanizeMinutesToClock(worktimeDayResume.missingMinutesToCompleteJourney)

      workedMinutesUntilNowOnConsole += chalk.gray(` - ${options.journeyTime} = `)
      if(worktimeDayResume.missingMinutesToCompleteJourney > 0) {
        workedMinutesUntilNowOnConsole += chalk.red(`-${humanizedMissingMinutes} `)
      } else {
        workedMinutesUntilNowOnConsole += chalk.green(`+${humanizedMissingMinutes} `)
      }
    }

    console.log('')
    console.log(`🔢 Batidas: ${marksToConsole.join('   ')}`)
    console.log(`⏸  Horas de pausas: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.breakMinutes)}`)
    console.log(`🆗 Horas registradas: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.registeredWorkedMinutes)}`)
    console.log(`⏺  Horas trabalhadas até este momento: ${workedMinutesUntilNowOnConsole}`)
    console.log('')
  }
}
