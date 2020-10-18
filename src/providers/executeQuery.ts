import * as ora from 'ora'
import * as chalk from 'chalk'
import { WorktimeDayResume, WorktimeProviderOptions } from './types'
import WorktimeProvider from './WorktimeProvider'
import ClockHelper from '../utils/ClockHelper'


export async function executeQuery(CurrentProviderClass: any, options: any, password: any) {
    const loader = ora('Iniciando...').start()
    if (CurrentProviderClass) {
        try {
            const worktimeProvider: WorktimeProvider = new CurrentProviderClass(options, password)
            loader.text = `Buscando dados no ${worktimeProvider.name}`

            const worktimeDayResume: WorktimeDayResume = await worktimeProvider.getWorktimeDayResume()

            if (worktimeDayResume.marks.length) {
                loader.succeed(`Dados encontrados, seu horário de saída ideal é ${chalk.black.bgGreen(' ' + worktimeDayResume.shouldLeaveClockTime + ' ')}`)
                await printResult(worktimeDayResume)
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

export async function printResult(worktimeDayResume: WorktimeDayResume) {
    const marksToConsole = worktimeDayResume.marks.map((mark, index) => {
        const isLastMark = index === worktimeDayResume.marks.length - 1
        let markOnConsole = chalk.green(mark.clock)

        if (isLastMark && worktimeDayResume.isMissingPairMark) {
            markOnConsole = chalk.yellow(mark.clock) + chalk.gray(' Batida ímpar')
        }

        return `${markOnConsole}`
    })

    let workedMinutesUntilNowOnConsole = ClockHelper.humanizeMinutesToClock(worktimeDayResume.workedMinutesUntilNow)

    if (worktimeDayResume.isMissingPairMark) {
        workedMinutesUntilNowOnConsole = chalk.yellow(workedMinutesUntilNowOnConsole)
    }

    console.log('')
    console.log(`🔢 Batidas: ${marksToConsole.join('   ')}`)
    console.log(`⏸  Horas de pausas: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.breakMinutes)}`)
    console.log(`🆗 Horas registradas: ${ClockHelper.humanizeMinutesToClock(worktimeDayResume.registeredWorkedMinutes)}`)
    console.log(`⏺  Horas trabalhadas até este momento: ${workedMinutesUntilNowOnConsole}`)
    console.log('')
}
