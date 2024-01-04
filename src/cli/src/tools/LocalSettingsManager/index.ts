import Conf from 'conf';
import * as os from 'node:os';
import * as path from 'node:path';
import { osLocaleSync } from 'os-locale';

import { setup, supportedLocales } from '../i18n/index.ts';
import { MWStorageSettings } from '../storage/types.ts';

class LocalSettingsManager {
  static APP_NAME = 'my-worktime'

  settings: Conf<Partial<MWStorageSettings>>
  settingsDir: string
  settingsFilePath: string

  constructor() {
    this.settingsDir = path.join(os.homedir(), 'AppData', 'Local', LocalSettingsManager.APP_NAME);
    this.settingsFilePath = path.join(this.settingsDir, 'my-worktime-settings.json');
    console.log('settingsFilePath', this.settingsFilePath)

    this.settings = new Conf({
      configName: 'my-worktime-settings',
      cwd: this.settingsDir,
    })

    this.setupLocale();
  }

  private setupLocale() {
    let currentLocale: string = this.settings.get('locale');

    if (!currentLocale) {
      const systemLocale = osLocaleSync();
      currentLocale = supportedLocales.includes(systemLocale) ? systemLocale : 'pt-BR';
    }

    this.settings.set('locale', currentLocale);
    setup(currentLocale);
  }
}

export default new LocalSettingsManager();
