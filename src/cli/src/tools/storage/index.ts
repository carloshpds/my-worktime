import logger from "js-logger";
const Logger = logger.default;

import deepAssign from "../../utils/deepAssign.ts";
import { MWInMemorySettings, MWStorageSettings } from "./types.ts";

class AppStorage {

  defaultSettings: Partial<MWStorageSettings> = {
    betaTesters: [],
    custom: {
    },
    options: {
    },
    popupSettings: {
    },
  }

  inMemorySettings: MWInMemorySettings = {
    pagesThemesOptionsMap: {}
  }

  settings: Partial<MWStorageSettings> = {};
  settingsKey = 'mwSettings'

  clear(strategy: 'local' | 'sync' = 'sync'): Promise<MWStorageSettings | any> {
    return new Promise((resolve, reject) => {
      try {
        if (window.browser.storage) {
          window.browser.storage[strategy].clear((response: any) => {
            resolve(response)
          });
        }
      } catch (error) {
        reject(error);
      }
    })
  }

  downloadSettings() {
    const clonedSettings = { ...this.settings }
    clonedSettings.betaTesters = undefined

    const stringified = JSON.stringify(clonedSettings, null, 2);
    const blob = new Blob([stringified], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    window.browser.downloads.download({ filename: 'mw-settings.json', saveAs: true, url })
  }

  get(key?: string | string[], strategy: 'local' | 'sync' = 'sync'): Promise<MWStorageSettings | any> {
    return new Promise((resolve, reject) => {
      try {
        if (window.browser.storage) {
          window.browser.storage[strategy].get(key, (response: any) => {
            resolve(response)
          });
        } else {
          resolve(JSON.parse(window.localStorage.getItem(key)));
        }
      } catch (error) {
        reject(error);
      }
    })
  }

  async getLocalFileSettings(): Promise<Partial<MWStorageSettings>> {
    let settings = {}

    const configManager = await import('../LocalSettingsManager/index.ts')
    settings = configManager.default.settings

    return settings
  }

  remove(key: string, strategy: 'local' | 'sync' = 'sync') {
    return new Promise((resolve, reject) => {
      try {
        if (window.browser.storage) {
          window.browser.storage[strategy].remove(key, (response: any) => {
            resolve(response)
          });
        } else {
          resolve(window.localStorage.removeItem(key));
        }
      } catch (error) {
        reject(error);
      }
    })
  }

  set(data: any, strategy: 'local' | 'sync' = 'sync') {
    return new Promise((resolve, reject) => {
      try {
        if (window.browser.storage) {
          window.browser.storage[strategy].set(data, (response: any) => {
            window.browser.runtime.lastError ? reject(window.browser.runtime.lastError) : undefined
            resolve(response)
          });
        }
      } catch (error) {
        reject(error);
      }
    })
  }

  async setup(uploadedSettings?: Partial<MWStorageSettings>) {
    try {
      Logger.debug('⚙️ Setup storage')

      uploadedSettings && Logger.debug('⚙️ Loading uploaded settings', uploadedSettings)
      const settings = uploadedSettings || await this.getLocalFileSettings()

      if (settings && Object.keys(settings).length > 0) {
        try {
          Logger.debug('⚙️ Loaded settings from storage', settings)
        } catch {
          Logger.debug('⚙️ Loaded settings from storage', JSON.stringify(settings))
        }

        deepAssign<Partial<MWStorageSettings>>(this.settings, this.defaultSettings, settings)
        this.settings.betaTesters = this.defaultSettings.betaTesters
        // this.settings.mwVersion = manifest.version


        try {
          Logger.debug("⚙️ configured settings in browser's memory", this.settings)
          Logger.debug('⚙️ In memory settings', this.inMemorySettings)
        } catch {
          Logger.debug("⚙️ configured settings in browser's memory", JSON.stringify(settings))
        }

      } else {
        Object.assign(this.settings, this.defaultSettings)
        Logger.debug('⚙️ Setup settings as defaults', JSON.stringify(this.settings))
      }

      this.updateSettings()
    } catch (error) {
      Logger.error(error)
    }
  }

  updateSettings(): Promise<any> {
    try {
      Logger.debug('⚙️ Update settings', this.settings)
    } catch (error) {
      Logger.error('[updateSettings]', error)
      Logger.debug('⚙️ Update settings', JSON.stringify(this.settings))
    }

    return this.set(this.settings)
  }

  uploadSettingsByFile(file: any) {
    const reader = new FileReader();
    reader.addEventListener('load', (e) => {
      const contents = e.target?.result as string;
      const jsonSettingsContent = JSON.parse(contents);

      Logger.debug('⚙️⬆️ Uploaded settings', jsonSettingsContent)
      this.setup(jsonSettingsContent)
    });

    reader.onerror = function () {
      Logger.error('⚙️ Error reading settings file', reader.error);
    };

    reader.readAsText(file);
  }
}

export default new AppStorage()