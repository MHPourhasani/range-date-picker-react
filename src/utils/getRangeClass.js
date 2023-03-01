import isSameDate from './isSameDate';

export default function getRangeClass(
	date,
	selectedDate,
	// checkMonth,
	// oneDaySelectStyle,
	rangeDateStyle,
	startRangeDayStyle,
	endRangeDayStyle
) {
	let first = selectedDate[0],
		second = selectedDate[1],
		names = [];
	// console.log(selectedDate[0]);

	if (selectedDate.length === 1) {
		// if (isSameDate(date, first, checkMonth)) names.push('rmdp-range text-black bg-primary text-white rounded-md');
		// if (isSameDate(date, first, checkMonth))
		if (isSameDate(date, first)) {
			names.push('bg-primary text-white rounded-xl');
			// names.push(oneDaySelectStyle);
		}
	} else if (selectedDate.length === 2) {
		if (date.toDays() >= first.toDays() && date.toDays() <= second.toDays()) {
			// names.push('rmdp-range');
			names.push('bg-sky-200');
			// names.push(rangeDateStyle);
		}

		// if (isSameDate(date, first, checkMonth, startRangeDayStyle))
		// if (isSameDate(date, first, checkMonth))
		if (isSameDate(date, first)) {
			// return startRangeDayStyle;
			// names.push({ startRangeDayStyle: startRangeDayStyle });
			// names.push('start');
			names.push('bg-primary text-white rounded-r-xl');
		}

		// if (isSameDate(date, second, checkMonth, endRangeDayStyle))
		// if (isSameDate(date, second, checkMonth))
		if (isSameDate(date, second)) {
			// return endRangeDayStyle + 'rounded-l-m';
			// names.push({ endRangeDayStyle: endRangeDayStyle });
			// names.push('end');
			names.push('bg-primary text-white rounded-l-xl');
		}
	}

	return names.join(' ');
}
