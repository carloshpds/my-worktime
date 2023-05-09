import Logger from "js-logger";
import analytics from "../analytics";
import { customDimentions } from "../analytics/dimentions";
import { MWStorageSettings } from "./types";

class BrowserStorage {

  settingsKey = 'mwSettings'
  settings: Partial<MWStorageSettings> = {
    options: {}, betaTesters: [], custom: { players: { marks: {} } }
  };
  defaultSettings: Partial<MWStorageSettings> = {
    options: {
    },
    betaTesters: [],
    custom: {
    },
  }

  async setup() {
    try {
      const settings = await this.get() as Partial<MWStorageSettings> || {} as Partial<MWStorageSettings>
      if (settings && Object.keys(settings).length) {
        try {
          Logger.debug('⚙️ Loaded settings from storage', settings)
        } catch (err) {
          Logger.debug('⚙️ Loaded settings from storage', JSON.stringify(settings))
        }
        Object.assign(this.settings.options!, this.defaultSettings.options, settings.options || {})
        Object.assign(this.settings.custom!, this.defaultSettings.custom, settings.custom || {})
        this.settings.betaTesters = this.defaultSettings.betaTesters
        try {
          Logger.debug('⚙️ configured settings in memory', this.settings)
        } catch (err) {
          Logger.debug('⚙️ configured settings in memory', JSON.stringify(settings))
        }

        for(const [key, value] of Object.entries(this.settings.options!)) {
          if(!customDimentions[key]) continue
          analytics.set(customDimentions[key], value ? 'true' : 'false')
        }
      } else {
        Object.assign(this.settings, this.defaultSettings)
        Logger.debug('⚙️ Setup settings as defaults', JSON.stringify(this.settings))
      }
      this.updateSettings()
    } catch (err) {
      analytics.sendError(err as string)
      Logger.error(err)
    }
  }

  get(key?: string | string[]): Promise<MWStorageSettings | any> {
    return new Promise((resolve, reject) => {
      try {
        if (window.browser.storage) {
          window.browser.storage.sync.get(key, function (response: any) {
            resolve(response)
          });
        } else {
          resolve(JSON.parse(window.localStorage.getItem(key)));
        }
      } catch (err) {
        reject(err);
      }
    })
  }

  set(data: any) {
    return new Promise((resolve, reject) => {
      try {
        if (window.browser.storage) {
          window.browser.storage.sync.set(data, function (response: any) {
            window.browser.runtime.lastError ? reject(window.browser.runtime.lastError) : void 0
            resolve(response)
          });
        }
      } catch (err) {
        reject(err);
      }
    })
  }

  updateSettings(): Promise<any> {
    try {
      Logger.debug('⚙️ Update settings', this.settings)
    } catch (err) {
      Logger.error('[updateSettings]', err)
      Logger.debug('⚙️ Update settings', JSON.stringify(this.settings))
    }

    return this.set(this.settings)
  }

  remove(key: string) {
    return new Promise((resolve, reject) => {
      try {
        if (window.browser.storage) {
          window.browser.storage.sync.remove(key, function (response: any) {
            resolve(response)
          });
        } else {
          resolve(window.localStorage.removeItem(key));
        }
      } catch (err) {
        reject(err);
      }
    })
  }
}

export default new BrowserStorage()