import {Command, flags} from '@oclif/command'
import * as moment from 'moment'
import {WorktimeDayResume, WorktimeProviderOptions} from '../providers/types'
import ClockHelper from '../utils/ClockHelper'
import * as chalk from 'chalk'
import { DATE_FORMAT, DATE_REGEXP } from '../utils/dateFormat'
import { executeQuery } from '../logic/check/executeQuery'
import Conf from 'conf'
import * as keytar from 'keytar'
import WorktimeProvider from '../providers/WorktimeProvider'
import * as ora from 'ora'

/*
 * Providers
 */
import Ahgora from '../providers/Ahgora'
import Faker from '../providers/Faker'
import Setup from './setup'

/*
 * Constants
 */
const providers: Record<string, any> = {
  ahgora: Ahgora,
  faker: Faker,
}
export default class CheckCommand extends Command {
  static description = 'Busca as batidas e calcula as horas trabalhadas para uma data específica'

  static examples = [
    '$ my-worktime check -u 321 -p 123 -c a22',
    '$ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48',
    '$ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48 -d 2020-09-23',
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    user: flags.string({char: 'u', description: 'ID do usuário no sistema de ponto', env: 'MW_USER'}),
    password: flags.string({char: 'p', description: 'Senha do usuário no sistema', env: 'MW_PASS'}),
    system: flags.string({char: 's', description: 'Nome do sistema de ponto', env: 'MW_SYSTEM', default: 'ahgora'}),
    company: flags.string({char: 'c', description: 'ID da empresa no sistema de ponto', env: 'MW_COMPANY'}),
    date: flags.string({char: 'd', description: 'Data relacionada a consulta de horas no padrão YYYY-MM-DD', default: moment().format('YYYY-MM-DD')}),
    debug: flags.boolean({char: 'b', description: 'Debug - Exibe mais informações na execução', default: true}),
    journeytime: flags.string({char: 'j', description: 'Quantidade de horas a serem trabalhadas por dia', default: '08:00'}),
    useMocks: flags.boolean({ char: 'm', description: 'Simula os requests para o sistema de ponto', default: false }),
  }

  async run() {
    const {flags} = this.parse(CheckCommand)
    const requiredFlagsArePresent = flags.user && flags.password && flags.company

    if(requiredFlagsArePresent){
      this.runWithoutSetup()
    } else {
      this.runUsingSetup()
    }

  }

  async runUsingSetup() {
    const { flags } = this.parse(CheckCommand)
    const config = new Conf();
    const setupCommand = new Setup(this.argv, this.config)

    const requiredFlagsArePresent = flags.user && flags.password && flags.company
    let setupOptions = config.get('options') as Partial<WorktimeProviderOptions>

    if (!requiredFlagsArePresent) {
      if (setupOptions) {
        setupOptions.date = flags.date || moment().format("YYYY-MM-DD")
        setupOptions.momentDate = flags.date ? moment(flags.date) : moment()

        const passwords = await keytar.findCredentials('My-Worktime')

        if (passwords.length != 0 && setupOptions.systemId) {
            const password = passwords.filter(pwd => pwd.account === setupOptions.systemId?.toLowerCase()).map(pwd => pwd.password)

            if (!password || password.length != 1) {
              this.error("Ocorreu um erro ao obter senha do Keychain. O setup foi efetuado?")
            } else {
              setupOptions.password = password[0]
              await executeQuery(providers[setupOptions.systemId?.toLowerCase()], setupOptions)
              this.exit(0)
            }

        } else {
          this.warn("As configurações estão incompletas. Favor execute o setup novamente.")
        }
      }

      await setupCommand.run()
    } else if (!flags.user || !flags.password || !flags.system || !flags.company) {
      await setupCommand.run()
    }
  }

  async runWithoutSetup() {
    const { flags } = this.parse(CheckCommand)

    const options: Partial<WorktimeProviderOptions> = {
      userId: flags.user,
      systemId: flags.system,
      password: flags.password,
      companyId: flags.company,
      date: flags.date,
      debug: flags.debug,
      journeyTime: flags.journeytime,
      useMocks: flags.useMocks
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

    await executeQuery(providers[flags.system.toLowerCase()], options)

  }

  describeUsage() {
    this.log('Não foi possível recuperar as credenciais do sistema de ponto!')
    this.log('Use `my-worktime setup` para configurar a CLI')
    this.log('Use `my-worktime check -h` para obter informações de como passar as credencias via linha de comando.')
    this.log('Alternativamente, você também pode definir as variáveis de ambiente "MW_USER" e "MW_PASS"')
  }
}
