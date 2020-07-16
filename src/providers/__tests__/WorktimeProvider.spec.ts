import ClockHelper from '../../utils/ClockHelper'
import { WorktimeDayMark, WorktimeDayWorkedTime, WorktimeProviderOptions } from '../../providers/types';
import * as moment from "moment"
import "moment/locale/pt-br"
import WorktimeProvider from '../WorktimeProvider'

const momentDate = moment()
const defaultOptions: WorktimeProviderOptions = {
  userId    : 'userId',
  password  : 'pass',
  systemId  : 'ahgora',
  companyId : 'xpto',
  date : momentDate.format('YYYY-MM-DD'),
  momentDate,
  debug     : false,
  journeyTime : '08:00'
}

class AbstractProvider extends WorktimeProvider {
  async getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]> {
    return [
      { clock: '09:00'},
      { clock: '12:00'},
      { clock: '13:00'},
      { clock: '18:00'}
    ]
  }

}

describe('WorktimeProvier', () => {

  describe('Calculations', () => {
    describe('Calculate interval Of Mark Pairs (Break)', () => {
      it('Calulates to perfect default pairs', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'},
          { clock: '21:00'}
        ]
        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const minutes = worktimeProvider.calculateBreakMinutes(marks)
        expect(minutes).toBe(60)
      })

      it('Calulates to many pairs', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'},
          { clock: '21:00'},
          { clock: '22:00'},
          { clock: '23:00'},
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const minutes = worktimeProvider.calculateBreakMinutes(marks)
        expect(minutes).toBe(120)
      })

      it('Calulates to odd marks', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'}
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const minutes = worktimeProvider.calculateBreakMinutes(marks)
        expect(minutes).toBe(60)
      })

      it('Calulates to odd marks', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'}
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const minutes = worktimeProvider.calculateBreakMinutes(marks)
        expect(minutes).toBe(60)
      })

      it('Calulates to values less than an hour', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '12:25'},
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
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'},
          { clock: '18:00'}
        ]
        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        expect(worktimeDayResume.registeredWorkedMinutes).toBe(60 * 8)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(60 * 8)
        // expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:00')
        expect(worktimeDayResume.isMissingPairMark).toBe(false)
      })

      it('Calulates to many pairs', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T23:30:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'}, // +3
          { clock: '13:00'},
          { clock: '21:00'}, // +8
          { clock: '22:00'},
          { clock: '23:00'}, // +1
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const twelveHours = 60 * 12

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(twelveHours)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(twelveHours)
        // expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:00')
        expect(worktimeDayResume.isMissingPairMark).toBe(false)
      })

      it('Calulates to many pairs', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T23:30:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:07'},
          { clock: '12:00'}, // +2:53
          { clock: '13:00'},
          { clock: '21:20'}, // +8:20 -> 11h13 total
          { clock: '22:14'},
          { clock: '23:10'}, // +0:56 -> 12h09 total
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const dailyWorkedTimeInMinutes = 729

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(dailyWorkedTimeInMinutes)
        expect(worktimeDayResume.shouldLeaveClockTime).toBe('18:07')
        expect(worktimeDayResume.isMissingPairMark).toBe(false)
      })

      it('Calulates to many odd marks', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T23:59:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'}, // +3
          { clock: '13:00'},
          { clock: '21:00'}, // +8
          { clock: '22:00'},
          // 23:59 = +1:59
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const elevenHours = 60 * 11
        const twelveHoursAndFifthNineMinutes = elevenHours + 119 // 119 = 1h + 59m

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(elevenHours)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(twelveHoursAndFifthNineMinutes)
      })

      it('Calulates to odd marks', () => {
        jest
          .spyOn(global.Date, 'now')
          .mockImplementationOnce(() =>
            new Date('2020-01-01T18:00:00').valueOf()
          )

        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'}
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const threeHours = 60 * 3
        const eightHours = 60 * 8 // 18:00 now

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(threeHours)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(eightHours)
      })

      it('Calulates to values less than an hour', () => {
        const marks: WorktimeDayMark[] = [
          { clock: '09:00'},
          { clock: '09:45'}
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
          { clock: '09:00'},
          { clock: '12:00'},
          { clock: '13:00'}
        ]

        const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
        const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
        const threeHours = 60 * 3

        expect(worktimeDayResume.registeredWorkedMinutes).toBe(threeHours)
        expect(worktimeDayResume.workedMinutesUntilNow).toBe(threeHours)
      });
    });
  })
});
