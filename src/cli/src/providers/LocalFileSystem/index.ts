import AppStorage from "../../utils/storage/index.js";
import WorktimeProvider from "../WorktimeProvider.js";
import { WorktimeDayMark, WorktimeDayResume } from "../types.js";

export default class LocalFileSystemProvider extends WorktimeProvider {
  async addMarksByClocksString(marksString: string) {
    const registeredMarks = await this.getDateMarks()
    const newMarks = marksString.split(' ').map(clock => {

      if (this.options.debug) {
        this.log(`Adding ${clock} on ${this.options.date}`);
      }

      return { clock }
    })

    const marks = [...registeredMarks, ...newMarks]
    const worktimeDayResume: WorktimeDayResume = this.calculateWorktimeDayResume(marks)
    return worktimeDayResume
  }

  async getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]> {
    const settings = await AppStorage.getLocalFileSettings()
    const registeredMarks = settings.custom?.marks?.[this.options.date] || []
    return registeredMarks
  }
}