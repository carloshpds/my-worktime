const moment = require('moment');
const axios = require('axios');
const qs = require('qs');


module.exports = class Ahgora{
    constructor(user_id, password){
        this.url = 'https://www.ahgora.com.br/externo/getApuracao';
        this.options = {};
        this.current = moment().format('YYYY-MM-DD');
        this.options.headers = {
            "content-type": "application/x-www-form-urlencoded"
        };
        this.body = {
            ano: new Date().getFullYear(),
            company: 'a382748',
            senha: password,
            matricula: user_id,
            mes: new Date().getMonth() + 1,
        };
    }

    day(){
        console.log('old request body', this.body)
        console.log('old request body options', this.options)
        return  axios.post(this.url, qs.stringify(this.body), this.options)
            // .then(result => result?result.data:null)
            // .then(data => data?data.dias:{})
            // .then(dias => dias[this.current]);
    }

    convertToMinutes(str){
        return (parseInt(str.substring(0, 2))*60)+parseInt(str.substring(2));
    }

    convertToHours(realHour) {
        return `${(new String(Math.floor(realHour/60))).padStart(2, '0')}:${(new String(parseInt(realHour%60))).padStart(2, '0')}`;
    }

    calculateRealHour(batidas, [{valor: worked}, {valor: planned}], interval){
        let letHours = this.convertToMinutes(planned) - this.convertToMinutes(worked);

        if(interval < 30){
            letHours += 30-interval;
        }

        const {hora} = batidas.pop();
        const realHour = this.convertToMinutes(hora) + letHours;

        return this.convertToHours(realHour)
    }

    calculateInterval(batidas){
        let interval = 0;
        for(let i = 2; i<batidas.length; i++){
            if(batidas[i]){
                interval += this.convertToMinutes(batidas[i].hora) - this.convertToMinutes(batidas[i-1].hora)
            }
        }
        return interval;
    }

    workedTime([{valor: worked}]){
        return `${worked.substring(0, 2)}:${worked.substring(2)}`;
    }

    workedTimeWithoutFormat([{valor: worked}]){
        return worked;
    }

    plannedTime([,{valor: planned}]){
        return `${planned.substring(0, 2)}:${planned.substring(2)}`;
    }

    workedHoursUntilCurrentTime(workedHours, punchTimes, interval) {
        const launchTime = this.convertToMinutes(punchTimes[2].hora)

        const today = new Date();
        const currentTime = today.getHours() +''+ today.getMinutes()
        const currentTimeInMinutes = this.convertToMinutes(currentTime)

        return this.convertToHours(((currentTimeInMinutes - launchTime) + this.convertToMinutes(workedHours)))
    }

    async calculate(){
        const { batidas, resultado } = await this.day();

        const interval = this.calculateInterval(batidas);
        const workedUntilNow = this.workedHoursUntilCurrentTime(this.workedTimeWithoutFormat(resultado), batidas, interval);

        if(batidas.length === 0){
            return 'Você não fez nenhum registro de ponto.';
        }

        const leaveTime = this.calculateRealHour(batidas, resultado, interval);
        return `\r\n⏱  Registered hours: ${this.workedTime(resultado)} \r\n👨🏼‍💻 Worked hours until now: ${workedUntilNow} \r\n🏖  Interval time: ${interval} min. \r\n🏃🏼‍♂️💨 You should go at: ${leaveTime} \r\n`
    }
};