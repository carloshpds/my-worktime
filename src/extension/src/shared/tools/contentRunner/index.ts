import '@/apps/shared/core/settings/main.setup'

import Logger from "js-logger"
import Analytics from '../analytics'
import BrowserStorage from '../storage'

import '@/apps/shared/extras/gcChallenger'

import serializer from '@/apps/contentScripts/lobby/serializer'
type GAInitializeResponse = 'GA_INITIALIZED' | 'GA_FAILED'
class GCChallengerContentRunner {
  pageName = ''

  async preRun(response: GAInitializeResponse, resolve: any, reject: any) {
    try {
      const isGlobalRun = this.pageName === 'GLOBAL_SCRIPTS'
      if(!response || response === 'GA_FAILED') {
        Logger.error(`GA HAS NOT STARTED ON ${this.pageName}`)
      } else {
        Logger.debug(`🟢 GA INITIALIZED ON ${this.pageName}`)
      }

      const loggedPlayer = serializer.serializeLoggedPlayer()
      Analytics.setup(loggedPlayer)
      if(!isGlobalRun){
        Analytics.set('title', this.pageName)
        Analytics.send('pageview')
      }

      await BrowserStorage.setup()

      resolve()
    } catch (e) {
      reject?.(e)
      Analytics.sendError(`[Content Script Lobby] ${e}`)
    }
  }

  run(pageName: string): Promise<any> {
    this.pageName = pageName

    return new Promise((resolve, reject) => {
      try {
        Logger.log(`== 🚀 My Worktime is activated on ${pageName} ==`)

        if(Analytics.isAlive()){
          Logger.debug(`🟢 GA IS ALREARY LIVE -> INITIALIZED ON ${this.pageName}`)
          this.preRun('GA_INITIALIZED', resolve, reject)
        } else {
          window.browser.runtime.sendMessage({ type: 'INIT_GOOGLE_ANALYTICS' }, (response: GAInitializeResponse) => {
            this.preRun(response, resolve, reject)
          })
        }

      } catch (e) {
        reject(e)
        Analytics.sendError(`[Content Script Lobby] ${e}`)
      }
    })
  }

}

export default new GCChallengerContentRunner()