import { Fragment, useMemo, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';

import selectDate from '../../utils/selectDate';
import isSameDate from '../../utils/isSameDate';
import getRangeClass from '../../utils/getRangeClass';
import isArray from '../../utils/isArray';
import stringify from '../../utils/stringify';
import getRangeHoverClass from '../../utils/getRangeHoverClass';
import DateObject from 'react-date-object';

// icons
import { ReactComponent as ArrowDown } from '../../assets/svg/arrow-down.svg';

// styles
import styles from './MonthPicker.module.css';

export default function MonthPicker({
	state,
	onChange,
	customMonths,
	sort,
	handleMonthChange,
	handleFocusedDate,
	rangeHover,
}) {
	const {
			date,
			today,
			minDate,
			maxDate,
			calendar,
			locale,
			selectedDate,
			range,
			onlyShowInRangeDates,
		} = state,
		mustShowMonthPicker = state.mustShowMonthPicker,
		[dateHovered, setDateHovered] = useState();

	const [selectedMonth, setSelectedMonth] = useState(today.month);

	customMonths = customMonths && stringify(customMonths);

	const months = useMemo(() => {
		let months = customMonths && JSON.parse(customMonths),
			monthsArray = [],
			index = 0,
			date = new DateObject({
				calendar,
				locale,
				format: state.date._format,
				year: state.date.year,
				month: 1,
				day: 1,
			});

		if (isArray(months) && months.length >= 12) {
			months.length = 12;

			months = months.map((month) => (isArray(month) ? month[0] : month));
		} else {
			months = date.locale.months.map(([month]) => month);
		}

		let array = [];

		for (let i = 0; i < 12; i++) {
			array.push({
				date: new DateObject(date),
				name: months[index],
			});

			index++;
			date.add(1, 'month');
		}

		monthsArray.push(array);

		return monthsArray;
	}, [calendar, locale, customMonths, state.date.year, state.date._format]);

	// return (
	// 	<div
	// 		// rmdp-month-picker
	// 		className={`absolute top-0 flex h-10 flex-col items-center rounded-md bg-white text-14 ${
	// 			mustShowMonthPicker ? 'flex' : 'hidden'
	// 		}`}
	// 		onMouseLeave={() => rangeHover && setDateHovered()}>
	// 		{months.map((month, i) => (
	// 			<div key={i} className='rmdp-ym gap-10'>
	// 				{month.map(({ date, name }, j) => (
	// 					<div
	// 						key={j}
	// 						className={`${getClassName(date)}`}
	// 						onClick={() => selectMonth(date)}
	// 						onMouseEnter={() => rangeHover && setDateHovered(date)}>
	// 						<span className={''}>{name}</span>
	// 					</div>
	// 				))}
	// 			</div>
	// 		))}
	// 	</div>
	// );

	return (
		<div>
			<Listbox
				value={selectedDate.month !== today.month ? selectedDate.month : selectedMonth}
				onChange={(e) => setSelectedMonth(e)}>
				<Listbox.Button
					value={selectedDate.month !== today.month ? selectedDate.month : selectedMonth}
					className='relative flex w-auto cursor-pointer items-center gap-5 bg-white py-2 text-15'>
					<span className='block'>
						{selectedDate.month !== today.month ? selectedDate.month : selectedMonth}
					</span>
					<ArrowDown />
				</Listbox.Button>

				<Transition
					as={Fragment}
					leave='transition ease-in duration-100'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
					className={styles.scrollbar_hidden}>
					<Listbox.Options className='absolute h-60 w-36 overflow-y-scroll rounded-md border-1 border-secondary300 bg-white py-1 text-15 shadow-calendar focus:outline-none'>
						{months.map((month) => (
							<Listbox.Option
								key={month}
								value={month}
								// disabled={notInRange(month)}
								onClick={() => selectMonth(month)}
								className={({ active }) =>
									`${getClassName(
										month
									)} flex cursor-pointer select-none flex-col items-start py-2 pr-4 disabled:text-secondary400 ${
										active ? 'text-primary' : 'text-secondary800'
									}`
								}>
								{({ selected }) => (
									<span
										className={`font-medium ${selected ? 'text-primary' : ''}`}>
										{/* {month.toString()} */}
										{month}
									</span>
								)}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</Listbox>
		</div>
	);
	// };

	function selectMonth(dateObject) {
		let { selectedDate, focused } = state,
			{ year, monthIndex } = dateObject;

		if (
			(minDate && year <= minDate.year && monthIndex < minDate.monthIndex) ||
			(maxDate && year >= maxDate.year && monthIndex > maxDate.monthIndex)
		)
			return;

		date.setMonth(monthIndex + 1);

		handleMonthChange(date);

		onChange(undefined, {
			...state,
			date,
			focused,
			selectedDate,
			mustShowMonthPicker: false,
		});
	}

	function getClassName(dateObject) {
		let names = ['rmdp-day relative px-3 py-2 cursor-pointer'],
			{ year, monthIndex } = dateObject,
			{ selectedDate } = state;

		if (
			(minDate &&
				(year < minDate.year ||
					(year === minDate.year && monthIndex < minDate.monthIndex))) ||
			(maxDate &&
				(year > maxDate.year || (year === maxDate.year && monthIndex > maxDate.monthIndex)))
		)
			// names.push('rmdp-disabled text-gray-400');
			names.push('text-disable');

		// if (names.includes('rmdp-disabled text-gray-400') && onlyShowInRangeDates) return;
		if (names.includes('text-disable') && onlyShowInRangeDates) return;

		// if (isSameDate(today, dateObject, true)) names.push('rmdp-today text-primary');
		if (isSameDate(today, dateObject, true)) names.push('text-primary');

		// if (!range) {
		// 	if ([].concat(selectedDate).some((date) => isSameDate(date, dateObject, true)))
		// 		names.push('rmdp-selected bg-primary text-white rounded-md');
		// } else {
		// 	names.push(getRangeClass(dateObject, selectedDate, true));

		// 	names = names.concat(
		// 		getRangeHoverClass(dateObject, selectedDate, dateHovered, rangeHover, 'month')
		// 	);
		// }

		if (range) {
			names.push(getRangeClass(dateObject, selectedDate, true));

			names = names.concat(
				getRangeHoverClass(dateObject, selectedDate, dateHovered, rangeHover, 'month')
			);
		}

		// if (!onlyMonthPicker) {
		// 	if (date.monthIndex === monthIndex)
		// 		names.push('rmdp-selected bg-primary text-white rounded-md');
		// } else {
		// 	if (!range) {
		// 		if ([].concat(selectedDate).some((date) => isSameDate(date, dateObject, true)))
		// 			names.push('rmdp-selected bg-primary text-white rounded-md');
		// 	} else {
		// 		names.push(getRangeClass(dateObject, selectedDate, true));

		// 		names = names.concat(
		// 			getRangeHoverClass(dateObject, selectedDate, dateHovered, rangeHover, 'month')
		// 		);
		// 	}
		// }

		return names.join(' ');
	}
}
