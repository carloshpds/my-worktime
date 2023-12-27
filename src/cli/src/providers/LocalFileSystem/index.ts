import { ux } from "@oclif/core";
import moment from "moment";

import LocalConfigManager from "../../tools/LocalConfigManager/index.ts";
import WorktimeProvider from "../WorktimeProvider.ts";
import { WorktimeDayMark, WorktimeDayResume } from "../types.ts";

export default class LocalFileSystemProvider extends WorktimeProvider {
  async addMarksByClocksString(marksString: string): Promise<WorktimeDayResume> {
    const registeredMarks = await this.getDateMarks()
    const newMarksToValidate = marksString.split(',')
    const validNewMarks = this.validateNewMarksByClockStrings(registeredMarks, newMarksToValidate)

    const newMarks = validNewMarks.map(clock => {

      if (this.options.debug) {
        ux.info(`${ux.colorize('bgCyan', ' BATIDA ADICIONADA ')} ${ux.colorize('blue', clock)} em ${ux.colorize('blue', this.options.date)}`)
      }

      return { clock: clock.trim() }
    })

    const marks = [...registeredMarks, ...newMarks]
    const worktimeDayResume: WorktimeDayResume = this.calculateWorktimeDayResume(marks)
    LocalConfigManager.saveSettings({ custom: { marks: { [this.options.date]: marks } } })
    return worktimeDayResume
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]> {
    const settings = await LocalConfigManager.retrieveSettings()
    const registeredMarks = settings.custom?.marks?.[this.options.date] as WorktimeDayMark[] || []
    return registeredMarks
  }

  private validateNewMarksByClockStrings(registeredMarks: WorktimeDayMark[], newMarks: string[]): string[] {
    const validNewMarks = newMarks.filter(newMark => {
      const isRegistered = registeredMarks.find(mark => mark.clock === newMark)
      let validClock = true
      if (isRegistered) {
        ux.log(`${ux.colorize('bgYellow', ' BATIDA IGNORADA ')} ${ux.colorize('blue', newMark)} já está registrada em ${ux.colorize('blue', this.options.date)} (duplicada)`)
        validClock = false
      } else if (!/^\d{2}:\d{2}$/.test(newMark)) {
        ux.log(`${ux.colorize('bgYellow', ' BATIDA IGNORADA ')} ${ux.colorize('blue', newMark)} não está no formato correto (HH:mm)`)
        validClock = false
      } else if (moment().isBefore(moment(`${this.options.date} ${newMark}`, 'YYYY-MM-DD HH:mm'))) {
        ux.log(`${ux.colorize('bgYellow', ' BATIDA IGNORADA ')} ${ux.colorize('blue', newMark)} está no futuro`)
        validClock = false
      }

      return validClock
    })

    return validNewMarks
  }
}