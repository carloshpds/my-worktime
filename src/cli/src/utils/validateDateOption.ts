import chalk from 'chalk'
import moment from 'moment'

import { DATE_FORMAT, DATE_REGEXP } from "./dateFormat.ts"

export default validateRunningDateFormat

function validateRunningDateFormat(date: string) {
  return !DATE_REGEXP.test(date) || !moment().isValid()
}

export const validateRunningDate = (date: string) => {
  if (validateRunningDateFormat(date)) {
    // @ts-expect-error It will be dynamic context by command
    this.error(chalk.red(`Este formato de data é inválido, utilize o padrão ${DATE_FORMAT}`))
  }
}