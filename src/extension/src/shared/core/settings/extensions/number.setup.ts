export const percentage = (partialValue: number, totalValue: number, fixedDecimal?: number): string => {
  const partialPercentage = (100 * partialValue) / totalValue
  return fixedDecimal ? `${partialPercentage.toFixed(fixedDecimal)}%` : `${partialPercentage}%`;
}

Number.prototype.percentageFrom = function (totalValue: number, fixedDecimal?: number): string {
  return percentage(this.valueOf(), totalValue, fixedDecimal)
}

Number.prototype.percentageOf = function (partialValue: number, fixedDecimal?: number): string {
  return percentage(partialValue, this.valueOf(), fixedDecimal)
}