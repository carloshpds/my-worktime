
export const FULL_LOBBY_PLAYERS_NUMBER = 5

export const percentage = (partialValue: number, totalValue: number, fixedDecimal?: number): string => {
  const partialPercentage = (100 * partialValue) / totalValue
  return fixedDecimal ? `${partialPercentage.toFixed(fixedDecimal)}%` : `${partialPercentage}%`;
}