/**
 * Imports
 */
import { Moment } from "moment"
import { WorktimeDayMark } from "../../providers/types"

/**
 * Types
 */
interface LeaveClockTimeParams {
  journeyTimeInMinutes: number, // Quantidade de minutos a serem trabalhados por dia
  registeredWorkedMinutes: number, // Quantidade de minutos já trabalhados no dia
  workedMinutesUntilNow: number, // Quantidade de minutos que seriam computados como trabalhados caso o usuário batesse o ponto agora
  breakMinutes: number, // Quantidade de minutos relacionados a intervalos (almoço, café e etc...)
  isMissingPairMark: boolean, // Há batidas ímpares?
  marks: WorktimeDayMark[], // Batidas do ponto do usuário
  now: Moment // Abstração do Moment para o relógio neste exato momento
}

/**
 * Implementation
 */
export default (data: LeaveClockTimeParams): string => {
  return null
}