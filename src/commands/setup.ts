import {Command, flags} from '@oclif/command'
import * as inquirer from 'inquirer'
import * as ora from 'ora'
import * as chalk from 'chalk'
import PromptUI from 'inquirer/lib/ui/prompt'
import Ahgora from '../providers/Ahgora'
import { WorktimeDayResume, WorktimeProviderOptions } from '../providers/types'
import WorktimeProvider from '../providers/WorktimeProvider'
import ClockHelper from '../utils/ClockHelper'
import * as moment from 'moment'
import { MeliBUs } from '../enums/MeliBusinessUnits'
import {CLIError} from '@oclif/errors'

export default class Setup extends Command {
  static description = 'Setup the correct properties for your company'

  static flags = {
    help: flags.help({char: 'h'})
  }

  async run() {
    const {args, flags} = this.parse(Setup)

    const OTHER = 'Outro'
    const AHGORA = 'Ahgora'

    this.log(`Este setup irá te guiar a confgirar esse CLI para a sua empresa.`)

    let firstStepInquirer: any = await inquirer.prompt([{
      name: 'isMeli',
      message: 'Você trabalha para o Mercado Livre ou alguma de suas filiadas?',
      type: 'confirm',
      default: false
    }])

    function meliFluxSecondStep(): inquirer.QuestionCollection[] {
      return [
        {
          name: 'whichMeli',
          message: 'Para qual BU você trabalha?',
          type: 'list',
          choices: [{name: MeliBUs.MARKETPLACE.name, value: MeliBUs.MARKETPLACE.code}, {name: MeliBUs.MERCADO_ENVIOS.name, value: MeliBUs.MERCADO_ENVIOS.code}]
        },
        {
          name: 'isDefaultMeliWorktime',
          message: 'Você tem o expediente padrão do Meli (08:48)?',
          type: 'confirm',
          default: true
        }
      ].concat(inquireAhgoraCredentials()) as inquirer.QuestionCollection[]
    }

    function otherCompaniesFluxSecondStep(): inquirer.QuestionCollection[] {
      return [
        {
          name: 'provider',
          message: 'Selecione um sistema de pontos',
          type: 'list',
          choices: [{name: AHGORA}],
        },
        {
          name: 'journeytime',
          message: 'Selecione o período da sua jornada de trabalho',
          type: 'list',
          choices: [{name: '08:00'}, {name: '08:48'}, {name: '06:00'}, {name: OTHER}],
        },
        {
          name: 'ahgoraCompanyId',
          message: 'Digite a companyId do Ahgora da sua empresa',
          type: 'input'
        }
      ] as inquirer.QuestionCollection[]
    }

    function inquireAhgoraCredentials(): any {
      return [
        {
          name: 'ahgoraUsername',
          message: 'Digite seu nome de usuário do Ahgora:',
          type: 'input'
        },
        {
          name: 'ahgoraPassword',
          message: 'Digite sua senha do Ahgora:',
          type: 'password',
          mask: '*'
        }
      ] as inquirer.QuestionCollection[]
    }

    function inquireCustomJourneyTime(): any {
      return [
        {
          name: 'customJourneytime',
          message: 'Especifique sua jornada de trabalho no formato HH:MM :',
          type: 'input'
        }
      ] as inquirer.QuestionCollection[]
    }
 
    function meliFluxThirdStep(secondStepInquirer: any): inquirer.QuestionCollection[] {
      if (secondStepInquirer.isDefaultMeliWorktime === false) {
        return inquireCustomJourneyTime()
      }
      return [] as inquirer.QuestionCollection[]
    }

    function otherCompaniesFluxThirdStep(secondStepInquirer: any): inquirer.QuestionCollection[] {
      var inquiries = [] as inquirer.QuestionCollection[]

      if (secondStepInquirer.journeytime === OTHER) {
        inquiries = inquiries.concat(inquireCustomJourneyTime())
      }

      if (secondStepInquirer.provider === AHGORA) {
        inquiries = inquiries.concat(inquireAhgoraCredentials())
      }
      
      return inquiries
    }

    function meliFluxGenerateOptions(secondStepInquirer: any ,thirdStepInquirer: any): WorktimeProviderOptions {
      return {
        userId: secondStepInquirer.ahgoraUsername,
        password: secondStepInquirer.ahgoraPassword,
        systemId: 'ahgora',
        companyId: secondStepInquirer.whichMeli,
        date: moment().format('YYYY-MM-DD'),
        debug: false,
        journeyTime: secondStepInquirer.isDefaultMeliWorktime? '08:48' : thirdStepInquirer.customJourneytime,
        momentDate: moment()
      }
    }

    function otherCompaniesGenerateOptions(secondStepInquirer: any ,thirdStepInquirer: any): WorktimeProviderOptions {
      if (secondStepInquirer.provider === AHGORA) {
        return {
          userId: thirdStepInquirer.ahgoraUsername,
          password: thirdStepInquirer.ahgoraPassword,
          systemId: 'ahgora',
          companyId: secondStepInquirer.ahgoraCompanyId,
          date: moment().format('YYYY-MM-DD'),
          debug: false,
          journeyTime: secondStepInquirer.journeytime !== OTHER? secondStepInquirer.journeytime : thirdStepInquirer.customJourneytime,
          momentDate: moment()
        }
      } else {
        throw new CLIError("Somente o Ahgora é suportado no momento!")
      }
    }
    
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

    const loader = ora('Iniciando...').start()

    try {
      const worktimeProvider: WorktimeProvider = new Ahgora(fluxs[firstStepInquirer.isMeli].generateOptions(secondStepInquirer, thirdStepInquirer))
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

    let workedMinutesUntilNowOnConsole = ClockHelper.humanizeMinutesToClock(worktimeDayResume.workedMinutesUntilNow)

    if(worktimeDayResume.isMissingPairMark){
      workedMinutesUntilNowOnConsole = chalk.yellow(workedMinutesUntilNowOnConsole)
    }

    console.log('')
    console.log(`🔢 Batidas: ${marksToConsole.join('   ')}`)
    console.log(`⏸  Horas de pausas: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.breakMinutes)}`)
    console.log(`🆗 Horas registradas: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.registeredWorkedMinutes)}`)
    console.log(`⏺  Horas trabalhadas até este momento: ${workedMinutesUntilNowOnConsole}`)
    console.log('')
  }

  generateOptions(firstStepInquirer: any, secondStepInquirer: any ,thirdStepInquirer: any): WorktimeProviderOptions {
    let userId = thirdStepInquirer.ahgoraUsername
    let password = thirdStepInquirer.ahgoraPassword
    let companyId = ''
    let journeyTime = ''

    if (firstStepInquirer.isMeli === true) {
      companyId = secondStepInquirer.whichMeli
      if (secondStepInquirer.isDefaultMeliWorktime === true) {
        journeyTime = '08:48'
      }
    } else {
      companyId = secondStepInquirer.ahgoraCompanyId
    }

    if (thirdStepInquirer.customJourneytime) {
      journeyTime = thirdStepInquirer.customJourneytime
    }

    const temp = {
      userId: userId,
      password: password,
      systemId: 'ahgora',
      companyId: companyId,
      date: moment().format('YYYY-MM-DD'),
      debug: false,
      journeyTime: journeyTime,
      momentDate: moment()
    }
    return temp
  }
}
