
module.exports = {

  colorize: function () {
    const chalk = require('chalk')

    return (value, _, color) => {
      console.log('[colorize formatter] color', color)
      return chalk[color](value)
    }
  }(),
  uppercase: value => value.toUpperCase()
}