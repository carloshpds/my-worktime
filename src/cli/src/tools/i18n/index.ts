import MessageFormat from '@messageformat/runtime/messages'
// const MessageFormat = MessageFormatRuntime.default

// @ts-expect-error no types
import messagesSet from './messages/compiled-messages.js'

// let messageFormatInstance: ReturnType<typeof MessageFormat>
let messageFormatInstance: any


export const supportedLocales: string[] = Object.keys(messagesSet)

export const setup = (locale: string) => {
  console.log('[setup locale]', locale)
  // @ts-expect-error no types
  messageFormatInstance = new MessageFormat(messagesSet, locale)
  messageFormatInstance.setFallback(locale, ['pt-BR'])
  console.log('messageFormatInstance==>', messageFormatInstance.get(['cli', 'hit', 'calc', 'description']))

}

export const getI18n = () => messageFormatInstance