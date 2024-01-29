
import { WorktimeDayMark } from "../../providers/types.js";
export interface MWOptions {
  isDebugEnabled: boolean
}

export type MWOptionsKey = keyof MWOptions;
export type MWPopupSettingsTab = 'mw';

export interface MWFeature {
  component?: string,
  icon: string,
  isAsyncComponent?: boolean;
  label?: string,
  value: string,
}
export interface MWFeatureToggle {
  isLoading?: boolean | string
  name: string,
  value: boolean,
}

export interface MWStoragePopupSettings {
  isSettingsFeatureBarCollapsed: boolean
  lastOpenedFeature?: string
  lastTabOpened: MWPopupSettingsTab
  theme: string
}

export type MWContentThemeValue = 'none';
export interface MWCustomPagesTheme {
}

export interface MWCustomStorageSettings {
  marks?: Partial<{
    [key: string]: Partial<WorktimeDayMark>[]
  }>
}

export interface MWStorageSettings {
  betaTesters: Array<string>
  custom: Partial<MWCustomStorageSettings>
  mwVersion: string;
  options: Partial<MWOptions>
  popupSettings: Partial<MWStoragePopupSettings>
}

export interface MWInMemorySettings {
}