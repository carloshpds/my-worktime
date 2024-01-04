export const messagesEnUS = {
  commands: {
    hit: {
      add: {
        description: 'Adds a new hit to the history',
        flags: {
          date: {
            description: 'Date of the hit',
          },
          debug: {
            description: 'Show debug information',
          },
          system: {
            description: 'Name of the point system',
          },
        },
      },
      calc: {
        description: 'Calculates the exit time based on one or more hits, working hours and date',
        flags: {
          date: {
            description: 'Date to calculate the clock out',
          },
          debug: {
            description: 'Show debug information',
          },
          journeyTime: {
            description: 'Working hours',
          },
          system: {
            description: 'Name of the point system',
          },
        },
      },
      delete: {
        description: 'Deletes a hit from the history',
        flags: {
          date: {
            description: 'Date of the hit to delete',
          },
          debug: {
            description: 'Show debug information',
          },
          system: {
            description: 'Name of the point system',
          },
        },
      },
      reset: {
        description: 'Resets all hits of the history or only from a given date',
        flags: {
          date: {
            description: 'Date to reset the hits',
          },
          debug: {
            description: 'Show debug information',
          },
          journeyTime: {
            description: 'Working hours',
          },
          system: {
            description: 'Name of the point system',
          },
        },
      },
    },
  },
};