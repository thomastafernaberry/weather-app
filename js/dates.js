export { getConsecutiveDates }

function getConsecutiveDates(date, daysQuantity) {
    const currentDate = date;
    let consecutiveDatesArray = [];
    for (let i = 0; i <= daysQuantity; i++) {
        let currentNumberOfMonth = date.getDate();
        currentDate.setDate(currentNumberOfMonth + 1);
        consecutiveDatesArray = consecutiveDatesArray.concat(currentDate.getDate());
    }
    return consecutiveDatesArray;
}
