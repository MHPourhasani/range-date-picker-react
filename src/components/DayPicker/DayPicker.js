import { useMemo, useRef } from 'react';
import DateObject from 'react-date-object';
import WeekDays from '../WeekDays/WeekDays';
import selectDate from '../../utils/selectDate';
import isSameDate from '../../utils/isSameDate';
import getRangeClass from '../../utils/getRangeClass';
import getRangeHoverClass from '../../utils/getRangeHoverClass';
import { useState } from 'react';
import getAllDatesInRange from '../../utils/getAllDatesInRange';

const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const weekStartDayIndex = 0;

const DayPicker = ({
	state,
	onChange,
	onlyShowInRangeDates,
	sort,
	numberOfMonths,
	handleFocusedDate,
	monthAndYears: [monthNames],
	rangeHover,
	todayStyle,
	allDayStyles,
	rangeDateStyle,
	oneDaySelectStyle,
	startRangeDayStyle,
	endRangeDayStyle,
}) => {
	const ref = useRef({}),
		{ today, minDate, maxDate, range, date, selectedDate, onlyMonthPicker, onlyYearPicker } =
			state,
		mustShowDayPicker = !onlyMonthPicker && !onlyYearPicker,
		[dateHovered, setDateHovered] = useState();
	const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
	const weekStartDayIndex = 0;

	ref.current.date = date;

	const months = useMemo(() => {
		if (!mustShowDayPicker) return [];

		return getMonths(ref.current.date, numberOfMonths, weekStartDayIndex);
		// eslint-disable-next-line
	}, [
		date.monthIndex,
		date.year,
		date.calendar,
		date.locale,
		mustShowDayPicker,
		numberOfMonths,
		weekStartDayIndex,
	]);

	function getMonths(date, numberOfMonths, weekStartDayIndex) {
		if (!date) return [];

		let months = [];

		for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
			date = new DateObject(date).toFirstOfMonth();

			let monthIndex = date.monthIndex,
				weeks = [];

			date.toFirstOfWeek().add(weekStartDayIndex, 'day');

			if (date.monthIndex === monthIndex && date.day > 1) date.subtract(7, 'days');

			for (let weekIndex = 0; weekIndex < 6; weekIndex++) {
				let week = [];

				for (let weekDay = 0; weekDay < 7; weekDay++) {
					week.push({
						date: new DateObject(date),
						day: date.format('D'),
						current: date.monthIndex === monthIndex,
					});

					date.day += 1;
				}

				weeks.push(week);

				if (weekIndex > 2 && date.monthIndex !== monthIndex) break;
			}

			months.push(weeks);
		}

		return months;
	}

	function getClassName(object, numberOfMonths) {
		let names = [
				// "rmdp-day",
				// 'w-12 h-12 flex justify-center font-thin items-center cursor-pointer',

				allDayStyles,
			],
			{ date, hidden, current } = object;

		if (!mustDisplayDay(object) || hidden) {
			names.push('text-secondary400'); // rmdp-day-hidden
		} else {
			if ((minDate && date < minDate) || (maxDate && date > maxDate) || object.disabled) {
				names.push('text-secondary400'); // rmdp-disabled

				if (!object.disabled) object.disabled = true;
			}

			if (!current) names.push('rmdp-deactive');

			let mustDisplaySelectedDate = (numberOfMonths > 1 && current) || numberOfMonths === 1;

			if (!object.disabled || !onlyShowInRangeDates) {
				if (isSameDate(date, today)) names.push('rmdp-today'); // todayStyle
				if (isSelected(date) && mustDisplaySelectedDate && !range) {
					names.push('rmdp-selected');
				}
			}

			if (range && !object.disabled && mustDisplaySelectedDate) {
				names.push(
					getRangeClass(
						date,
						selectedDate,
						// oneDaySelectStyle,
						rangeDateStyle,
						startRangeDayStyle,
						endRangeDayStyle
					)
				);

				names = names.concat(
					getRangeHoverClass(date, selectedDate, dateHovered, rangeHover)
				);
			}
		}

		return names.join(' ');
	}

	function isSelected(dateObject) {
		return [].concat(selectedDate).some((date) => isSameDate(date, dateObject));
	}

	function getAllProps(object) {
		if (!object.current) return {};

		let allProps = {};

		delete allProps.disabled;
		delete allProps.hidden;

		return allProps;
	}

	function mustDisplayDay(object) {
		if (object.current) return true;
	}

	function selectDay({ date: dateObject, current }, monthIndex, numberOfMonths) {
		let { selectedDate, focused, date } = state,
			{ hour, minute, second } = date;

		dateObject.set({
			hour: selectedDate?.hour || hour,
			minute: selectedDate?.minute || minute,
			second: selectedDate?.second || second,
		});

		if (numberOfMonths > 1 && !current) {
			if (monthIndex === 0 && dateObject < date) {
				date = new DateObject(date).toFirstOfMonth();
			}

			if (
				monthIndex > 0 &&
				dateObject.monthIndex > date.monthIndex + monthIndex &&
				monthIndex + 1 === numberOfMonths
			) {
				date = new DateObject(date).toFirstOfMonth().add(1, 'month');
			}
		}

		[selectedDate, focused] = selectDate(dateObject, sort, state);

		onChange(selectedDate, {
			...state,
			date,
			focused,
			selectedDate,
		});

		handleFocusedDate(focused, dateObject);
	}

	return (
		// کل تقویم به غیر از هدر
		<div
			className={`my-7 flex w gap-8`}
			onMouseLeave={() => rangeHover && setDateHovered()}>
			{months.map((weeks, monthIndex) => (
				<div key={monthIndex}>
					<WeekDays
						state={state}
						customWeekDays={weekDays}
						weekStartDayIndex={weekStartDayIndex}
						className='flex w-full items-center justify-between text-11 font-medium text-primary'
					/>

					{weeks.map((week, index) => (
						<div
							key={index}
							// هر هفته
							className='flex w-full items-center justify-center'>
							{week.map((object, i) => {
								//To clear the properties which are added from the previous render
								object = {
									date: object.date,
									day: object.day,
									current: object.current,
								};

								let allProps = getAllProps(object),
									mustAddClassName = mustDisplayDay(object) && !object.disabled,
									className = `${
										mustAddClassName ? 'sd bg-red-200' : 'bg-red-200'
									}`,
									children = allProps.children;

								if (mustAddClassName)
									className = `${className} ${allProps.className || ''}`;
								// console.log(className);

								// if ((minDate && date < minDate) || (maxDate && date > maxDate) || object.disabled) {
								// 	// names.push("rmdp-disabled");
								// 	names.push('text-disable');

								// 	if (!object.disabled) object.disabled = true;
								// }

								delete allProps.className;
								delete allProps.children;

								let parentClassName = getClassName(object, numberOfMonths);

								if (object.hidden || object.disabled)
									className = className.replace('sd', '');

								return (
									<div
										key={i}
										// هر خونه مربع تقویم
										className={`${parentClassName} 						
											`}
										onMouseEnter={() =>
											rangeHover && setDateHovered(object.date)
										}
										onClick={() => {
											if (!mustDisplayDay(object) || object.disabled) return;

											selectDay(object, monthIndex, numberOfMonths);
										}}>
										<span
											// اعضای داخل هر مربع تقویم
											className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl text-14 hover:border-1.5 hover:border-primary`}
											{...allProps}>
											{mustDisplayDay(object) && !object.hidden
												? children ?? object.day
												: ''}
										</span>
									</div>
								);
							})}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default DayPicker;
