let moment = require('moment');

let WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

let TEMPLATES = {
    date : 'YYYY-MM-D',
    time : 'H:m'
};

class DueDate {
    constructor(dateOptions) {
        if (!dateOptions) throw new Error('Нет dateOptions');
        if (typeof dateOptions !== 'object') throw new Error('Не объект');

        this._date = dateOptions.date;

        this._time = dateOptions.time ? dateOptions.time : null;
    }

    get date() {
        return this.parseDate(this._date);
    }

    get time() {
        return this.parseTime(this._time);
    }

    get nextDay() {
        return moment(this.date, TEMPLATES.date).add(1, 'd').format(TEMPLATES.date);
    }

    get previousDay() {
        return moment(this.date, TEMPLATES.date).add(-1, 'd').format(TEMPLATES.date);
    }

    get nextHour() {
        return this.time ? moment(this.time, TEMPLATES.time).add(1, 'h').format(TEMPLATES.time) : null;
    }

    get previousHour() {
        return this.time ? moment(this.time, TEMPLATES.time).add(-1, 'h').format(TEMPLATES.time) : null;
    }

    /**
     *
     * @returns {string}
     */
    currentDay() {
        return moment().format('dd');//Fr
    }

    /**
     *
     * @returns {string}
     */
    currentTime() {
        return moment().format(TEMPLATES.time);//21:58
    }

    /**
     *
     * @param date
     * @returns {string}
     */
    parseDate(date) {
        let options = date.split('-week-');
        let weekShift = 0;

        if (options[0] === 'previous') weekShift = -1;
        if (options[0] === 'next') weekShift = 1;

        let dayShift = WEEKDAYS.indexOf(options[1]) - WEEKDAYS.indexOf(this.currentDay());

        return moment().add(weekShift, "w").add(dayShift, 'd').format(TEMPLATES.date);
    }

    /**
     *
     * @param time
     * @returns {*}
     */
    parseTime(time) {
        if (time) {
            return time === 'current' ? this.currentTime() : time;
        }
        return null;
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
function generateDateCod(state, day, time) {
    if (!state || !day) throw new Error(`Нет state = ${state}, day = ${day}`);
    if (!isString(state) || !isString(day)) throw new Error(`Не строка state = ${state}, day = ${day}`);

    return time ? {date:`${state}-week-${day}`, time : time} : {date:`${state}-week-${day}`};
}


let dueDate = new DueDate(generateDateCod('next', 'Mo', '21:14'));
console.log(dueDate.date); // 2018-02-19
console.log(dueDate.time); // 21:14
console.log(dueDate.nextDay); // 2018-02-20
console.log(dueDate.previousDay); // 2018-02-18
console.log(dueDate.nextHour); // 22:14
console.log(dueDate.previousHour); // 20;14


let dueDate2 = new DueDate(generateDateCod('current', 'Mo'));
console.log(dueDate2.date); // 2018-02-12
console.log(dueDate2.time); // null
console.log(dueDate2.nextDay); // 2018-02-13
console.log(dueDate2.previousDay); // 2018-02-06
console.log(dueDate2.nextHour); // null
console.log(dueDate2.previousHour); // null
