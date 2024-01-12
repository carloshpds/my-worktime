import { pt } from "@messageformat/runtime/lib/cardinals";
import { plural } from "@messageformat/runtime";
export default {
  "en-US": {
    cli: {
      common: {
        display: {
          idealClockOut: () => ""
        },
        errors: {
          invalidDate: {
            message: () => "Invalid date"
          },
          invalidJourneyTime: {
            message: () => "Invalid work journey"
          },
          invalidMark: {
            message: () => "Invalid mark"
          },
          missingDate: {
            message: () => "Missing date"
          },
          missingJourneyTime: {
            message: () => "Missing work journey"
          },
          missingMark: {
            message: () => "Missing mark"
          },
          missingSystem: {
            message: () => "Missing time system"
          },
          systemNotFound: {
            message: () => "Time system not found"
          }
        },
        flags: {
          date: {
            description: () => "Date"
          },
          debug: {
            description: () => "Show debug information"
          },
          journeyTime: {
            description: () => "Work journey"
          },
          system: {
            description: () => "Time system name"
          }
        }
      },
      hit: {
        add: {
          description: () => "Add one or more marks to the history"
        },
        calc: {
          description: () => "Calculate the clock out time based on one or more marks, work journey, and date"
        },
        "delete": {
          description: () => "Delete one or more marks from the history"
        },
        reset: {
          description: () => "Reset the entire history or all marks from the history for a specific date"
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
          mark: (d) => plural(d.count, 0, pt, { "1": "Batida", other: "Batidas" })
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
          description: () => "Deleta uma ou mais batidas do histórico"
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