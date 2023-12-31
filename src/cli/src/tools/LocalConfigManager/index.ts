import Conf from 'conf';
import * as os from 'node:os';
import * as path from 'node:path';

import { MWStorageSettings } from '../../utils/storage/types.ts';

class LocalConfigManager {
  static APP_NAME = 'my-worktime'

  configDir: string
  configFilePath: string
  settings: Conf<Partial<MWStorageSettings>>

  constructor() {
    this.configDir = path.join(os.homedir(), 'AppData', 'Local', LocalConfigManager.APP_NAME);
    this.configFilePath = path.join(this.configDir, 'my-worktime-settings.json');
    this.settings = new Conf({
      configName: 'my-worktime-settings',
      cwd: this.configDir,
    })
  }
}

export default new LocalConfigManager();
