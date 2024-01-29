import LocalSettingsManager from "../LocalSettingsManager/index.js"

export const runtimeDebug = (message: string, ...args: any[]) => {
  if (LocalSettingsManager.settings.get('options.isDebugEnabled')) {
    console.log(message, ...args)
  }
}