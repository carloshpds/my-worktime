import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import Ahgora from '../providers/Ahgora'
import { executeQuery } from '../providers/executeQuery'
import { meliFluxSecondStep, meliFluxThirdStep, meliFluxGenerateOptions, otherCompaniesFluxSecondStep, otherCompaniesFluxThirdStep, otherCompaniesGenerateOptions } from '../utils/setupFlux'

export default class Setup extends Command {
  static description = 'Setup the correct properties for your company'

  static flags = {
    help: flags.help({char: 'h'})
  }

  async run() {
    this.log(`Este setup irá te guiar a confgirar esse CLI para a sua empresa.`)

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

    await executeQuery(Ahgora, fluxs[firstStepInquirer.isMeli].generateOptions(secondStepInquirer, thirdStepInquirer))
  }
}
