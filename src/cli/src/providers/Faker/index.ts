import WorktimeProvider from "../WorktimeProvider";
import { WorktimeDayMark } from "../types";

export default class Faker extends WorktimeProvider {
  getDateMarks(requestOptions?: any): Promise<WorktimeDayMark[]> {
    const markCase = requestOptions.markCase || 'perfectDay'
    const marks = {
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