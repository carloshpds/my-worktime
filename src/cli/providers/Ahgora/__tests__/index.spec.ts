import axios from 'axios';
import Ahgora from '../index';
import * as moment from 'moment'
import 'moment/locale/pt-br'
import { WorktimeProviderOptions } from '../../types';

// jest.mock('axios', () => {
//   return {
//     post: () => {
//       const mock = require('../mocks/dayResume.mock.json')
//       return {data: mock}
//     }
//   }
// })

jest.spyOn(axios, 'post').mockImplementation(() => {
  const mock = require('../mocks/dayResume.mock.json')
  return Promise.resolve({ data: mock })
})

const momentDate = moment()
const defaultOptions: WorktimeProviderOptions = {
  userId    : 'userId',
  password  : 'pass',
  systemId  : 'ahgora',
  companyId : 'xpto',
  date : momentDate.format('YYYY-MM-DD'),
  momentDate,
  debug     : false,
  journeyTime : '08:00',
}

describe('Ahgora', () => {

  describe('getDateMarks', () => {

    test('get marks and justifications', async () => {
      const date = moment('2021-01-11')
      const options = {
        ...defaultOptions,
        date: date.format('YYYY-MM-DD'),
        momentDate: date,
        journeyTime: '08:48'
      }

      const ahgoraProvider = new Ahgora(options)
      const marks = await ahgoraProvider.getDateMarks()
      expect(marks).toStrictEqual([
        { clock: '10:36' },
        { clock: '13:21' },
        { clock: '14:00',
          correction: {
            approved: true,
            approvedBy: 'xpto@mercadolivre.com',
            date: '2021-01-11',
            reason: 'entrei na replenishment e esqueci',
          },
        },
        { clock: '19:20'}
      ])
    })
  })
})