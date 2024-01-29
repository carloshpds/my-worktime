import { ux } from '@oclif/core'
import chalk from 'chalk'
import moment from 'moment'

import { translate } from '../tools/i18n/index.js'
import { DATE_REGEXP } from "./dateFormat.js"

export default validateRunningDateFormat

function validateRunningDateFormat(date: string) {
  return !DATE_REGEXP.test(date) || !moment().isValid()
}

export const validateRunningDate = (date: string) => {
  if (validateRunningDateFormat(date)) {
    ux.error(chalk.red(translate('cli.common.errors.invalidDateFormat')))
  }
}