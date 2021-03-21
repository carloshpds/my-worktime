import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import Ahgora from '../providers/Ahgora'
import { executeQuery } from '../logic/check/executeQuery'
import { meliFluxSecondStep, meliFluxThirdStep, meliFluxGenerateOptions, otherCompaniesFluxSecondStep, otherCompaniesFluxThirdStep, otherCompaniesGenerateOptions, meliFluxGetPassword, otherCompaniesGetPassword } from '../logic/setup/inputs'
import Conf from 'conf'
import { WorktimeProviderOptions } from '../providers/types'
import * as keytar from 'keytar'

export default class Setup extends Command {
  static description = 'Sets up the CLI for checking the worktime without entering the credentials every time.'

  static flags = {
    help: flags.help({char: 'h'}),
    delete: flags.boolean({char: 'd', description: 'Deleta os dados armazenados', default: false}),
    check: flags.boolean({char: 'c', description: 'Exibe os dados armazenados até o momento', default: false}),
  }

  async run() {
    const {flags} = this.parse(Setup)
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

    if(flags.check){
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

    let firstStepInquirer: any = await inquirer.prompt([{
      name: 'isMeli',
      message: 'Você trabalha para o Mercado Livre ou alguma de suas filiadas?',
      type: 'confirm',
      default: false
    }])

    const fluxs = {
      true: {
        secondStep: meliFluxSecondStep,
        thirdStep: meliFluxThirdStep,
        generateOptions: meliFluxGenerateOptions,
        getPassword: meliFluxGetPassword
      },
      false: {
        secondStep: otherCompaniesFluxSecondStep,
        thirdStep: otherCompaniesFluxThirdStep,
        generateOptions: otherCompaniesGenerateOptions,
        getPassword: otherCompaniesGetPassword
      }
    }

    let secondStepInquirer: any = await inquirer.prompt(fluxs[firstStepInquirer.isMeli].secondStep())
    let thirdStepInquirer: any = await inquirer.prompt(fluxs[firstStepInquirer.isMeli].thirdStep(secondStepInquirer))


    const options: WorktimeProviderOptions = fluxs[firstStepInquirer.isMeli].generateOptions(secondStepInquirer, thirdStepInquirer)
    const password = fluxs[firstStepInquirer.isMeli].getPassword(secondStepInquirer, thirdStepInquirer)

    keytar.setPassword('My-Worktime', options.systemId, password)

    config.set('options', {
      ...options,
      password: undefined,
      date: undefined,
      momentDate: undefined,
    })

    this.log('')
    this.log('💾 Dados armazenados!')
    this.log('✅ A próxima vez, execute apenas `my-worktime check`\n   Os seus dados serão recuperados automaticamente!')
    this.log('')

    await executeQuery(Ahgora, options)
  }
}
