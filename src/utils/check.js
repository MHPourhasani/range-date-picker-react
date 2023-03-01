import DateObject from 'react-date-object';

const { calendar: persian, locale: persian_fa } = new DateObject();

const check = (calendar, locale) => {
	if (calendar && calendar.constructor !== Object) {
		calendar = undefined;
	}

	if (locale && locale.constructor !== Object) {
		locale = undefined;
	}

	return [calendar || persian, locale || persian_fa];
};

export default check;
