import { WorktimeDayResume, WorktimeProviderOptions, WorktimeDayMark } from "../types"
import axios from "axios"
import * as qs from "qs"
import ClockHelper from "../../utils/ClockHelper"
import WorktimeProvider from "../WorktimeProvider"

export default class Ahgora extends WorktimeProvider {
  name = 'Ahgora'
  urls = {
    getDayResume: 'https://www.ahgora.com.br/externo/getApuracao'
  }

  constructor(options: WorktimeProviderOptions){
    super(options)
  }

  async getDateMarks(requestOptions?): Promise<WorktimeDayMark[]> {
    try {
      let marks: WorktimeDayMark[]

      const requestBody = {
        ano: this.options.momentDate.year(),
        company: this.options.companyId,
        senha: this.options.password,
        matricula: this.options.userId,
        mes: this.options.momentDate.month() + 1, // Not a zero based service
      }

      this.options.debug && console.log('\nRequest body', requestBody)
      const { data } = await axios.post(
        this.urls.getDayResume,
        qs.stringify(requestBody),
        requestOptions
      )
      this.options.debug && console.log('\nAhgora returned data', data)

      if(!data.error){
        const { dias } = data
        const dateResume = dias[this.options.momentDate.format('YYYY-MM-DD')]
        this.options.debug && console.log(`\nDATE ${this.options.momentDate.format('L')}`, dateResume)
        const dateMarks = dateResume.batidas

        marks = dateMarks.map((mark) => {
          return {
            clock: ClockHelper.formatClockString(mark.hora)
          }
        })

      } else {
        this.handleGetDateMarksError(data.error, requestBody)
      }

      return marks
    } catch (err) {
      throw err
    }
  }

  handleGetDateMarksError(errorCode: string, requestBody){
    const errorMap = {
      empty_required_data: 'Alguns dados obrigatórios não foram passados para a consulta',
      not_found: `Não foi possível recuperar os dados na data ${this.options.date}`
    }
    const formatedError = errorMap[errorCode] || errorCode
    console.log('\nREQUEST ERROR:', formatedError)
  }
}