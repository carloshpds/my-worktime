import {WorktimeDayMark} from '../types'
import axios from 'axios'
import ClockHelper from '../../utils/ClockHelper'
import WorktimeProvider from '../WorktimeProvider'

export default class Ahgora extends WorktimeProvider {
  name = 'Ahgora'

  urls = {
    getDayResume: 'https://www.ahgora.com.br/externo/getApuracao',
  }

  async getDateMarks(requestOptions?): Promise<WorktimeDayMark[]> {
    try {
      let marks: WorktimeDayMark[] = []

      const requestBody = {
        ano: this.options.momentDate.year(),
        company: this.options.companyId,
        senha: this.options.password,
        matricula: this.options.userId,
        mes: this.options.momentDate.month() + 1, // Not a zero based service
      }

      this.options.debug && this.log('\nRequest body', requestBody)
      const {data} = await axios.post(
        this.urls.getDayResume,
        requestBody,
        requestOptions
      )
      this.options.debug && this.log('\nAhgora returned data', data)

      // eslint-disable-next-line no-negated-condition
      if (!data.error) {
        const {dias} = data
        const dateResume = dias[this.options.momentDate.format('YYYY-MM-DD')]
        this.options.debug && console.log(`\nDATE ${this.options.momentDate.format('L')}`, dateResume)
        const dateMarks = dateResume.batidas

        marks = dateMarks.map(mark => {
          return {
            clock: ClockHelper.formatClockString(mark.hora),
          }
        })
      } else {
        this.handleGetDateMarksError(data.error, requestBody)
      }

      return marks
    } catch (error) {
      throw error
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleGetDateMarksError(errorCode: string, requestBody) {
    const errorMap = {
      empty_required_data: 'Alguns dados obrigatórios não foram passados para a consulta',
      not_found: `Não foi possível recuperar os dados na data ${this.options.date}`,
    }
    const formatedError = errorMap[errorCode] || errorCode
    console.log('\nREQUEST ERROR:', formatedError)
  }
}
