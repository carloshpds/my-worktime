import { AnalyticsEvent } from "./types"

export const staticEvents = {
}

export const dynamicEvents = ({ value }: { value: string | number }): Record<string, AnalyticsEvent> => {
  return {
  }
}