![](https://github.com/carloshpds/my-worktime/blob/feature/chrome-extension/src/cli/assets/LOGO_MWT.png?raw=true)

CLI para controlar seu horário de trabalho, trazendo um jeito simples e fácil de registrar suas batidas de ponto e calcular seu horário de saída.
<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->



# Usage
<!-- usage -->
```sh-session
$ npm install -g my-worktime
$ my-worktime COMMAND
running command...
$ my-worktime (--version)
my-worktime/2.0.0-beta.2 win32-x64 node-v20.10.0
$ my-worktime --help [COMMAND]
USAGE
  $ my-worktime COMMAND
...
```
<!-- usagestop -->




# Commands
<!-- commands -->
* [`my-worktime check`](#my-worktime-check)
* [`my-worktime help [COMMANDS]`](#my-worktime-help-commands)
* [`my-worktime hit MARKS`](#my-worktime-hit-marks)
* [`my-worktime hit:calc MARKS`](#my-worktime-hitcalc-marks)
* [`my-worktime hit:clear`](#my-worktime-hitclear)
* [`my-worktime hit:delete MARKS`](#my-worktime-hitdelete-marks)
* [`my-worktime hit:reset`](#my-worktime-hitreset)
* [`my-worktime plugins`](#my-worktime-plugins)
* [`my-worktime plugins:install PLUGIN...`](#my-worktime-pluginsinstall-plugin)
* [`my-worktime plugins:inspect PLUGIN...`](#my-worktime-pluginsinspect-plugin)
* [`my-worktime plugins:install PLUGIN...`](#my-worktime-pluginsinstall-plugin-1)
* [`my-worktime plugins:link PLUGIN`](#my-worktime-pluginslink-plugin)
* [`my-worktime plugins:uninstall PLUGIN...`](#my-worktime-pluginsuninstall-plugin)
* [`my-worktime plugins:reset`](#my-worktime-pluginsreset)
* [`my-worktime plugins:uninstall PLUGIN...`](#my-worktime-pluginsuninstall-plugin-1)
* [`my-worktime plugins:uninstall PLUGIN...`](#my-worktime-pluginsuninstall-plugin-2)
* [`my-worktime plugins:update`](#my-worktime-pluginsupdate)
* [`my-worktime punch MARKS`](#my-worktime-punch-marks)
* [`my-worktime update [CHANNEL]`](#my-worktime-update-channel)

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
  -s, --system=<value>       [default: ahgora] Nome do sistema de ponto
  -u, --user=<value>         ID do usuário no sistema de ponto

DESCRIPTION
  Busca as batidas e calcula as horas trabalhadas para uma data específica

EXAMPLES
  $ my-worktime check -u 321 -p 123 -c a22

  $ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48

  $ my-worktime check -u 321 -p 123 -s ahgora -c a22 -j 08:48 -d 2020-09-23
```

_See code: [dist/commands/check.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.2/dist/commands/check.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.20/lib/commands/help.ts)_

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

_See code: [dist/commands/hit/index.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.2/dist/commands/hit/index.ts)_

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

_See code: [dist/commands/hit/calc.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.2/dist/commands/hit/calc.ts)_

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

_See code: [dist/commands/hit/clear.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.2/dist/commands/hit/clear.ts)_

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

_See code: [dist/commands/hit/delete.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.2/dist/commands/hit/delete.ts)_

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

_See code: [dist/commands/hit/reset.ts](https://github.com/carloshpds/my-worktime/blob/v2.0.0-beta.2/dist/commands/hit/reset.ts)_

## `my-worktime plugins`

List installed plugins.

```
USAGE
  $ my-worktime plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ my-worktime plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/lib/commands/plugins/index.ts)_

## `my-worktime plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ my-worktime plugins:add plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ my-worktime plugins:add

EXAMPLES
  $ my-worktime plugins:add myplugin 

  $ my-worktime plugins:add https://github.com/someuser/someplugin

  $ my-worktime plugins:add someuser/someplugin
```

## `my-worktime plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ my-worktime plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ my-worktime plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/lib/commands/plugins/inspect.ts)_

## `my-worktime plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ my-worktime plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -s, --silent   Silences yarn output.
  -v, --verbose  Show verbose yarn output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ my-worktime plugins:add

EXAMPLES
  $ my-worktime plugins:install myplugin 

  $ my-worktime plugins:install https://github.com/someuser/someplugin

  $ my-worktime plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/lib/commands/plugins/install.ts)_

## `my-worktime plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ my-worktime plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ my-worktime plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/lib/commands/plugins/link.ts)_

## `my-worktime plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ my-worktime plugins:remove plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ my-worktime plugins:unlink
  $ my-worktime plugins:remove

EXAMPLES
  $ my-worktime plugins:remove myplugin
```

## `my-worktime plugins:reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ my-worktime plugins:reset
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/lib/commands/plugins/reset.ts)_

## `my-worktime plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ my-worktime plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ my-worktime plugins:unlink
  $ my-worktime plugins:remove

EXAMPLES
  $ my-worktime plugins:uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/lib/commands/plugins/uninstall.ts)_

## `my-worktime plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ my-worktime plugins:unlink plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ my-worktime plugins:unlink
  $ my-worktime plugins:remove

EXAMPLES
  $ my-worktime plugins:unlink myplugin
```

## `my-worktime plugins:update`

Update installed plugins.

```
USAGE
  $ my-worktime plugins:update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v4.1.10/lib/commands/plugins/update.ts)_

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

## `my-worktime update [CHANNEL]`

update the my-worktime CLI

```
USAGE
  $ my-worktime update [CHANNEL] [-a] [--force] [-i | -v <value>]

FLAGS
  -a, --available        See available versions.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
      --force            Force a re-download of the requested version.

DESCRIPTION
  update the my-worktime CLI

EXAMPLES
  Update to the stable channel:

    $ my-worktime update stable

  Update to a specific version:

    $ my-worktime update --version 1.0.0

  Interactively select version:

    $ my-worktime update --interactive

  See available versions:

    $ my-worktime update --available
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v4.1.8/dist/commands/update.ts)_
<!-- commandsstop -->
