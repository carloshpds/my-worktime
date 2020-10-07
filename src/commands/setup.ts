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

    var secondStepQuestions = [] as inquirer.QuestionCollection[]

    if (firstStepInquirer.isMeli) {
      secondStepQuestions.push({
        name: 'isDefaultMeliWorktime',
        message: 'Você tem o expediente padrão do Meli (08:48)?',
        type: 'confirm',
        default: true
      },
      {
        name: 'whichMeli',
        message: 'Para qual BU você trabalha?',
        type: 'list',
        choices: [{name: MeliBUs.MARKETPLACE.name, value: MeliBUs.MARKETPLACE.code}, {name: MeliBUs.MERCADO_ENVIOS.name, value: MeliBUs.MERCADO_ENVIOS.code}]
      })
    } else {
      secondStepQuestions.push({
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
      })
    }

    let secondStepInquirer: any = await inquirer.prompt(secondStepQuestions)
    var thirdStepQuestions = [] as inquirer.QuestionCollection[]

    if (secondStepInquirer.journeytime === OTHER || secondStepInquirer.isDefaultMeliWorktime === false) {
      thirdStepQuestions.push({
        name: 'customJourneytime',
        message: 'Especifique sua jornada de trabalho no formato HH:MM :',
        type: 'input'
      })
    }

    if (firstStepInquirer.isMeli === true || secondStepInquirer.provider === AHGORA) {
      thirdStepQuestions.push({
        name: 'ahgoraUsername',
        message: 'Digite seu nome de usuário do Ahgora:',
        type: 'input'
      },
      {
        name: 'ahgoraPassword',
        message: 'Digite sua senha do Ahgora:',
        type: 'password',
        mask: '*'
      })
    }

    let thirdStepInquirer: any = await inquirer.prompt(thirdStepQuestions)

    const loader = ora('Iniciando...').start()

    try {
      const worktimeProvider: WorktimeProvider = new Ahgora(this.generateOptions(firstStepInquirer, secondStepInquirer, thirdStepInquirer))
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
