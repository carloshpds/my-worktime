#!/usr/bin/env node

import { WorktimeProviderOptions, WorktimeDayResume, WorktimeDayWorkedTime } from "./providers/types"

import * as program from 'commander'
import Ahgora from './providers/Ahgora'
import * as moment from "moment"
import 'moment/locale/pt-br'
import ClockHelper from "./utils/ClockHelper"
import * as ora from 'ora'
import WorktimeProvider from "./providers/WorktimeProvider"
import calculateShouldLeaveClockTime from "./hackaton/calculateShouldLeaveClockTime"

program
    .requiredOption('-u, --user [user]', 'ID do usuário no sistema de ponto')
    .requiredOption('-p, --password [password]', 'Senha do usuário no sistema')
    .requiredOption('-s, --system [system]', 'Nome do sistema de ponto', 'ahgora')
    .requiredOption('-c, --company [company]', 'ID da empresa no sistema de ponto')
    .option('-d, --date [date]', 'Data relacionada a consulta de horas', moment().format('YYYY-MM-DD'))
    .option('-dbg, --debug [debug]', 'Debug - Exibe mais informações na execução', false)
    .option('-jt, --journeytime [journeyTime]', 'Quantidade de horas a serem trabalhadas por dia', '08:00')
    .action(async (args) => {
        const options: Partial<WorktimeProviderOptions> = {
          userId    : args.user     || process.env.WORKTIME_USER,
          password  : args.password || process.env.WORKTIME_PASSWORD,
          systemId  : args.system || process.env.WORKTIME_SYSTEM,
          companyId : args.company || process.env.WORKTIME_COMPANY,
          date : args.date || process.env.WORKTIME_DATE,
          debug     : /true/i.test(args.debug),
          journeyTime : args.journeytime || process.env.WORKTIME_JOURNEYTIME,
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

        // Runtime parameters
        options.momentDate = options.date ? moment(options.date) : moment()
        ClockHelper.debug = options.debug

        const providers = {
          ahgora: Ahgora
        }

        const currentProviderClass = providers[options.systemId.toLowerCase()]
        const loader = ora(`Iniciando...`).start()

        if(currentProviderClass){
          try {
            const worktimeProvider: WorktimeProvider = new currentProviderClass(options)
            loader.text = `Buscando dados no ${worktimeProvider.name}`
            const marks = await worktimeProvider.getDateMarks()
            // const worktimeDayResume: WorktimeDayResume = await worktimeProvider.getWorktimeDayResume()
            const worktimeDayResume: WorktimeDayWorkedTime = worktimeProvider.calculateWorkedTimeMinutes(marks, options.momentDate.format())
            const shouldLeaveClockTime = calculateShouldLeaveClockTime({
              ...worktimeDayResume,
              marks,
            })
            loader.succeed(`Dados encontrados, seu horário de saída ideal é ${shouldLeaveClockTime}`)
            // console.log(marks.map(mark => mark.clock).join(' '))
            marks.length && console.table(marks)
          } catch (err) {
            options.debug && console.error(err)
            loader.fail('Não foi possível calcular. Verifique os parâmetros e tente novamente')
          }
        } else {
          loader.fail('Parece que ainda não suportamos o seu sistema de ponto :(')
        }
    })
    .parse(process.argv);
