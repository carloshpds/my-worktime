
import * as moment from 'moment'
import 'moment/locale/pt-br'

import { WorktimeDayMark, WorktimeDayWorkedTime, WorktimeProviderOptions } from '../../providers/types.js'
import WorktimeProvider from '../WorktimeProvider.js'

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

class AbstractProvider extends WorktimeProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]> {
    return [
      { clock: '09:00' },
      { clock: '12:00' },
      { clock: '13:00' },
      { clock: '18:00' },
    ]
  }
}

describe('WorktimeProvier', () => {
  describe('Calculations', () => {
    describe('Calculate interval Of Mark Pairs', () => {
      it('Calulates to perfect default pairs', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00' },
          { clock: '12:00' },
          { clock: '13:00' },
          { clock: '21:00' },
        ]
        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const minutes = worktimeProvider.calculateBreakMinutes(marks)
        expect(minutes).toBe(60)
      })

      it('Calulates to many pairs', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00' },
          { clock: '12:00' },
          { clock: '13:00' },
          { clock: '21:00' },
          { clock: '22:00' },
          { clock: '23:00' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const minutes = worktimeProvider.calculateBreakMinutes(marks)
        expect(minutes).toBe(120)
      })

      it('Calulates to odd marks', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00' },
          { clock: '12:00' },
          { clock: '13:00' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const minutes = worktimeProvider.calculateBreakMinutes(marks)
        expect(minutes).toBe(60)
      })

      it('Calulates to odd marks', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00' },
          { clock: '12:00' },
          { clock: '13:00' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const minutes = worktimeProvider.calculateBreakMinutes(marks)
        expect(minutes).toBe(60)
      })

      it('Calulates to values less than an hour', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00' },
          { clock: '12:00' },
          { clock: '12:25' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const minutes = worktimeProvider.calculateBreakMinutes(marks)
        expect(minutes).toBe(25)
      })
    })

    describe('Calculate worktime', () => {
      const currentMomentDate = moment('2020-01-01T18:00:00')

      it('Calulates to perfect default pairs', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T18:00:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:00' },
          { clock: '12:00' },
          { clock: '13:00' },
          { clock: '18:00' },
        ]
        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        expect(worktimeDayResume.registeredWorkedMinutes).toBe(60 * 8)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(60 * 8)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:00')
        expect(worktimeDayResume.missingMinutesToCompleteJourney).toBe(0)
        expect(worktimeDayResume.isMissingPairMark).toBe(false)
      })

      it('Calulates to many pairs', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T23:30:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:00' },
          { clock: '12:00' }, // +3
          { clock: '13:00' },
          { clock: '21:00' }, // +8
          { clock: '22:00' },
          { clock: '23:00' }, // +1
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const twelveHours = 60 * 12
        const fourExtraHours = -(60 * 4)

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(twelveHours)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(twelveHours)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:00')
        expect(worktimeDayResume.missingMinutesToCompleteJourney).toBe(fourExtraHours)
        expect(worktimeDayResume.isMissingPairMark).toBe(false)
      })

      it('Calulates to many pairs', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T23:30:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:07' },
          { clock: '12:00' }, // +2:53
          { clock: '13:00' },
          { clock: '21:20' }, // +8:20 -> 11h13 total
          { clock: '22:14' },
          { clock: '23:10' }, // +0:56 -> 12h09 total
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const dailyWorkedTimeInMinutes = 729

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:07')
        expect(worktimeDayResume.isMissingPairMark).toBe(false)
      })

      it('Calulates pair marks with less than 8h total', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T23:30:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:07' },
          { clock: '12:00' }, // +2:53
          { clock: '13:00' },
          { clock: '15:20' }, // +2:20 -> 5:13 total
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const dailyWorkedTimeInMinutes = 313

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:07')
        expect(worktimeDayResume.isMissingPairMark).toBe(false)
      })

      it('Calulates odd marks with less than 8h total (case 1)', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T13:00:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:07' },
          { clock: '12:00' }, // +2:53
          { clock: '13:00' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const dailyWorkedTimeInMinutes = 173

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:07')
        expect(worktimeDayResume.isMissingPairMark).toBe(true)
      })

      it('Calulates odd marks with less than 8h total (case 2)', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T14:30:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:07' },
          { clock: '12:00' }, // +2:53
          { clock: '13:00' },
          { clock: '14:00' }, // +1:00
          { clock: '14:30' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const dailyWorkedTimeInMinutes = 233

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:37')
        expect(worktimeDayResume.isMissingPairMark).toBe(true)
      })

      it('Calulates odd marks with less than 8h total (case 3)', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T18:30:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:07' },
          { clock: '12:22' }, // +3:15
          { clock: '12:56' },
          { clock: '14:00' }, // +1:04
          { clock: '14:30' },
          { clock: '15:27' }, // 0:57
          { clock: '17:30' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const dailyWorkedTimeInMinutes = 316
        const workedMinutesUntilNow = 316 + 60

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(workedMinutesUntilNow)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('20:14')
        expect(worktimeDayResume.isMissingPairMark).toBe(true)
      })

      it('Calulates odd marks with less than 8h total (case 4)', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T18:30:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:07' },
          { clock: '12:22' }, // +3:15
          { clock: '12:56' },
          { clock: '14:00' }, // +1:04
          { clock: '14:30' },
          { clock: '15:27' }, // 0:57
          { clock: '17:30' },
          { clock: '17:40' }, // 0:10
          { clock: '18:30' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const dailyWorkedTimeInMinutes = 326

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('21:04')
        expect(worktimeDayResume.isMissingPairMark).toBe(true)
      })

      it('Calulates odd marks with more than 8h total (case 5)', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T19:00:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:07' },
          { clock: '12:00' }, // +2:53
          { clock: '13:20' },
          { clock: '18:30' }, // +5:10
          { clock: '19:00' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const dailyWorkedTimeInMinutes = 483

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:27')
        expect(worktimeDayResume.isMissingPairMark).toBe(true)
      })

      it('Calulates to many odd marks', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T23:59:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:00' },
          { clock: '12:00' }, // +3
          { clock: '13:00' },
          { clock: '21:00' }, // +8
          { clock: '22:00' },
          // 23:59 = +1:59
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const elevenHours = 60 * 11
        const twelveHoursAndFifthNineMinutes = elevenHours + 119 // 119 = 1h + 59m
        const threeExtraHoursAndFifthNineMinutes = -(60 * 3 + 119) // 119 = 1h + 59m

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(elevenHours)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(twelveHoursAndFifthNineMinutes)
        expect(worktimeDayResume.missingMinutesToCompleteJourney).toBe(threeExtraHoursAndFifthNineMinutes)

      })

      it('Calulates to odd marks', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T18:00:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:00' },
          { clock: '12:00' },
          { clock: '13:00' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const threeHours = 60 * 3
        const eightHours = 60 * 8 // 18:00 now

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(threeHours)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(eightHours)
        expect(worktimeDayResume.missingMinutesToCompleteJourney).toBe(0)
      })

      it('Calulates to values less than an hour', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00' },
          { clock: '09:45' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const fortyfiveMinutes = 45

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(fortyfiveMinutes)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(fortyfiveMinutes)
      })

      it('Calculates max value as last pair mark for odd marks when today is not the informed date', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-02T09:00:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:00' },
          { clock: '12:00' },
          { clock: '13:00' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const threeHours = 60 * 3

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(threeHours)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(threeHours)
      })

      it('Odd marks using less than 1 hour on breakMinutes', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T18:00:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:10' },
          { clock: '12:27' },
          { clock: '13:19' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const threeHoursAndSeventeenMinutes = 60 * 3 + 17
        const sevenHoursAndFifithMinutes = 60 * 7 + 58

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(threeHoursAndSeventeenMinutes)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(sevenHoursAndFifithMinutes)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:02')
      })

      it('Odd marks using less than 1 hour on breakMinutes and custom journeyTime', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T18:00:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:10' },
          { clock: '12:27' },
          { clock: '13:19' },
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider({
          ...defaultOptions,
          journeyTime: '08:48'
        })
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const threeHoursAndSeventeenMinutes = 60 * 3 + 17
        const sevenHoursAndFifithMinutes = 60 * 7 + 58

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(threeHoursAndSeventeenMinutes)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(sevenHoursAndFifithMinutes)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:50')
      })
    })
  })
})
