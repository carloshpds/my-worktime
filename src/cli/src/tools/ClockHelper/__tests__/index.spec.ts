// eslint-disable-next-line @typescript-eslint/no-unused-vars
import moment from 'moment'
import 'moment/locale/pt-br'

import ClockHelper from '../index.js'

describe('Clock Helper', () => {
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

      it('Humanizes negative numbers', () => {
        const clock = ClockHelper.humanizeMinutesToClock(-1290)
        expect(clock).toBe('21:30')
      })
    })
  })

  describe('Format clock string', () => {
    it('Formats a valid clock string', () => {
      const formattedClock = ClockHelper.formatClockString('1010')
      expect(formattedClock).toBe('10:10')
    })

    it('Formats even when clock string is already done', () => {
      const formattedClock = ClockHelper.formatClockString('10:10')
      expect(formattedClock).toBe('10:10')
    })

    it('Displays an error for invalid clock pattern', () => {
      const errorTest = () => ClockHelper.formatClockString('010')
      expect(errorTest).toThrow(Error)
    })
  })
})
