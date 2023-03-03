import isSameDate from './isSameDate';
import DateObject from 'react-date-object';

export default function selectDate(
	date,
	sort,
	{ range, selectedDate, format, focused: previousFocused }
) {
	date.setFormat(format);

	let focused = new DateObject(date);

	if (range) {
		selectedDate = selectRange();
	} else {
		selectedDate = focused;
	}

	return [selectedDate, focused];

	function selectRange() {
		if (selectedDate.length === 2 || selectedDate.length === 0) return [focused];
		if (selectedDate.length === 1) return [selectedDate[0], focused].sort((a, b) => a - b);
	}
}
