import axios from 'axios';
import moment from 'moment'
import 'moment/locale/pt-br'

import { WorktimeProviderOptions } from '../../types.js';
import Ahgora from '../index.js';

jest.spyOn(axios, 'post').mockImplementation(() => {
  const mock = require('../mocks/dayResume.mock.json')
  return Promise.resolve({ data: mock })
})

const momentDate = moment()
const defaultOptions: WorktimeProviderOptions = {
  companyId: 'xpto',
  date: momentDate.format('YYYY-MM-DD'),
  debug: false,
  journeyTime: '08:00',
  momentDate,
  password: 'pass',
  systemId: 'ahgora',
  userId: 'userId',
}

describe('Ahgora', () => {

  describe('getDateMarks', () => {

    test('get marks and justifications', async () => {
      const date = moment('2021-01-11')
      const options = {
        ...defaultOptions,
        date: date.format('YYYY-MM-DD'),
        journeyTime: '08:48',
        momentDate: date
      }

      const ahgoraProvider = new Ahgora(options)
      const marks = await ahgoraProvider.getDateMarks()
      expect(marks).toStrictEqual([
        { clock: '10:36' },
        { clock: '13:21' },
        {
          clock: '14:00',
          correction: {
            approved: true,
            approvedBy: 'xpto@mercadolivre.com',
            date: '2021-01-11',
            reason: 'entrei na replenishment e esqueci',
          },
        },
        {
          clock: '19:20',
          correction: {
            approved: false,
            approvedBy: "xpto@mercadolivre.com",
            date: "2021-01-11",
            reason: "Esqueci totalmente",
          },
        }
      ])
    })
  })
})