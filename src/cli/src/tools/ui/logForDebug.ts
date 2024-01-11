import LocalSettingsManager from "../LocalSettingsManager/index.ts"

export const logForDebug = (message: string, ...args: any[]) => {
  if (LocalSettingsManager.settings.get('options.isDebugEnabled')) {
    console.log(message, ...args)
  }
}