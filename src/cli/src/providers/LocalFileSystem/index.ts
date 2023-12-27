import { ux } from "@oclif/core";

import LocalConfigManager from "../../tools/LocalConfigManager/index.ts";
import WorktimeProvider from "../WorktimeProvider.ts";
import { WorktimeDayMark, WorktimeDayResume } from "../types.ts";

export default class LocalFileSystemProvider extends WorktimeProvider {
  async addMarksByClocksString(marksString: string): Promise<WorktimeDayResume> {
    const registeredMarks = await this.getDateMarks()
    const newMarks = marksString.split(',').map(clock => {

      if (this.options.debug) {
        ux.info(`Adicionando ${ux.colorize('blue', clock)} em ${ux.colorize('blue', this.options.date)}`)
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
}