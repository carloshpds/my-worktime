try {
  console.log('onMessage Resource')

  // ===
  // Definitions
  // ===
  const strategies = {}
  strategies[self.backgroundMessages.INIT_GOOGLE_ANALYTICS] = initAnalytics

  // ===
  // Handlers
  // ===
  self.browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const strategy = strategies[message.type]
    strategy && strategy(message, sender, sendResponse)
    return true
  })

  // ===
  // Strategies
  // ===
  function initAnalytics(message, sender, sendResponse) {
    self.browser.scripting.executeScript({
      files: ['backgroundScripts/resources/ga.js'],
      target: { tabId: sender.tab.id, allFrames: true }
    })
      .then(() => {
        console.log('GA_INITIALIZED')
        sendResponse('GA_INITIALIZED')
      })
      .catch((e) => {
        console.log('GA_FAILED', e)
        sendResponse('GA_FAILED')
      })
  }

} catch (e) {
  console.error('[onMessage Resource] ERROR', e)
}
