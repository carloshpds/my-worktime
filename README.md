my-worktime
==========
See your worktime using terminal


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclid-test.svg)](https://npmjs.org/package/my-worktime)

[![Downloads/week](https://img.shields.io/npm/dw/my-worktime.svg)](https://npmjs.org/package/my-worktime)
[![License](https://img.shields.io/npm/l/oclid-test.svg)](https://github.com/carloshpds/oclid-test/blob/master/package.json)

<!-- toc -->
* [Install](#install)
* [Most Common Usage](#most-common-usage)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Install
```
$ npm install -g my-worktime
```

You can also add an alias to make your life esier:

```
$ npm install -g mw@npm:my-worktime
```

# Most Common Usage

```
mw check -u 321 -p 123 -s ahgora -c a22
```
![my-worktime-check](https://user-images.githubusercontent.com/2482989/94374192-f0597180-00e0-11eb-8fbb-39d67975963d.gif)


# Usage

```sh-session
$ my-worktime COMMAND

$ my-worktime --help [COMMAND]

USAGE
  $ my-worktime COMMAND
...
```

# Commands
<!-- commands -->
* [`my-worktime check`](#my-worktime-check)
* [`my-worktime help [COMMAND]`](#my-worktime-help-command)

## `my-worktime check`

Checks your worktime

```
USAGE
  $ my-worktime check

OPTIONS
  -b, --debug                    Debug - Exibe mais informações na execução
  -c, --company=company          (required) [default: ahgora] ID da empresa no sistema de ponto
  -d, --date=date                [default: 2020-09-27] Data relacionada a consulta de horas no padrão YYYY-MM-DD
  -h, --help                     show CLI help
  -j, --journeytime=journeytime  [default: 08:00] Quantidade de horas a serem trabalhadas por dia
  -p, --password=password        (required) Senha do usuário no sistema
  -s, --system=system            [default: ahgora] Nome do sistema de ponto
  -u, --user=user                (required) ID do usuário no sistema de ponto

EXAMPLES
  $ worktime check -u 321 -p 123 -c a22
  $ worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48
  $ worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48 -d 2020-09-23
```

_See code: [src/commands/check.ts](https://github.com/carloshpds/my-worktime/blob/v1.0.0/src/commands/check.ts)_

## `my-worktime help [COMMAND]`

display help for my-worktime

```
USAGE
  $ my-worktime help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_
<!-- commandsstop -->
