import React, { useMemo } from 'react';
import isArray from '../../utils/isArray';
import DateObject from 'react-date-object';

export default function WeekDays({
	state: {
		date: { calendar, locale },
	},
	customWeekDays,
	weekStartDayIndex,
	displayWeekNumbers,
	weekNumber,
	className,
}) {
	let weekDays = useMemo(() => {
		let weekDays = customWeekDays;

		if (isArray(weekDays) && weekDays.length >= 7) {
			weekDays.length = 7;

			weekDays = weekDays.map((weekDay) => {
				if (isArray(weekDay) & (weekDay.length > 1)) {
					weekDay = weekDay[1];
				} else if (isArray(weekDay)) {
					weekDay = weekDay[0];
				}

				return weekDay;
			});
		} else {
			weekDays = new DateObject({
				year: 1,
				calendar,
				locale,
			}).weekDays.map((weekDay) => weekDay.shortName);
		}

		return weekDays;
	}, [calendar, locale, customWeekDays]);

	weekDays = [...weekDays]
		.slice(weekStartDayIndex)
		.concat([...weekDays].splice(0, weekStartDayIndex));

	return (
		<div className={className}>
			{weekDays.map((weekDay, index) => (
				<div key={index} className='flex flex-col justify-center'>
					{weekDay}
				</div>
			))}
		</div>
	);
}
