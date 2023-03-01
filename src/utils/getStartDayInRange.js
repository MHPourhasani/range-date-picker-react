import DateObject from 'react-date-object';

const getStartDayInRange = (range = [], toDate) => {
	if (!Array.isArray(range)) return [];

	let startDate = range[0];
	// endDate = range[range.length - 1],
	// dates = [];

	if (!(startDate instanceof DateObject) || !startDate.isValid) return [];

	startDate = new DateObject(startDate);
	// endDate = new DateObject(endDate);

	return startDate;
};

export default getStartDayInRange;
