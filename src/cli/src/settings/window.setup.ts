
export { }
declare global {

  export interface browser { }
  export interface Window {
    browser: any,
    chrome: any,
    ga: any,
    gcChallenger?: any
    gtag: any,
    isFirefox(): boolean
    localStorage: any,
    userId: number | string,
  }

  interface String {
    cleanCSSSelector(): string;
  }

  interface Number {
    percentageFrom(totalValue: number, fixedDecimal?: number): string;
    percentageOf(partialValue: number, fixedDecimal?: number): string;
  }

  interface Array<T> {
    groupByKey(key: string): Record<string, Array<T>>
  }

  interface Object {

    filterByValue(value: any): object
  }
}

// @ts-expect-error browser is a global variable in non chromium browsers
window.chrome ? (window.browser = window.chrome) : (window.browser = browser)

window.isFirefox = (): boolean => window.navigator.userAgent.includes("Firefox")