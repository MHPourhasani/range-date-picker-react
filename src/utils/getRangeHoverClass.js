const getRangeHoverClass = (date, selectedDate, dateHovered, rangeHover, type = 'day') => {
	const names = [];

	if (rangeHover && selectedDate?.length === 1 && dateHovered) {
		const format = type === 'day' ? 'YYYY/MM/DD' : 'YYYY/MM';
		const strHovered = dateHovered.format(format);
		const strSelected = selectedDate[0].format(format);
		const strDay = date.format(format);

		if (
			(strDay > strSelected && strDay <= strHovered) ||
			(strDay < strSelected && strDay >= strHovered)
		) {
			names.push('bg-secondary300'); // rmdp-range-hover

			if (strDay === strHovered) {
				names.push(strHovered > strSelected ? 'end bg-black' : 'start bg-black rounded-xl');
			}
		}
	}

	return names;
};

export default getRangeHoverClass;
