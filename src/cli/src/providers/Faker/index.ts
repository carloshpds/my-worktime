import WorktimeProvider from "../WorktimeProvider.ts";
import { WorktimeDayMark } from "../types.ts";

export default class Faker extends WorktimeProvider {
  async getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]> {
    const markCase = requestOptions.markCase || 'perfectDay'
    const marks: Record<string, WorktimeDayMark[]> = {
      perfectDay: [
        { clock: '09:00' },
        { clock: '12:00' },
        { clock: '13:00' },
        { clock: '18:00' },
      ]
    }

    return marks[markCase]
  }
}