import chalk from 'chalk'

import { WorktimeDayMark } from "../../providers/types.ts"
import { isMissingPairMark } from '../isMissingPairMark.ts'

export const prepareMarksToConsole = (marks: WorktimeDayMark[]): string[] => {
  const marksToConsole = marks.map((mark, index) => {
    const isLastMark = index === marks.length - 1
    let markOnConsole = formatMarkToConsole(mark)

    if (isLastMark && isMissingPairMark(marks)) {
      markOnConsole = chalk.yellow(mark.clock) + chalk.gray(' Batida ímpar')
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
      markOnConsole = chalk.yellow(mark.clock) + chalk.gray(' Batida ímpar')
    }

    return `${markOnConsole}`
  })

  console.log(`🔢 Batidas: ${marksToConsole.join('   ')}`)
}