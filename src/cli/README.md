![](https://github.com/carloshpds/my-worktime/blob/feature/chrome-extension/src/cli/assets/LOGO_MWT.png?raw=true)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
![npm](https://img.shields.io/npm/v/my-worktime)
![node-current](https://img.shields.io/node/v/my-worktime)
[![Downloads/week](https://img.shields.io/npm/dw/my-worktime.svg)](https://npmjs.org/package/my-worktime)
![NPM](https://img.shields.io/npm/l/my-worktime)

CLI para controlar seu horário de trabalho, trazendo um jeito simples e fácil de registrar suas batidas de ponto e calcular seu horário de saída.

<!-- toc -->
* [Uso](#uso)
* [Commandos](#commandos)
<!-- tocstop -->




# Uso
<!-- usage -->
```sh-session
$ npm install -g my-worktime
$ my-worktime COMMAND
running command...
$ my-worktime (--version)
my-worktime/2.0.0-beta.7 darwin-arm64 node-v18.19.0
$ my-worktime --help [COMMAND]
USAGE
  $ my-worktime COMMAND
...
```
<!-- usagestop -->




# Commandos
<!-- commands -->
* [`my-worktime check`](#my-worktime-check)
* [`my-worktime help [COMMANDS]`](#my-worktime-help-commands)
* [`my-worktime hit MARKS`](#my-worktime-hit-marks)
* [`my-worktime hit:calc MARKS`](#my-worktime-hitcalc-marks)
* [`my-worktime hit:clear`](#my-worktime-hitclear)
* [`my-worktime hit:delete MARKS`](#my-worktime-hitdelete-marks)
* [`my-worktime hit:reset`](#my-worktime-hitreset)
* [`my-worktime punch MARKS`](#my-worktime-punch-marks)

## `my-worktime check`

Busca as batidas e calcula as horas trabalhadas para uma data específica

```
USAGE
  $ my-worktime check [-c <value>] [-d <value>] [-b] [-h] [-j <value>] [-p <value>] [-s <value>] [-m] [-u
    <value>]

FLAGS
  -b, --debug                Debug - Exibe mais informações na execução
  -c, --company=<value>      ID da empresa no sistema de ponto
  -d, --date=<value>         [default: 2024-01-29] Data relacionada a consulta de horas no padrão YYYY-MM-DD
  -h, --help                 Show CLI help.
  -j, --journeyTime=<value>  [default: 08:00] Quantidade de horas a serem trabalhadas por dia
  -m, --useMocks             Simula os requests para o sistema de ponto
  -p, --password=<value>     Senha do usuário no sistema
  -s, --system=<value>       [default: local] Nome do sistema de ponto
  -u, --user=<value>         ID do usuário no sistema de ponto

DESCRIPTION
  Busca as batidas e calcula as horas trabalhadas para uma data específica

EXAMPLES
  $ my-worktime check -u 321 -p 123 -c a22

  $ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48

  $ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48 -d 2020-09-23
```

_See code: [src/commands/check.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.7/src/commands/check.ts)_

## `my-worktime help [COMMANDS]`

Display help for my-worktime.

```
USAGE
  $ my-worktime help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for my-worktime.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/src/commands/help.ts)_

## `my-worktime hit MARKS`

Adiciona uma ou mais batidas ao histórico

```
USAGE
  $ my-worktime hit MARKS [-d <value>] [-b] [-h] [-j <value>] [-s local]

ARGUMENTS
  MARKS  Lista de batidas no formato HH:mm separadas por vírgula

FLAGS
  -b, --debug                Exibe informações a nível de debug
  -d, --date=<value>         [default: 2024-01-29] Data relacionada as batidas (utilize o padrão AAAA-MM-DD)
  -h, --help                 Exibe ajuda para todos os comandos
  -j, --journeyTime=<value>  [default: 08:00] Jornada de trabalho: Quantidade de horas a serem trabalhadas por dia
  -s, --system=<option>      [default: local] Nome do sistema de ponto
                             <options: local>

DESCRIPTION
  Adiciona uma ou mais batidas ao histórico

ALIASES
  $ my-worktime punch

EXAMPLES
  $ my-worktime hit 01:00

  $ my-worktime hit 09:00,12:00,13:00 -s local
```

_See code: [src/commands/hit/index.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.7/src/commands/hit/index.ts)_

## `my-worktime hit:calc MARKS`

Calcula o horário de saída baseado em uma ou mais batidas, jornada de trabalho e a data

```
USAGE
  $ my-worktime hit:calc MARKS [-d <value>] [-b] [-h] [-j <value>] [-s local]

ARGUMENTS
  MARKS  Lista de batidas no formato HH:mm separadas por vírgula

FLAGS
  -b, --debug                Exibe informações a nível de debug
  -d, --date=<value>         [default: 2024-01-29] Data relacionada as batidas (utilize o padrão AAAA-MM-DD)
  -h, --help                 Exibe ajuda para todos os comandos
  -j, --journeyTime=<value>  [default: 08:00] Jornada de trabalho: Quantidade de horas a serem trabalhadas por dia
  -s, --system=<option>      [default: local] Nome do sistema de ponto
                             <options: local>

DESCRIPTION
  Calcula o horário de saída baseado em uma ou mais batidas, jornada de trabalho e a data

ALIASES
  $ my-worktime punch

EXAMPLES
  $ my-worktime hit:calc 09:00,12:00,13:00

  $ my-worktime hit:calc 09:00,12:00,13:00,14:00,15:00 --date=2020-01-01

  $ my-worktime hit:calc 09:00 -d=2020-01-01
```

_See code: [src/commands/hit/calc.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.7/src/commands/hit/calc.ts)_

## `my-worktime hit:clear`

Reseta todas as batidas de uma data específica

```
USAGE
  $ my-worktime hit:clear [-d <value>] [-b] [-h] [-j <value>] [-s local]

FLAGS
  -b, --debug                Exibe informações a nível de debug
  -d, --date=<value>         [default: 2024-01-29] Data relacionada as batidas (utilize o padrão AAAA-MM-DD)
  -h, --help                 Exibe ajuda para todos os comandos
  -j, --journeyTime=<value>  [default: 08:00] Jornada de trabalho: Quantidade de horas a serem trabalhadas por dia
  -s, --system=<option>      [default: local] Nome do sistema de ponto
                             <options: local>

DESCRIPTION
  Reseta todas as batidas de uma data específica

ALIASES
  $ my-worktime punch

EXAMPLES
  $ my-worktime hit:clear

  $ my-worktime hit:clear --date=2020-01-01

  $ my-worktime hit:clear -d=2020-01-01
```

_See code: [src/commands/hit/clear.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.7/src/commands/hit/clear.ts)_

## `my-worktime hit:delete MARKS`

Deleta uma ou mais batidas do histórico

```
USAGE
  $ my-worktime hit:delete MARKS [-d <value>] [-b] [-h] [-j <value>] [-s local]

ARGUMENTS
  MARKS  Lista de batidas no formato HH:mm separadas por vírgula

FLAGS
  -b, --debug                Exibe informações a nível de debug
  -d, --date=<value>         [default: 2024-01-29] Data relacionada as batidas (utilize o padrão AAAA-MM-DD)
  -h, --help                 Exibe ajuda para todos os comandos
  -j, --journeyTime=<value>  [default: 08:00] Jornada de trabalho: Quantidade de horas a serem trabalhadas por dia
  -s, --system=<option>      [default: local] Nome do sistema de ponto
                             <options: local>

DESCRIPTION
  Deleta uma ou mais batidas do histórico

ALIASES
  $ my-worktime punch

EXAMPLES
  $ my-worktime hit:delete 13:00

  $ my-worktime hit:delete 13:00 --date=2020-01-01

  $ my-worktime hit:delete 13:00,18:00 -d=2020-01-01
```

_See code: [src/commands/hit/delete.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.7/src/commands/hit/delete.ts)_

## `my-worktime hit:reset`

Reseta todas as batidas de uma data específica

```
USAGE
  $ my-worktime hit:reset [-d <value>] [-b] [-h] [-j <value>] [-s local]

FLAGS
  -b, --debug                Exibe informações a nível de debug
  -d, --date=<value>         [default: 2024-01-29] Data relacionada as batidas (utilize o padrão AAAA-MM-DD)
  -h, --help                 Exibe ajuda para todos os comandos
  -j, --journeyTime=<value>  [default: 08:00] Jornada de trabalho: Quantidade de horas a serem trabalhadas por dia
  -s, --system=<option>      [default: local] Nome do sistema de ponto
                             <options: local>

DESCRIPTION
  Reseta todas as batidas de uma data específica

ALIASES
  $ my-worktime punch

EXAMPLES
  $ my-worktime hit:reset

  $ my-worktime hit:reset --date=2020-01-01

  $ my-worktime hit:reset -d=2020-01-01
```

_See code: [src/commands/hit/reset.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.7/src/commands/hit/reset.ts)_

## `my-worktime punch MARKS`

Adiciona uma ou mais batidas ao histórico

```
USAGE
  $ my-worktime punch MARKS [-d <value>] [-b] [-h] [-j <value>] [-s local]

ARGUMENTS
  MARKS  Lista de batidas no formato HH:mm separadas por vírgula

FLAGS
  -b, --debug                Exibe informações a nível de debug
  -d, --date=<value>         [default: 2024-01-29] Data relacionada as batidas (utilize o padrão AAAA-MM-DD)
  -h, --help                 Exibe ajuda para todos os comandos
  -j, --journeyTime=<value>  [default: 08:00] Jornada de trabalho: Quantidade de horas a serem trabalhadas por dia
  -s, --system=<option>      [default: local] Nome do sistema de ponto
                             <options: local>

DESCRIPTION
  Adiciona uma ou mais batidas ao histórico

ALIASES
  $ my-worktime punch

EXAMPLES
  $ my-worktime punch 01:00

  $ my-worktime punch 09:00,12:00,13:00 -s local
```
<!-- commandsstop -->
