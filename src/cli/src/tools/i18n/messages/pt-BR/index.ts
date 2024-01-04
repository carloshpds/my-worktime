export const messagesPtBR = {
  cli: {
    common: {
      display: {
        idealClockOut: ''
      },
      errors: {
        invalidDate: {
          message: 'Data inválida',
        },
        invalidJourneyTime: {
          message: 'Jornada de trabalho inválida',
        },
        invalidMark: {
          message: 'Batida inválida',
        },
        missingDate: {
          message: 'Data não informada',
        },
        missingJourneyTime: {
          message: 'Jornada de trabalho não informada',
        },
        missingMark: {
          message: 'Batida não informada',
        },
        missingSystem: {
          message: 'Sistema de ponto não informado',
        },
        systemNotFound: {
          message: 'Sistema de ponto não encontrado',
        },
      },
      flags: {
        date: {
          description: 'Data',
        },
        debug: {
          description: 'Mostra informações de debug',
        },
        journeyTime: {
          description: 'Jornada de trabalho',
        },
        system: {
          description: 'Nome do sistema de ponto',
        },
      },
    },
    hit: {
      add: {
        description: 'Adiciona uma ou mais batidas ao histórico',
      },
      calc: {
        description: 'Calcula o horário de saída baseado em uma ou mais batidas, jornada de trabalho e a data',
      },
      delete: {
        description: 'Deleta uma ou mais batidas do histórico',
      },
      reset: {
        description: 'Reseta todo o histórico ou todas as batidas do histórico para uma data específica',
      },
    },
  },
};