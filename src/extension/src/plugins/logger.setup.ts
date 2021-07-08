import Logger from 'js-logger'

const gccLogger = Logger.createDefaultHandler({
  formatter: function(messages, context) {
    // prefix each log message with a timestamp.
    messages.unshift('🔵 [GamersClub Challenger]')
    messages.unshift(new Date().toLocaleTimeString())
  }
});

Logger.useDefaults()
Logger.setLevel(process.env.NODE_ENV === 'development' ? Logger.DEBUG : Logger.WARN)
Logger.setHandler(gccLogger)