/**
 * Imports
 */
import * as moment from "moment"
import { WorktimeDayMark } from "../../providers/types"
import ClockHelper from "../../utils/ClockHelper"
import { exception } from "console"


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
  now: any // Abstração do Moment para o relógio neste exato momento
}

/**
 * Implementation
 */
export default (data: LeaveClockTimeParams): string => {
  let minutesQuantityNecessaryToOut: number;
  let minutesFromTheLastMark: number;
  let breakMinutes: number;
  let hourToStopWork: string;

  if(data.isMissingPairMark && data.registeredWorkedMinutes > data.journeyTimeInMinutes) {
    data.marks.pop();
  }

  minutesQuantityNecessaryToOut = data.journeyTimeInMinutes - data.registeredWorkedMinutes;
  minutesFromTheLastMark = ClockHelper.convertClockStringToMinutes(data.marks[Utils.getLastIndex(data.marks)].clock);

  breakMinutes = 0;
  if(data.breakMinutes>60 && data.registeredWorkedMinutes > data.journeyTimeInMinutes && data.isMissingPairMark === false) {
    breakMinutes = data.breakMinutes - 60;  
  }

  hourToStopWork = ClockHelper.humanizeMinutesToClock((minutesFromTheLastMark + minutesQuantityNecessaryToOut) - breakMinutes);
  return hourToStopWork; 
}

export class Utils {
  public static getLastIndex(marks: WorktimeDayMark[]): number {
    return marks.length - 1;
  }
}