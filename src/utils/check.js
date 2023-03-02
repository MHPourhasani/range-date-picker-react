import DateObject from 'react-date-object';

const { calendar: persian, locale: persian_fa } = new DateObject();

const check = (calendar, locale) => {
	return [calendar || persian, locale || persian_fa];
};

export default check;
