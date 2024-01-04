
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
          idealClockOut: () => ""
        },
        errors: {
          invalidDate: {
            message: () => "Data inválida"
          },
          invalidJourneyTime: {
            message: () => "Jornada de trabalho inválida"
          },
          invalidMark: {
            message: () => "Batida inválida"
          },
          missingDate: {
            message: () => "Data não informada"
          },
          missingJourneyTime: {
            message: () => "Jornada de trabalho não informada"
          },
          missingMark: {
            message: () => "Batida não informada"
          },
          missingSystem: {
            message: () => "Sistema de ponto não informado"
          },
          systemNotFound: {
            message: () => "Sistema de ponto não encontrado"
          }
        },
        flags: {
          date: {
            description: () => "Data"
          },
          debug: {
            description: () => "Mostra informações de debug"
          },
          journeyTime: {
            description: () => "Jornada de trabalho"
          },
          system: {
            description: () => "Nome do sistema de ponto"
          }
        }
      },
      hit: {
        add: {
          description: () => "Adiciona uma ou mais batidas ao histórico"
        },
        calc: {
          description: () => "Calcula o horário de saída baseado em uma ou mais batidas, jornada de trabalho e a data"
        },
        "delete": {
          description: () => "Deleta uma ou mais batidas do histórico"
        },
        reset: {
          description: () => "Reseta todo o histórico ou todas as batidas do histórico para uma data específica"
        }
      }
    }
  }
}