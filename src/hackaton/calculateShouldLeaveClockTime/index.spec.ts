
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

    expect(shouldLeaveClockTime).toBe('17:00')
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

});