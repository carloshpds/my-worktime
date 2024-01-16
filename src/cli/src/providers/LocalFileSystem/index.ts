import { ux } from "@oclif/core";

import LocalSettingsManager from "../../tools/LocalSettingsManager/index.ts";
import { translate } from "../../tools/i18n/index.ts";
import filterValidMarks from "../../utils/filterValidMarksStrings.ts";
import WorktimeProvider from "../WorktimeProvider.ts";
import { WorktimeDayMark, WorktimeDayResume } from "../types.ts";

export default class LocalFileSystemProvider extends WorktimeProvider {
  async addMarksByClocksString(marksString: string): Promise<WorktimeDayResume> {
    const registeredMarks = await this.getDateMarks()
    const newMarksToValidate = marksString.split(',')
    const validNewMarks = filterValidMarks({ date: this.options.date, marksStrings: newMarksToValidate, registeredMarks })

    const newMarks = validNewMarks.map(clock => {

      const messages = {
        addedMark: translate('cli.common.display.addedMark')
      }

      const actionMarkFromDate = translate('cli.common.display.actionMarkFromDate', {
        action: ux.colorize('bgGreen', ` ${messages.addedMark.toUpperCase()} `),
        date: ux.colorize('blue', this.options.momentDate!.format('L')),
        mark: ux.colorize('blue', clock)
      })

      ux.info(actionMarkFromDate)

      return { clock: clock.trim() }
    })

    const marks = [...registeredMarks, ...newMarks]
    const worktimeDayResume: WorktimeDayResume = this.calculateWorktimeDayResume(marks)

    LocalSettingsManager.settings.set(`custom.marks.${this.options.date}`, marks)
    return worktimeDayResume
  }

  async deleteMarks(marksString?: string): Promise<WorktimeDayResume> {
    const registeredMarks = LocalSettingsManager.settings.get(`custom.marks.${this.options.date}`) as WorktimeDayMark[] || []
    const marksToDelete = marksString ? marksString.split(',') : []
    let finalDateMarks: WorktimeDayMark[] = []

    if (marksToDelete.length > 0) {
      const messages = {
        removedMark: translate('cli.common.display.removedMark')
      }

      if (this.options.debug) {
        ux.log(`Removendo ${ux.colorize('blue', `${marksToDelete.length}`)} batida(s) em ${ux.colorize('blue', this.options.date)}`)
      }

      for (const mark of marksToDelete) {
        // ux.info(`${ux.colorize('bgRed', ' BATIDA REMOVIDA ')} ${ux.colorize('blue', mark)} de ${ux.colorize('blue', this.options.date)}`)
        const actionMarkFromDate = translate('cli.common.display.actionMarkFromDate', {
          action: ux.colorize('bgRed', ` ${messages.removedMark.toUpperCase()} `),
          date: ux.colorize('blue', this.options.momentDate!.format('L')),
          mark: ux.colorize('blue', mark)
        })
        ux.info(actionMarkFromDate)
      }

      finalDateMarks = registeredMarks.filter(mark => !marksToDelete.includes(mark.clock))
    }

    LocalSettingsManager.settings.set(`custom.marks.${this.options.date}`, finalDateMarks)

    const worktimeDayResume: WorktimeDayResume = this.calculateWorktimeDayResume(finalDateMarks)
    return worktimeDayResume
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]> {
    const registeredMarks = LocalSettingsManager.settings.get(`custom.marks.${this.options.date}`) as WorktimeDayMark[] || []
    return registeredMarks
  }

  async resetMarks(): Promise<WorktimeDayResume> {
    const worktimeDayResume = await this.deleteMarks()
    return worktimeDayResume;
  }
}