
export { }
declare global {

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface browser {}
  export interface Window {
    ga: any,
    chrome: any,
    userId: number | string,
    localStorage: any,
    browser: any,
    gcChallenger?: any
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
    // eslint-disable-next-line @typescript-eslint/ban-types
    filterByValue(value: any): object
  }
}

// @ts-ignore
window.chrome ? (window.browser = window.chrome) : (window.browser = browser)