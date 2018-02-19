let moment = require('moment');

let WEEKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

let TEMPLATES = {
    date : 'YYYY-MM-DD',
    time : 'HH:mm',
    shW: 'w',//двиг по неделям
    shD: 'd', //сдвиг по дням
    shH: 'h',//сдвиг по часам
    weekDay: 'dddd'//формат для дней недели
};

class DueDate {
    constructor({date, time}) {
        if (!date) throw new Error('Нет date');

        this._date = date;

        this._time = time;

        this._currentWeekDay = moment().format(TEMPLATES.weekDay);//Friday
        this._currentTime = moment().format(TEMPLATES.time);//21:58
    }

    get currentWeekDay() {
        return this._currentWeekDay;
    }

    get currentTime() {
        return this._currentTime;
    }

    get date() {
        let options = this._date.split('-week-');
        let weekShift = 0;

        if (options[0] === 'previous') weekShift = -1;
        if (options[0] === 'next') weekShift = 1;

        let dayShift = WEEKDAYS.indexOf(options[1]) - WEEKDAYS.indexOf(this.currentWeekDay.toLowerCase());

        return moment().add(weekShift, TEMPLATES.shW)
            .add(dayShift, TEMPLATES.shD)
            .format(TEMPLATES.date);
    }

    get time() {
        if (this._time){
            return this._time === 'current' ? this.currentTime : this._time;
        }
        return null;
    }

    get nextDay() {
        return this.shiftDate(this.date, TEMPLATES.date, 1, TEMPLATES.shD);
    }

    get previousDay() {
        return this.shiftDate(this.date, TEMPLATES.date, -1, TEMPLATES.shD);
    }

    get nextHour() {
        return this.shiftDate(this.time, TEMPLATES.time, 1, TEMPLATES.shH);
    }

    get previousHour() {
        return this.shiftDate(this.time, TEMPLATES.time, -1, TEMPLATES.shH);
    }

    shiftDate(time, templ, count, key){
        return time ? moment(time, templ).add(count, key).format(templ): null;
    }

}


function isString(str) {
    return typeof str === 'string';
}

/**
 * state = 'previous'|'current'|'next', day = WEEKDAYS, time = 'current' || '13:45'
 * @param state
 * @param day
 * @param time
 * @returns {Object}
 */
function generateDateOptions(state, day, time) {
    if (!state || !day) throw new Error(`Нет state = ${state}, day = ${day}`);
    if (!isString(state) || !isString(day)) throw new Error(`Не строка state = ${state}, day = ${day}`);

    return time ? {date:`${state}-week-${day}`, time : time} : {date:`${state}-week-${day}`};
}


let dueDate = new DueDate(generateDateOptions('next', 'thursday', '07:03'));
console.log(dueDate.date); // 2018-03-01
console.log(dueDate.time); // 07:03
console.log(dueDate.nextDay); // 2018-03-02
console.log(dueDate.previousDay); // 2018-02-28
console.log(dueDate.nextHour); // 08:03
console.log(dueDate.previousHour); // 06:03
console.log('---------------------------');

let dueDate2 = new DueDate(generateDateOptions('current', 'thursday'));
console.log(dueDate2.date); // 2018-03-01
console.log(dueDate2.time); // null
console.log(dueDate2.nextDay); // 2018-03-02
console.log(dueDate2.previousDay); // 2018-02-28
console.log(dueDate2.nextHour); // null
console.log(dueDate2.previousHour); // null
console.log('---------------------------');

let dueDate3 = new DueDate(generateDateOptions('current', 'thursday', 'current'));
console.log(dueDate3.date);
console.log(dueDate3.time);
console.log(dueDate3.nextDay);
console.log(dueDate3.previousDay);
console.log(dueDate3.nextHour);
console.log(dueDate3.previousHour);
console.log('---------------------------');
