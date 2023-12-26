import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { WorktimeDayMark } from '../../providers/types.js';
import { MWStorageSettings } from '../../utils/storage/types.js';

class LocalConfigManager {
  static APP_NAME = 'my-worktime'

  configDir: string
  configFile: string
  // private settings: Partial<{
  //   marks: { [key: string]: Partial<WorktimeDayMark> };
  // }> = {}

  constructor() {
    this.configDir = path.join(os.homedir(), 'AppData', 'Local', LocalConfigManager.APP_NAME);
    this.configFile = path.join(this.configDir, 'my-worktime-settings.json');
  }

  retrieveSettings(): Partial<MWStorageSettings> {
    let settings = {};

    if (fs.existsSync(this.configFile)) {
      const rawData = fs.readFileSync(this.configFile);
      settings = JSON.parse(rawData.toString());
    }

    return settings
  }

  saveSettings(settings: any) {
    fs.mkdirSync(this.configDir, { recursive: true });
    fs.writeFileSync(this.configFile, JSON.stringify(settings, null, 2));
  }
}

export default new LocalConfigManager();
