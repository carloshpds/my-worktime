import Logger from "js-logger"
import { AnalyticsCustomDimention, AnalyticsEvent } from "./types"
import { customDimentions } from "./dimentions"
import LoggedUser from '@/apps/contentScripts/lobby/types/LoggedUser'

class AnalyticsManager {
  trackerName = 'gccAnalytics'

  isAlive(): boolean {
    return typeof window.ga !== 'undefined'
  }

  setup(loggedPlayer?: Partial<LoggedUser>){
    const manifest = window.browser.runtime.getManifest()
    const userId = loggedPlayer?.id ? loggedPlayer.id : undefined

    window.ga && window.ga('create', {
      trackingId: process.env.GA_TRACKING_ID,
      cookieDomain: 'auto',
      name: this.trackerName,
      userId,
    })

    this.set('appName', 'My Worktime')
    manifest && this.set('appVersion', manifest.version)

    if(loggedPlayer) {
      const { id, level, name } = loggedPlayer
      this.set(customDimentions.companyId, id)
      this.set(customDimentions.name, name)
    }
  }

  set(attribute: string, value: string | undefined) {
    if(window.ga && value) {
      window.ga(`${this.trackerName}.set`, attribute, value)
      const humanizedAttribute = customDimentions[attribute as AnalyticsCustomDimention] || attribute
      Logger.debug('📈 Set analytics attribute: ', humanizedAttribute, value)
    }
  }

  send(attribute: string, body?: any) {
    window.ga && window.ga(`${this.trackerName}.send`, attribute, body)
  }

  sendEvent(event: AnalyticsEvent, callback?: any): void {
    Logger.log(`🔥 ${event.label}`, `Value: ${event.value}`)
    this.send('event', {
      eventCategory: event.category,
      eventAction: event.action,
      eventLabel: event.label,
      eventValue: Number.isInteger && Number.isInteger(event.value) ? event.value : undefined
    })
  }

  sendError(errorDescription: string, isFatalError = false) {
    Logger.error('[Analytics Error]', errorDescription.toString())
    this.send('exception', {
      'exDescription': errorDescription.toString(),
      'exFatal': isFatalError
    })
  }
}

export default new AnalyticsManager()