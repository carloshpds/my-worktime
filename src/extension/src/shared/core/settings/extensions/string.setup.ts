
export const cleanSelector = (selector: string): string => {
  return selector.replace(/\./g, '').replace(/#/g, '')
}

String.prototype.cleanCSSSelector = function (): string {
  return cleanSelector(this as string)
}
