import { Flags } from "@oclif/core"
import { Flag } from "@oclif/core/lib/interfaces/index.js"
import moment from "moment"

export default (): Record<string, Flag<any>> => ({
  date: Flags.string({ char: 'd', default: moment().format('YYYY-MM-DD'), description: 'Data relacionada a consulta de horas no padrão YYYY-MM-DD' }),
  debug: Flags.boolean({ char: 'b', default: true, description: 'Debug - Exibe mais informações na execução' }),
  help: Flags.help({ char: 'h' }),
  journeyTime: Flags.string({ char: 'j', default: '08:00', description: 'Quantidade de horas a serem trabalhadas por dia' }),
})