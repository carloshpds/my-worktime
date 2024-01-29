export interface MWOptions {
}

export type MWOptionsKey = keyof MWOptions;

export interface MWStorageSettings {
  options: Partial<MWOptions>
  betaTesters: Array<string>
  custom: {}
}