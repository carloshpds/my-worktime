
/**
 * Imports
 */
import { WorktimeDayMark, WorktimeDayWorkedTime, WorktimeProviderOptions } from '../../providers/types'
import * as moment from "moment"
import "moment/locale/pt-br"
import WorktimeProvider from '../../providers/WorktimeProvider';
import calculateShouldLeaveClockTime from '.';

/**
 * Locals
 */
const momentDate = moment('2020-01-01')
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

/**
 * Tests
 */
describe('Calculate "should leave clock time"', () => {
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
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('18:00')
  })

  it('Calulates to perfect early default pairs', () => {
    jest
    .spyOn(global.Date, 'now')
    .mockImplementationOnce(() =>
      new Date('2020-01-01T18:00:00').valueOf()
    )

    const marks: WorktimeDayMark[] = [
      { clock: '08:00'},
      { clock: '12:00'},
      { clock: '13:00'},
      { clock: '17:00'}
    ]

    const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
    const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('17:00')
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
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('18:00')
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
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('18:00')
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
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('18:00')
  })

  it('Calulates to values less than an hour', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2020-01-01T16:00:00').valueOf()
      )
    const marks: WorktimeDayMark[] = [
      { clock: '08:00'},
      { clock: '08:45'}
    ]

    const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
    const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('16:00')
  })

  it('Calulates to only one mark (disconsidering break time)', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2020-01-01T12:00:00').valueOf()
      )

    const marks: WorktimeDayMark[] = [
      { clock: '09:00'},
    ]

    const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
    const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('17:00')
  })

  it('Calulates too many pairs', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2020-01-01T12:00:00').valueOf()
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
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('18:07')
  })

  it('Calulates pair marks with less than 8h total (case 1)', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2020-01-01T12:00:00').valueOf()
      )

    const marks: WorktimeDayMark[] = [
      { clock: '09:07'},
      { clock: '12:00'}, // +2:53
      { clock: '13:00'},
      { clock: '15:20'}, // +2:20 -> 5:13 total
    ]

    const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
    const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('18:07')
  })

  it('Calulates odd marks with less than 8h total (case 2)', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2020-01-01T12:00:00').valueOf()
      )

    const marks: WorktimeDayMark[] = [
      { clock: '09:07'},
      { clock: '12:00'}, // +2:53
      { clock: '13:00'},
    ]

    const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
    const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('18:07')
  })

  it('Calulates odd marks with less than 8h total (case 3)', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2020-01-01T12:00:00').valueOf()
      )

    const marks: WorktimeDayMark[] = [
      { clock: '09:07'},
      { clock: '12:00'}, // +2:53
      { clock: '13:00'},
      { clock: '14:00'}, // +1:00
      { clock: '14:30'},
    ]

    const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
    const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('18:37')
  })

  it('Calulates odd marks with less than 8h total (case 4)', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2020-01-01T12:00:00').valueOf()
      )

    const marks: WorktimeDayMark[] = [
      { clock: '09:07'},
      { clock: '12:22'}, // +3:15
      { clock: '12:56'},
      { clock: '14:00'}, // +1:04
      { clock: '14:30'},
      { clock: '15:27'}, // 0:57
      { clock: '17:30'},
    ]

    const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
    const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('20:14')
  })

  it('Calulates odd marks with less than 8h total (case 5)', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2020-01-01T12:00:00').valueOf()
      )

    const marks: WorktimeDayMark[] = [
      { clock: '09:07'},
      { clock: '12:22'}, // +3:15
      { clock: '12:56'},
      { clock: '14:00'}, // +1:04
      { clock: '14:30'},
      { clock: '15:27'}, // 0:57
      { clock: '17:30'},
      { clock: '17:40'}, // 0:10
      { clock: '18:30'},
    ]

    const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
    const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('21:04')
  })

  it('Calulates odd marks with less than 8h total (case 6)', () => {
    jest
      .spyOn(global.Date, 'now')
      .mockImplementationOnce(() =>
        new Date('2020-01-01T12:00:00').valueOf()
      )

    const marks: WorktimeDayMark[] = [
      { clock: '09:00'},
      { clock: '09:15'}, // +0:15
      { clock: '15:40'},
    ]

    const worktimeProvider: WorktimeProvider = new AbstractProvider(defaultOptions)
    const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
    const shouldLeaveClockTime = calculateShouldLeaveClockTime({
      ...worktimeDayResume,
      marks,
    })

    expect(shouldLeaveClockTime).toBe('23:25')
  })

});