import MessageFormat from '@messageformat/runtime/messages'
import debug from 'debug'
import moment from 'moment'

// @ts-expect-error no types
import messagesSet from './messages/compiledMessages.js'


let messageFormatInstance: any

const debugI18n = debug('my-worktime:i18n')

export const supportedLocales: string[] = Object.keys(messagesSet)

export const setup = (locale: string) => {
  debugI18n('[setup locale]', locale)

  // eslint-disable-next-line import/no-named-as-default-member
  moment.locale(locale.toLowerCase())

  // @ts-expect-error no types
  messageFormatInstance = new MessageFormat(messagesSet, locale)
  messageFormatInstance.setFallback(locale, ['pt-BR'])
  debugI18n('Is messageformat instance working?', messageFormatInstance.get(['cli', 'common', 'display', 'yesLabel']))

}

export const getI18n = () => messageFormatInstance

export const translate = (key: Array<string> | string, values: Record<string, any> = {}): string => {
  const finalSearch: Array<string> = typeof key === 'string' ? key.split('.') : key;
  const messageDescriptor = messageFormatInstance.get(finalSearch, values)
  const message = typeof messageDescriptor === 'function' ? messageDescriptor(values) : messageDescriptor
  debugI18n('[translate]', finalSearch, ' ---> ', message)
  return message
}