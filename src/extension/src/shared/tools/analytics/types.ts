
export interface AnalyticsEvent {
  category: string
  label: string
  action: string
  value?: string | number
}

export type AnalyticsCustomDimention = 'name' | 'companyId'