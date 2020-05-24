import ClockHelper from '..'
import { WorktimeDayMark, WorktimeDayWorkedTime } from '../../../providers/types';
import * as moment from "moment"
import "moment/locale/pt-br"


describe('Date Helper', () => {

  describe('Convert hour string (clock format) in minutes', () => {

    describe('Clocks using the default HH:mm format', () => {
      it('Converts one hour without minutes', () => {
        const minutes = ClockHelper.convertClockStringToMinutes('01:00')
        expect(minutes).toBe(60)
      })

      it('Converts one hour with minutes', () => {
        const minutes = ClockHelper.convertClockStringToMinutes('01:30')
        expect(minutes).toBe(90)
      })

      it('Converts only minutes', () => {
        const minutes = ClockHelper.convertClockStringToMinutes('00:20')
        const minutes2 = ClockHelper.convertClockStringToMinutes('00:59')

        expect(minutes).toBe(20)
        expect(minutes2).toBe(59)
      })
    })
  })

  describe('Humanize minutes to Clock format', () => {

    describe('Clocks using the default HH:mm format', () => {

      it('Humanizes one perfect hour', () => {
        const clock = ClockHelper.humanizeMinutesToClock(60)
        expect(clock).toBe('01:00')
      })

      it('Humanizes one hour and half', () => {
        const clock = ClockHelper.humanizeMinutesToClock(90)
        expect(clock).toBe('01:30')
      })

      it('Humanizes a not zero hour', () => {
        const clock = ClockHelper.humanizeMinutesToClock(1290)
        expect(clock).toBe('21:30')
      })
    })
  })

  describe('Format clock string', () => {
    it('Formats a valid clock string', () => {
      const formattedClock = ClockHelper.formatClockString('1010')
      expect(formattedClock).toBe('10:10')
    })

    it('Displays an error for invalid clock pattern', () => {
      const errorTest = () => ClockHelper.formatClockString('010')
      expect(errorTest).toThrow(Error)
    })
  });

  describe('Calculate interval Of Mark Pairs', () => {
    it('Calulates to perfect default pairs', () => {
      const marks: WorktimeDayMark[] = [
        { clock: '09:00'},
        { clock: '12:00'},
        { clock: '13:00'},
        { clock: '21:00'}
      ]
      const minutes = ClockHelper.calculateBreakMinutes(marks)
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
      const minutes = ClockHelper.calculateBreakMinutes(marks)
      expect(minutes).toBe(120)
    })

    it('Calulates to odd marks', () => {
      const marks: WorktimeDayMark[] = [
        { clock: '09:00'},
        { clock: '12:00'},
        { clock: '13:00'}
      ]
      const minutes = ClockHelper.calculateBreakMinutes(marks)
      expect(minutes).toBe(60)
    })

    it('Calulates to odd marks', () => {
      const marks: WorktimeDayMark[] = [
        { clock: '09:00'},
        { clock: '12:00'},
        { clock: '13:00'}
      ]
      const minutes = ClockHelper.calculateBreakMinutes(marks)
      expect(minutes).toBe(60)
    })

    it('Calulates to values less than an hour', () => {
      const marks: WorktimeDayMark[] = [
        { clock: '09:00'},
        { clock: '12:00'},
        { clock: '12:25'},
      ]
      const minutes = ClockHelper.calculateBreakMinutes(marks)
      expect(minutes).toBe(25)
    })
  })

  describe('Calculate worktime', () => {
    const currentMomentDate = moment('2020-01-01T18:00:00')

    it('Calulates to perfect default pairs', () => {
      const marks: WorktimeDayMark[] = [
        { clock: '09:00'},
        { clock: '12:00'},
        { clock: '13:00'},
        { clock: '18:00'}
      ]
      const worktimeDayResume: WorktimeDayWorkedTime = ClockHelper.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
      expect(worktimeDayResume.registeredWorkedMinutes).toBe(60 * 8)
      expect(worktimeDayResume.workedMinutesUntilNow).toBe(60 * 8)
    })

    it('Calulates to many pairs', () => {
      const marks: WorktimeDayMark[] = [
        { clock: '09:00'},
        { clock: '12:00'}, // +3
        { clock: '13:00'},
        { clock: '21:00'}, // +8
        { clock: '22:00'},
        { clock: '23:00'}, // +1
      ]
      const worktimeDayResume: WorktimeDayWorkedTime = ClockHelper.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
      const twelveHours = 60 * 12
      expect(worktimeDayResume.registeredWorkedMinutes).toBe(twelveHours)
      expect(worktimeDayResume.workedMinutesUntilNow).toBe(twelveHours)
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
      const worktimeDayResume: WorktimeDayWorkedTime = ClockHelper.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
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
      const worktimeDayResume: WorktimeDayWorkedTime = ClockHelper.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
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
      const worktimeDayResume: WorktimeDayWorkedTime = ClockHelper.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
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

      const worktimeDayResume: WorktimeDayWorkedTime = ClockHelper.calculateWorkedTimeMinutes(marks, currentMomentDate.format())
      const threeHours = 60 * 3

      expect(worktimeDayResume.registeredWorkedMinutes).toBe(threeHours)
      expect(worktimeDayResume.workedMinutesUntilNow).toBe(threeHours)
    });
  });
});