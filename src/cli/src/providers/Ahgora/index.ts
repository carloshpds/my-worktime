import axios from 'axios'

import ClockHelper from '../../utils/ClockHelper'
import WorktimeProvider from '../WorktimeProvider'
import { WorktimeDayMark } from '../types.js'
import { AhgoraDay, AhgoraDayMark, AhgoraMonthResume } from './types'
import { AhgoraDayMarkType } from './types/AhgoraDayMarkType'

export default class Ahgora extends WorktimeProvider {
  name = 'Ahgora'

  urls = {
    getDayResume: 'https://www.ahgora.com.br/externo/getApuracao',
  }

  async getDateMarks(requestOptions?): Promise<WorktimeDayMark[]> {
    // eslint-disable-next-line no-useless-catch
    try {
      let marks: WorktimeDayMark[] = []
      let data: AhgoraMonthResume

      const requestBody = {
        ano: this.options.momentDate.year(),
        company: this.options.companyId,
        matricula: this.options.userId,
        mes: this.options.momentDate.month() + 1, // Not a zero based service
        senha: this.options.password,
      }

      this.options.debug && console.log('\nRequest body', requestBody)
      if (this.options.useMocks) {
        data = require('./mocks/dayResume.mock.json')
      } else {
        const response = await axios.post(
          this.urls.getDayResume,
          requestBody,
          requestOptions
        )

        data = response.data
      }

      this.options.debug && console.log('\nAhgora returned data', data)


      if (data.error) {
        this.handleGetDateMarksError(data.error, requestBody)
      } else {
        const { dias } = data
        const dateResume: AhgoraDay = dias[this.options.momentDate.format('YYYY-MM-DD')]
        this.options.debug && console.log(`\nDATE ${this.options.momentDate.format('L')}`, dateResume)

        const ahgoraMarks = dateResume.batidas.filter((mark) => mark.tipo !== AhgoraDayMarkType.PUNCH)
        marks = ahgoraMarks.map(mark => ({
          clock: ClockHelper.formatClockString(mark.hora),
        }))

        if (dateResume.justificativa) {
          const justificationsMarks: WorktimeDayMark[] = dateResume.justificativa.map((justification) => ({
            clock: ClockHelper.formatClockString(justification.addPunch.punch),
            correction: {
              approved: justification.approved,
              approvedBy: justification.confirmado && justification.confirmado.usuario ? justification.confirmado.usuario : undefined,
              date: justification.data_batida,
              reason: justification.informacao ? justification.informacao.trim() : undefined,
            },
          }))

          marks = marks
            .concat(justificationsMarks)
            .sort((currentMark, nextMark) => ClockHelper.convertClockStringToMinutes(currentMark.clock) - ClockHelper.convertClockStringToMinutes(nextMark.clock))
        }


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
