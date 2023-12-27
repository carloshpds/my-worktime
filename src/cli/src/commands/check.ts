import { Command, Flags, ux } from '@oclif/core'
// import Conf from 'conf'
// import * as keytar from 'keytar'
import moment from 'moment'

import { executeQuery } from '../logic/check/executeQuery.ts'
/*
 * Providers
 */
import Ahgora from '../providers/Ahgora/index.ts'
import Faker from '../providers/Faker/index.ts'
import LocalFileSystemProvider from '../providers/LocalFileSystem/index.ts'
import WorktimeProvider from '../providers/WorktimeProvider.ts'
import { WorktimeProviderOptions } from '../providers/types.ts'
// import Setup from '../standBy/setup.ts'
import ClockHelper from '../utils/ClockHelper/index.ts'
import { validateRunningDate } from '../utils/validateDateOption.ts'

/*
 * Constants
 */
const providers: Record<string, any> = {
  ahgora: Ahgora,
  faker: Faker,
  local: LocalFileSystemProvider
}
export default class CheckCommand extends Command {
  static description = 'Busca as batidas e calcula as horas trabalhadas para uma data específica'

  static examples = [
    '$ my-worktime check -u 321 -p 123 -c a22',
    '$ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48',
    '$ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48 -d 2020-09-23',
  ]

  static flags = {
    company: Flags.string({ char: 'c', description: 'ID da empresa no sistema de ponto', env: 'MW_COMPANY' }),
    date: Flags.string({ char: 'd', default: moment().format('YYYY-MM-DD'), description: 'Data relacionada a consulta de horas no padrão YYYY-MM-DD' }),
    debug: Flags.boolean({ char: 'b', default: true, description: 'Debug - Exibe mais informações na execução' }),
    help: Flags.help({ char: 'h' }),
    journeytime: Flags.string({ char: 'j', default: '08:00', description: 'Quantidade de horas a serem trabalhadas por dia' }),
    password: Flags.string({ char: 'p', description: 'Senha do usuário no sistema', env: 'MW_PASS' }),
    system: Flags.string({ char: 's', default: 'ahgora', description: 'Nome do sistema de ponto', env: 'MW_SYSTEM' }),
    useMocks: Flags.boolean({ char: 'm', default: false, description: 'Simula os requests para o sistema de ponto' }),
    user: Flags.string({ char: 'u', description: 'ID do usuário no sistema de ponto', env: 'MW_USER' }),
  }

  describeUsage() {
    this.log('Não foi possível recuperar as credenciais do sistema de ponto!')
    this.log('Use `my-worktime setup` para configurar a CLI')
    this.log('Use `my-worktime check -h` para obter informações de como passar as credencias via linha de comando.')
    this.log('Alternativamente, você também pode definir as variáveis de ambiente "MW_USER" e "MW_PASS"')
  }

  async run() {
    ux.log('\n')
    this.runWithoutSetup()
  }

  // async runUsingSetup() {
  //   const { flags } = await this.parse(CheckCommand)
  //   const config = new Conf();
  //   const setupCommand = new Setup(this.argv, this.config)

  //   const requiredFlagsArePresent = flags.user && flags.password && flags.company
  //   const setupOptions = config.get('options') as Partial<WorktimeProviderOptions>

  //   if (!requiredFlagsArePresent) {
  //     if (setupOptions) {
  //       setupOptions.date = flags.date || moment().format("YYYY-MM-DD")
  //       setupOptions.momentDate = flags.date ? moment(flags.date) : moment()

  //       const passwords = await keytar.findCredentials('My-Worktime')

  //       if (passwords.length > 0 && setupOptions.systemId) {
  //         const password = passwords.filter(pwd => pwd.account === setupOptions.systemId?.toLowerCase()).map(pwd => pwd.password)

  //         if (!password || password.length !== 1) {
  //           this.error("Ocorreu um erro ao obter senha do Keychain. O setup foi efetuado?")
  //         } else {
  //           setupOptions.password = password[0]
  //           await executeQuery(providers[setupOptions.systemId?.toLowerCase()], setupOptions)
  //           this.exit(0)
  //         }

  //       } else {
  //         this.warn("As configurações estão incompletas. Favor execute o setup novamente.")
  //       }
  //     }

  //     await setupCommand.run()
  //   } else if (!flags.user || !flags.password || !flags.system || !flags.company) {
  //     await setupCommand.run()
  //   }
  // }

  async runWithoutSetup() {
    const { flags } = await this.parse(CheckCommand)

    const options: Partial<WorktimeProviderOptions> = WorktimeProvider.buildOptions({
      companyId: flags.company,
      date: flags.date,
      debug: flags.debug,
      journeyTime: flags.journeytime,
      password: flags.password,
      systemId: flags.system,
      useMocks: flags.useMocks,
      userId: flags.user
    })


    validateRunningDate.call(this, options.date as string)

    if (options.debug) {
      console.group('WorktimeOptions')
      console.log('Iniciando com os parâmetros')
      console.table({ ...options, momentDate: undefined })
      console.groupEnd()
    }

    // Runtime parameters
    options.momentDate = options.date ? moment(options.date) : moment()
    ClockHelper.debug = options.debug

    await executeQuery(providers[flags.system.toLowerCase()], options)

  }
}
