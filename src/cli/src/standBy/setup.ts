import { Command, flags } from '@oclif/command'
import Conf from 'conf'
import * as inquirer from 'inquirer'
import * as keytar from 'keytar'

import { executeQuery } from '../logic/check/executeQuery'
import { meliFluxGenerateOptions, meliFluxGetPassword, meliFluxSecondStep, meliFluxThirdStep, otherCompaniesFluxSecondStep, otherCompaniesFluxThirdStep, otherCompaniesGenerateOptions, otherCompaniesGetPassword } from '../logic/setup/inputs'
import Ahgora from '../providers/Ahgora'
import { WorktimeProviderOptions } from '../providers/types'

export default class Setup extends Command {
  static description = 'Sets up the CLI for checking the worktime without entering the credentials every time.'

  static flags = {
    check: flags.boolean({ char: 'c', default: false, description: 'Exibe os dados armazenados até o momento' }),
    delete: flags.boolean({ char: 'd', default: false, description: 'Deleta os dados armazenados' }),
    help: flags.help({ char: 'h' }),
  }

  async run() {
    const { flags } = this.parse(Setup)
    const config = new Conf();

    if (flags.delete) {
      if (config.has('options')) {
        config.delete('options')
        this.log('🚮 Configurações excluídas com sucesso!')
      } else {
        this.log('😐 Não há configuração salva para ser deletada.')
      }

      this.exit(0)
    }

    if (flags.check) {
      if (config.has('options')) {
        const options = config.get('options')
        this.log('Dados armazenados até o momento')
        console.table(options)
      } else {
        this.log('😐 Não há dados armazenados')
      }

      this.exit(0)
    }

    this.log('🧞 Este setup irá te guiar no processo de configuração desta CLI para a sua empresa.')
    this.log('📛 Qualquer configuração previamente gravada será substituída caso termine este setup.')
    this.log('🔐 A sua senha será gravada com segurança usando ferramentas do seu Sistema Operacional.')
    this.log('')

    const firstStepInquirer: any = await inquirer.prompt([{
      default: false,
      message: 'Você trabalha para o Mercado Livre ou alguma de suas filiadas?',
      name: 'isMeli',
      type: 'confirm'
    }])

    const fluxs = {
      false: {
        generateOptions: otherCompaniesGenerateOptions,
        getPassword: otherCompaniesGetPassword,
        secondStep: otherCompaniesFluxSecondStep,
        thirdStep: otherCompaniesFluxThirdStep
      },
      true: {
        generateOptions: meliFluxGenerateOptions,
        getPassword: meliFluxGetPassword,
        secondStep: meliFluxSecondStep,
        thirdStep: meliFluxThirdStep
      }
    }

    const secondStepInquirer: any = await inquirer.prompt(fluxs[firstStepInquirer.isMeli].secondStep())
    const thirdStepInquirer: any = await inquirer.prompt(fluxs[firstStepInquirer.isMeli].thirdStep(secondStepInquirer))


    const options: WorktimeProviderOptions = fluxs[firstStepInquirer.isMeli].generateOptions(secondStepInquirer, thirdStepInquirer)
    const password = fluxs[firstStepInquirer.isMeli].getPassword(secondStepInquirer, thirdStepInquirer)

    keytar.setPassword('My-Worktime', options.systemId, password)

    config.set('options', {
      ...options,
      date: undefined,
      momentDate: undefined,
      password: undefined,
    })

    this.log('')
    this.log('💾 Dados armazenados!')
    this.log('✅ A próxima vez, execute apenas `my-worktime check`\n   Os seus dados serão recuperados automaticamente!')
    this.log('')

    await executeQuery(Ahgora, options)
  }
}
