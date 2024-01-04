// import { createIntl, createIntlCache } from '@formatjs/intl'

// import { messagesEnUS } from './messages/en-US/index.ts';
// import { messagesPtBR } from './messages/pt-BR/index.ts';

// let intl: ReturnType<typeof createIntl>;

// const messages: Record<string, any> = {
//   'en-US': messagesEnUS,
//   'pt-BR': messagesPtBR,
// }

// export const supportedLocales: string[] = Object.keys(messages)

// export const setup = (locale: string) => {
//   const localizedMessages = messages[locale] || messages['pt-BR']
//   const cache = createIntlCache()
//   const intlSettings = {
//     defaultLocale: locale,
//     locale,
//     messages: localizedMessages,
//   }

//   intl = createIntl(intlSettings, cache)
// }

// export const getI18n = (): ReturnType<typeof createIntl> => intl