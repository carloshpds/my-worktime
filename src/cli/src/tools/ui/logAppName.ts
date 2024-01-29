import { ux } from "@oclif/core"

export const logAppName = () => {
  logLine('___  ___                _    _               _     _    _')
  logLine('|  \\/  |               | |  | |             | |   | |  (_)')
  logLine('| .  . | _   _  ______ | |  | |  ___   _ __ | | __| |_  _  _ __ ___    ___')
  logLine('| |\\/| || | | ||______|| |/\\| | / _ \\ | __| | |/ /| __|| || _ ` _ \\  / _ \\')
  logLine('| |  | || |_| |        \\  /\\  /| (_) || |   |   < | |_ | || | | | | ||  __/')
  logLine('\\_|  |_/ \\__, |         \\/  \\/  \\___/ |_|   |_|\\_\\ \\__||_||_| |_| |_| \\___|')
  logLine('          __/ |                                                            ')
  logLine('         |___/                                                             ')

}

function logLine(line: string) {
  ux.log(`${ux.colorize('blue', line)}`)
}