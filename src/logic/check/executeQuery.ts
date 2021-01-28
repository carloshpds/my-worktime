import * as ora from 'ora'
import * as chalk from 'chalk'
import { WorktimeDayResume, WorktimeProviderOptions } from '../../providers/types'
import WorktimeProvider from '../../providers/WorktimeProvider'
import CheckDisplayer from './displayer'


export async function executeQuery(CurrentProviderClass: any, options: Partial<WorktimeProviderOptions>) {
  const loader = ora('Iniciando...').start()
  if (CurrentProviderClass) {
    try {
      const worktimeProvider: WorktimeProvider = new CurrentProviderClass(options)
      const displayer = new CheckDisplayer(worktimeProvider)
      loader.text = `Buscando dados no ${worktimeProvider.name}`

      const worktimeDayResume: WorktimeDayResume = await worktimeProvider.getWorktimeDayResume()

      if (worktimeDayResume.marks.length) {
        loader.succeed(`Dados encontrados, seu horário de saída ideal é ${chalk.black.bgGreen(' ' + worktimeDayResume.shouldLeaveClockTime + ' ')}`)
        displayer.displayResult(worktimeDayResume, options)
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


