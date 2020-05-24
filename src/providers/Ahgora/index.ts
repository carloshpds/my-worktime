import { WorktimeProvider, WorktimeDayResume, WorktimeProviderOptions, WorktimeDayMark } from "../types"
import axios from "axios"
import * as qs from "qs"
import ClockHelper from "../../utils/ClockHelper"
const old = require('./OldAhgora.js')

export default class Ahgora implements WorktimeProvider {
  name = 'Ahgora'
  urls = {
    getDayResume: 'https://www.ahgora.com.br/externo/getApuracao'
  }
  old = null
  options = null

  constructor(options: WorktimeProviderOptions){
    this.old = new old(options.userId, options.password)
    this.options = options
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
        console.log(`\nDATE ${this.options.momentDate.format('L')}`, dateResume)
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

  async getWorktimeDayResume(requestOptions?): Promise<WorktimeDayResume> {

    try {
      let marks: WorktimeDayMark[] = await this.getDateMarks()
      const worktimeDayResume: WorktimeDayResume = ClockHelper.calculateWorktimeDayResume(marks, this.options.date)
      return worktimeDayResume
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