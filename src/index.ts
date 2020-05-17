#!/usr/bin/env node

import { WorktimeProvider, WorktimeProviderOptions } from "./providers/types";

import * as program from 'commander'
import Ahgora from './providers/Ahgora'
import moment from "moment";

program
    .option('-u, --user [user]', 'ID do usuário no sistema de ponto')
    .option('-p, --password [password]', 'Senha do usuário no sistema')
    .option('-s, --system [system]')
    .option('-c, --company [company]')
    .option('-d, --date [date]')
    .option('-dbg, --debug [debug]')
    .option('-jt, --journeytime [journeyTime]')
    .action((args) => {
        const date = args.date || process.env.WORKTIME_DATE
        const options: WorktimeProviderOptions = {
          userId    : args.user     || process.env.WORKTIME_USER,
          password  : args.password || process.env.WORKTIME_PASSWORD,
          systemId  : args.system || process.env.WORKTIME_SYSTEM,
          companyId : args.company || process.env.WORKTIME_COMPANY,
          date,
          momentDate: date ? moment(date) : moment(),
          debug     : args.debug || process.env.WORKTIME_DEBUG,
          journeyTime : args.journeyTime || process.env.WORKTIME_JOURNEYTIME || '08:00',
        }

        if(!options.userId || !options.password || !options.systemId || !options.companyId) {
          console.log('Não foi possível recuperar as credenciais do sistema de ponto');
          console.log('Você pode definir as variáveis de ambiente "WORKTIME_USER" e "WORKTIME_PASSWORD"');
          console.log('Use worktime -h para informar as credencias via linha de comando.');
          return;
        }

        if(options.debug){
          console.group('WorktimeOptions')
          console.log('Iniciando com os parâmetros')
          console.table(options)
          console.groupEnd()
        }

        const providers = {
          ahgora: Ahgora
        }

        const currentProviderClass = providers[options.systemId.toLowerCase()]

        if(currentProviderClass){
          const worktimeProvider: WorktimeProvider = new currentProviderClass(options)
          worktimeProvider.getWorktimeDayResume()
        } else {
          console.log('Parece que ainda não suportamos o seu sistema de ponto :(')
        }
    })
    .parse(process.argv);
