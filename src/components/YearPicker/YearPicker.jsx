import { useEffect } from 'react';
import { Fragment, useState, useMemo } from 'react';
import { Listbox, Transition } from '@headlessui/react';

// components
import DateObject from 'react-date-object';
import toLocaleDigits from '../../common/toLocaleDigits';

// icons
import { ReactComponent as ArrowDown } from '../../assets/svg/arrow-down.svg';

// styles
import styles from '../../styles/scrollbar.module.css';


const YearPicker = ({ state, onChange, handleFocusedDate, onYearChange }) => {
	const { date, today, minDate, maxDate, selectedDate, onlyShowInRangeDates, year } =
			state,
		digits = date.digits,
		[yearHovered, setyearHovered] = useState();

	const [selectedYear, setSelectedYear] = useState(today.year);
	let minYear = today.year - 4;

	minYear = minYear - 12 * Math.ceil((minYear - year) / 12);

	const notInRange = (year) => {
		return (minDate && year < minDate.year) || (maxDate && year > maxDate.year);
	};

	const years = useMemo(() => {
		let years = [],
			year = minYear;

		for (let i = 0; i < 10; i++) {
			years.push(year);
			year++;
		}

		return years;
	}, [minYear]);

	const selectYear = (year) => {
		if (notInRange(year)) return;

		let date = new DateObject(state.date).setYear(year),
			{ selectedDate, focused } = state;

		if (minDate && date.monthIndex < minDate.monthIndex) {
			date = date.setMonth(minDate.monthIndex + 1);
		} else if (maxDate && date.monthIndex > maxDate.monthIndex) {
			date = date.setMonth(maxDate.monthIndex + 1);
		}

		onChange(undefined, {
			...state,
			date,
			focused,
			selectedDate,
			mustShowYearPicker: false,
		});
	};

	const getClassName = (year) => {
		let names = ['rmdp-day'],
			{ date, selectedDate } = state;

		if (notInRange(year)) names.push('text-secondary400'); // rmdp-disabled

		if (names.includes('text-secondary400') && onlyShowInRangeDates) return; // rmdp-disabled

		if (today.year === year) names.push('text-primary'); // rmdp-today

		if (year === date.year) names.push('text-primary'); // rmdp-selected

		return names.join(' ');
	};

	console.log(selectedDate);

	return (
		<div>
			<Listbox
				// value={
				// 	selectedDate && selectedDate[0].year !== today.year
				// 		? selectedDate.year
				// 		: selectedYear
				// }
				onChange={(e) => setSelectedYear(e)}>
				<Listbox.Button
					// value={
					// 	selectedDate[0].year !== today.year ? selectedDate[0].year : selectedYear
					// }
					className='relative flex w-auto cursor-pointer items-center gap-5 bg-white py-2 text-15'>
					<span>
						{/* {selectedDate[0] ? selectedDate[0].year : selectedYear} */}
						{/* {selectedDate.map((date) => {
							return date.year;
						}) !== today.year
							? selectedDate.year
							: selectedYear} */}
						{selectedYear}
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
						{years.map((year) => (
							<Listbox.Option
								key={year}
								value={year}
								disabled={notInRange(year)}
								onClick={() => selectYear(year)}
								className={({ active }) =>
									`${getClassName(
										year
									)} flex cursor-pointer select-none flex-col items-start py-2 pr-4 disabled:text-secondary400 ${
										active ? 'text-primary' : 'text-secondary800'
									}`
								}>
								{({ selected }) => (
									<span
										className={`font-medium ${selected ? 'text-primary' : ''}`}>
										{toLocaleDigits(year.toString(), digits)}
									</span>
								)}
							</Listbox.Option>
						))}
					</Listbox.Options>
				</Transition>
			</Listbox>
		</div>
	);
};

export default YearPicker;
