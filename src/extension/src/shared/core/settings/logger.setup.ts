import Logger from 'js-logger'

const emojis: Record<string, string> = {}
emojis[`${Logger.ERROR.value}`] = '🔴'
emojis[`${Logger.WARN.value}`] = '🟡'

const mwLogger = Logger.createDefaultHandler({
  formatter: function (messages, context) {
    // prefix each log message with a timestamp.
    messages.unshift('[My Worktime]')

    const emoji = emojis[context.level.value] || '🔵'
    messages.unshift(emoji)

    messages.unshift(new Date().toLocaleTimeString())
  }
});

Logger.useDefaults()
Logger.setLevel(process.env.NODE_ENV === 'development' ? Logger.DEBUG : Logger.ERROR)
Logger.setHandler(mwLogger)