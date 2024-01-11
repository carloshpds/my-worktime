import Conf from 'conf'
import debug from 'debug'
import * as os from 'node:os'
import * as path from 'node:path'
import { osLocaleSync } from 'os-locale'

import { setup, supportedLocales } from '../i18n/index.ts'
import { MWStorageSettings } from '../storage/types.ts'

const debugSettings = debug('my-worktime:settings')
class LocalSettingsManager {
  static APP_NAME = 'my-worktime'

  settings: Conf<Partial<MWStorageSettings>>
  settingsDir: string
  settingsFilePath: string

  constructor() {
    this.settingsDir = path.join(os.homedir(), 'AppData', 'Local', LocalSettingsManager.APP_NAME)
    this.settingsFilePath = path.join(this.settingsDir, 'my-worktime-settings.json')
    debugSettings('settingsFilePath', this.settingsFilePath)

    this.settings = new Conf({
      configName: 'my-worktime-settings',
      cwd: this.settingsDir,
    })

    this.setupLocale()
  }

  private setupLocale() {
    let currentLocale: string = this.settings.get('locale')
    debugSettings('recovered locale from settings', currentLocale)

    if (!currentLocale) {
      const systemLocale = osLocaleSync()
      debugSettings('system locale detected', systemLocale)
      currentLocale = supportedLocales.includes(systemLocale) ? systemLocale : 'pt-BR'
    }

    debugSettings('final locale setted', currentLocale)
    this.settings.set('locale', currentLocale)
    setup(currentLocale)
  }
}

export default new LocalSettingsManager()
