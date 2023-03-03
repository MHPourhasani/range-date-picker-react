export default function isSameDate(firstDate, secondDate) {
	if (!firstDate || !secondDate) return false;

	if (firstDate.year === secondDate.year) {
		if (firstDate.monthIndex === secondDate.monthIndex) {
			return firstDate.day === secondDate.day;
		}
	}
}
