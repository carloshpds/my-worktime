import { Flags } from "@oclif/core"
import { Flag } from "@oclif/core/lib/interfaces/index.js"
import moment from "moment"

import { translate } from "../tools/i18n/index.ts"


export default (): Record<string, Flag<any>> => {
  const today = moment()
  return {
    date: Flags.string({
      char: 'd',
      default: today.format('YYYY-MM-DD'),
      defaultHelp: translate('cli.common.flags.date.defaultHelp', {
        date: today.format('YYYY-MM-DD'),
        dateFormat: translate('cli.common.flags.date.universalDateFormat')
      }),
      description: translate('cli.common.flags.date.description', {
        dateFormat: translate('cli.common.flags.date.universalDateFormat')
      }),
    }),
    debug: Flags.boolean({ char: 'b', default: true, description: translate('cli.common.flags.debug.description') }),
    help: Flags.help({ char: 'h', description: translate('cli.common.flags.help.description') }),
    journeyTime: Flags.string({ char: 'j', default: '08:00', description: translate('cli.common.flags.journeyTime.description') }),
  }
}