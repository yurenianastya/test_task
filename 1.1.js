Date.prototype.daysTo = function(dayObj) {
    return dayObj.getDay() - this.getDay();
}


// test values
let d1 = new Date(2023, 0, 1, 12, 0, 0, 0);
let d2 = new Date(2023, 0, 6, 12, 0, 0, 0);

console.log('number of days between: ', d1.daysTo(d2));