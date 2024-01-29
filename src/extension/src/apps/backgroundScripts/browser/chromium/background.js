try {
  console.log('Initializing Service worker')
  self.chrome ? (self.browser = self.chrome) : void 0

  // eslint-disable-next-line no-undef
  importScripts('backgroundScripts/resources/messages.js')

  // eslint-disable-next-line no-undef
  importScripts('backgroundScripts/resources/onMessage.js')

} catch (e) {
  console.error('Service worker has failed', e)
}