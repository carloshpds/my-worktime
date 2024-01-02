import { WorktimeDayMark } from "../providers/types.ts"

export const isMissingPairMark = (marks: Array<WorktimeDayMark | string>): boolean => marks.length > 0 && marks.length % 2 === 1