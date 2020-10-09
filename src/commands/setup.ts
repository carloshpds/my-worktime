import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import Ahgora from '../providers/Ahgora'
import { executeQuery } from '../providers/executeQuery'
import { meliFluxSecondStep, meliFluxThirdStep, meliFluxGenerateOptions, otherCompaniesFluxSecondStep, otherCompaniesFluxThirdStep, otherCompaniesGenerateOptions } from '../utils/setupFlux'
import Conf from 'conf'
import CheckCommand from './check'

export default class Setup extends Command {
  static description = 'Configura a CLI para a sua empresa'

  static flags = {
    help: flags.help({char: 'h'}),
    delete: flags.boolean({char: 'd', description: 'Deleta a configuração salva', default: false})
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

    this.log('🧞 Este setup irá te guiar a confgirar esse CLI para a sua empresa.')
    this.log('📛 Qualquer configuração previamente gravada será substituída caso termine este setup.')
    this.log('💢 ATENÇÃO: A sua senha será gravada em texto puro no arquivo de configuração!')

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
        generateOptions: meliFluxGenerateOptions
      },
      false: {
        secondStep: otherCompaniesFluxSecondStep,
        thirdStep: otherCompaniesFluxThirdStep,
        generateOptions: otherCompaniesGenerateOptions
      }
    }

    let secondStepInquirer: any = await inquirer.prompt(fluxs[firstStepInquirer.isMeli].secondStep())
    let thirdStepInquirer: any = await inquirer.prompt(fluxs[firstStepInquirer.isMeli].thirdStep(secondStepInquirer))

    
    const options = fluxs[firstStepInquirer.isMeli].generateOptions(secondStepInquirer, thirdStepInquirer)

    config.set('options', options)
    this.log('💾 Dados armazenados com sucesso!')
    this.log('✅ A próxima vez, execute apenas `my-worktime check` Que os seus dados serão recuperados automaticamente!')
    await executeQuery(Ahgora, options)
  }
}
