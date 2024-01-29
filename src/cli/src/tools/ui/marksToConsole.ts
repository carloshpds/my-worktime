import chalk from 'chalk'

import { WorktimeDayMark } from "../../providers/types.js"
import { isMissingPairMark } from '../../utils/isMissingPairMark.js'
import { translate } from '../i18n/index.js'


export const prepareMarksToConsole = (marks: WorktimeDayMark[]): string[] => {
  const marksToConsole = marks.map((mark, index) => {
    const isLastMark = index === marks.length - 1
    let markOnConsole = formatMarkToConsole(mark)

    if (isLastMark && isMissingPairMark(marks)) {
      markOnConsole = chalk.yellow(mark.clock) + chalk.gray(` ${translate('cli.common.display.oddMark')}`)
    }

    return `${markOnConsole}`
  })

  return marksToConsole
}


export const formatMarkToConsole = (mark: WorktimeDayMark): string => {
  let markOnConsole = chalk.blueBright(mark.clock)

  if (mark.correction) {
    markOnConsole = mark.correction.approved ? `${chalk.green('✔')} ${markOnConsole}` : `${chalk.yellow('o')} ${markOnConsole}`;
  }

  return markOnConsole
}


export const showMarks = (marks: WorktimeDayMark[]): void => {
  const marksToConsole = marks.map((mark, index) => {
    const isLastMark = index === marks.length - 1
    let markOnConsole = formatMarkToConsole(mark)

    if (isLastMark && isMissingPairMark(marks)) {
      markOnConsole = chalk.yellow(mark.clock) + chalk.gray(` ${translate('cli.common.display.oddMark')}`)
    }

    return `${markOnConsole}`
  })

  console.log(`🔢 ${translate('cli.common.display.mark', { count: marksToConsole.length })}: ${marksToConsole.join('   ')}`)
}