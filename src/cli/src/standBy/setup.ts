import { Command, Flags } from '@oclif/core'
import Conf from 'conf'
import inquirer from 'inquirer'
import * as keytar from 'keytar'

import { executeQuery } from '../logic/check/executeQuery.ts'
import { meliFluxGenerateOptions, meliFluxGetPassword, meliFluxSecondStep, meliFluxThirdStep, otherCompaniesFluxSecondStep, otherCompaniesFluxThirdStep, otherCompaniesGenerateOptions, otherCompaniesGetPassword } from '../logic/setup/inputs.ts'
import Ahgora from '../providers/Ahgora/index.ts'
import { WorktimeProviderOptions } from '../providers/types.ts'

export default class Setup extends Command {
  static description = 'Sets up the CLI for checking the worktime without entering the credentials every time.'

  static flags = {
    check: Flags.boolean({ char: 'c', default: false, description: 'Exibe os dados armazenados até o momento' }),
    delete: Flags.boolean({ char: 'd', default: false, description: 'Deleta os dados armazenados' }),
    help: Flags.help({ char: 'h' }),
  }

  async run() {
    const { flags } = await this.parse(Setup)
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

    const fluxs: Record<'false' | 'true', {
      generateOptions: (secondStepInquirer: any, thirdStepInquirer: any) => WorktimeProviderOptions,
      getPassword: (secondStepInquirer: any, thirdStepInquirer: any) => string,
      secondStep: () => any,
      thirdStep: (secondStepInquirer: any) => any,
    }> = {
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

    const currentFlux = fluxs[firstStepInquirer.isMeli as "false" | "true"]
    const secondStepInquirer: any = await inquirer.prompt(currentFlux.secondStep())
    const thirdStepInquirer: any = await inquirer.prompt(currentFlux.thirdStep(secondStepInquirer))


    const options: WorktimeProviderOptions = currentFlux.generateOptions(secondStepInquirer, thirdStepInquirer)
    const password = currentFlux.getPassword(secondStepInquirer, thirdStepInquirer)

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
