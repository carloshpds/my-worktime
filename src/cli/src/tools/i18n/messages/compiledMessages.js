import { en, es, pt } from "@messageformat/runtime/lib/cardinals";
import { plural } from "@messageformat/runtime";
export default {
  "en-US": {
    cli: {
      common: {
        display: {
          yesLabel: () => "Yes",
          noLabel: () => "No",
          oddMark: () => "Odd Clock In",
          mark: (d) => plural(d.count, 0, en, { "1": "Clock In", other: "Clock Ins" }),
          removedMark: () => "Clock In Removed",
          addedMark: () => "Clock In Added",
          ignoredMark: () => "Clock In Ignored",
          actionMarkFromDate: (d) => d.action + " " + d.mark + " on " + d.date
        },
        flags: {
          date: {
            universalDateFormat: () => "YYYY-MM-DD",
            description: (d) => "Date related to clock ins (use the " + d.dateFormat + " pattern)",
            defaultHelp: (d) => "Current date " + d.date + " (use the " + d.dateFormat + " pattern)"
          },
          debug: {
            description: () => "Display debug information"
          },
          journeyTime: {
            description: () => "Workday: Number of hours to be worked per day"
          },
          system: {
            description: () => "Time tracking system name"
          },
          help: {
            description: () => "Display help for all commands"
          }
        },
        errors: {
          invalidDateFormat: () => "Invalid date format (use the YYYY-MM-DD pattern)",
          invalidMarkTime: (d) => "Invalid " + d.mark + " format (use the HH:mm pattern)",
          markInTheFuture: (d) => d.mark + " is a future clock in (check the date or use the hit:calc command to simulate/calculate with future clock ins)",
          duplicatedMark: (d) => d.mark + " is already registered on " + d.date + " (duplicated)",
          invalidDate: () => "Invalid date",
          invalidJourneyTime: () => "Invalid workday",
          invalidMark: () => "Invalid clock in",
          missingDate: () => "Date not provided",
          missingJourneyTime: () => "Workday not provided",
          missingMark: () => "Clock in not provided",
          missingSystem: () => "Time tracking system not provided",
          systemNotFound: () => "Time tracking system not found",
          isMissingPairMarkToCalculateClockOut: () => "Could not calculate the clock out time because there is no clock in time."
        }
      },
      hit: {
        add: {
          description: () => "Add one or more clock ins to the history"
        },
        calc: {
          args: {
            marks: {
              description: () => "List of clock ins in the HH:mm format separated by commas"
            }
          },
          description: () => "Calculate the clock out time based on one or more clock ins, workday, and date",
          journeyTime: (d) => "Considering a workday of " + d.clockTime,
          shouldLeaveClockTime: (d) => "Your ideal clock out time is " + d.clockTime
        },
        "delete": {
          args: {
            marks: {
              description: () => "List of clock ins in the HH:mm format separated by commas"
            }
          },
          description: () => "Delete one or more clock ins from the history",
          removingMarks: () => ""
        },
        reset: {
          description: () => "Reset all clock ins for a specific date",
          resettingMarks: (d) => "Resetting clock ins for " + d.date,
          marksHasBeenReseted: (d) => "Clock ins for " + d.date + " have been reset"
        }
      }
    }
  },
  es: {
    cli: {
      common: {
        display: {
          yesLabel: () => "Sí",
          noLabel: () => "No",
          oddMark: () => "Marca impar",
          mark: (d) => plural(d.count, 0, es, { "1": "Marca", other: "Marcas" }),
          removedMark: () => "Marca eliminada",
          addedMark: () => "Marca añadida",
          ignoredMark: () => "Marca ignorada",
          actionMarkFromDate: (d) => d.action + " " + d.mark + " en " + d.date
        },
        flags: {
          date: {
            universalDateFormat: () => "AAAA-MM-DD",
            description: (d) => "Fecha relacionada a las marcas (utilice el formato " + d.dateFormat + ")",
            defaultHelp: (d) => "Fecha actual " + d.date + " (utilice el formato " + d.dateFormat + ")"
          },
          debug: {
            description: () => "Muestra información de depuración"
          },
          journeyTime: {
            description: () => "Jornada laboral: Cantidad de horas a trabajar por día"
          },
          system: {
            description: () => "Nombre del sistema de registro de tiempo"
          },
          help: {
            description: () => "Muestra ayuda para todos los comandos"
          }
        },
        errors: {
          invalidDateFormat: () => "Formato de fecha inválido (utilice el formato *universalDateFormat)",
          invalidMarkTime: (d) => "Formato de marca " + d.mark + " inválido (utilice el formato HH:mm)",
          markInTheFuture: (d) => d.mark + " es una marca futura (verifique la fecha o utilice el comando hit:calc para simular/calcular con marcas futuras)",
          duplicatedMark: (d) => d.mark + " ya está registrado en " + d.date + " (duplicado)",
          invalidDate: () => "Fecha inválida",
          invalidJourneyTime: () => "Jornada laboral inválida",
          invalidMark: () => "Marca inválida",
          missingDate: () => "Fecha no especificada",
          missingJourneyTime: () => "Jornada laboral no especificada",
          missingMark: () => "Marca no especificada",
          missingSystem: () => "Sistema de registro de tiempo no especificado",
          systemNotFound: () => "Sistema de registro de tiempo no encontrado",
          isMissingPairMarkToCalculateClockOut: () => "No se puede calcular la hora de salida porque no hay hora de entrada."
        }
      },
      hit: {
        add: {
          description: () => "Añade una o más marcas al historial"
        },
        calc: {
          args: {
            marks: {
              description: () => "Lista de marcas en formato HH:mm separadas por comas"
            }
          },
          description: () => "Calcula la hora de salida basándose en una o más marcas, jornada laboral y fecha",
          journeyTime: (d) => "Considerando una jornada laboral de " + d.clockTime,
          shouldLeaveClockTime: (d) => "Tu hora ideal de salida es " + d.clockTime
        },
        "delete": {
          args: {
            marks: {
              description: () => "Lista de marcas en formato HH:mm separadas por comas"
            }
          },
          description: () => "Elimina una o más marcas del historial",
          removingMarks: () => ""
        },
        reset: {
          description: () => "Restablece todas las marcas de una fecha específica",
          resettingMarks: (d) => "Restableciendo marcas de " + d.date,
          marksHasBeenReseted: (d) => "Las marcas de " + d.date + " se han restablecido"
        }
      }
    }
  },
  "pt-BR": {
    cli: {
      common: {
        display: {
          yesLabel: () => "Sim",
          noLabel: () => "Não",
          oddMark: () => "Batida ímpar",
          mark: (d) => plural(d.count, 0, pt, { "1": "Batida", other: "Batidas" }),
          removedMark: () => "Batida removida",
          addedMark: () => "Batida adicionada",
          ignoredMark: () => "Batida ignorada",
          actionMarkFromDate: (d) => d.action + " " + d.mark + " em " + d.date
        },
        flags: {
          date: {
            universalDateFormat: () => "AAAA-MM-DD",
            description: (d) => "Data relacionada as batidas (utilize o padrão " + d.dateFormat + ")",
            defaultHelp: (d) => "Data atual " + d.date + " (utilize o padrão " + d.dateFormat + ")"
          },
          debug: {
            description: () => "Exibe informações a nível de debug"
          },
          journeyTime: {
            description: () => "Jornada de trabalho: Quantidade de horas a serem trabalhadas por dia"
          },
          system: {
            description: () => "Nome do sistema de ponto"
          },
          help: {
            description: () => "Exibe ajuda para todos os comandos"
          }
        },
        errors: {
          invalidDateFormat: () => "Formato de data inválido (utilize o padrão *universalDateFormat)",
          invalidMarkTime: (d) => d.mark + " formato inválido (utilize o padrão HH:mm)",
          markInTheFuture: (d) => d.mark + " é uma batida futura (verifique a data ou utilize comando hit:calc para simular/calcular com batidas futuras)",
          duplicatedMark: (d) => d.mark + " já está registrada em " + d.date + " (duplicada)",
          invalidDate: () => "Data inválida",
          invalidJourneyTime: () => "Jornada de trabalho inválida",
          invalidMark: () => "Batida inválida",
          missingDate: () => "Data não informada",
          missingJourneyTime: () => "Jornada de trabalho não informada",
          missingMark: () => "Batida não informada",
          missingSystem: () => "Sistema de ponto não informado",
          systemNotFound: () => "Sistema de ponto não encontrado",
          isMissingPairMarkToCalculateClockOut: () => "Não foi possível calcular o horário de saída por não ter horário de entrada."
        }
      },
      hit: {
        add: {
          description: () => "Adiciona uma ou mais batidas ao histórico"
        },
        calc: {
          args: {
            marks: {
              description: () => "Lista de batidas no formato HH:mm separadas por vírgula"
            }
          },
          description: () => "Calcula o horário de saída baseado em uma ou mais batidas, jornada de trabalho e a data",
          journeyTime: (d) => "Considerando Jornada de trabalho de " + d.clockTime,
          shouldLeaveClockTime: (d) => "Seu horário ideal de saída é " + d.clockTime
        },
        "delete": {
          args: {
            marks: {
              description: () => "Lista de batidas no formato HH:mm separadas por vírgula"
            }
          },
          description: () => "Deleta uma ou mais batidas do histórico",
          removingMarks: () => ""
        },
        reset: {
          description: () => "Reseta todas as batidas de uma data específica",
          resettingMarks: (d) => "Resetando batidas de " + d.date,
          marksHasBeenReseted: (d) => "Batidas de " + d.date + " foram resetadas"
        }
      }
    }
  }
}