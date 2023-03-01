import { isValidElement, cloneElement } from 'react';
import Arrow from '../Arrow/Arrow';
import { FiChevronDown } from 'react-icons/fi';
import YearPicker from '../YearPicker/YearPicker';
import MonthPicker from '../MonthPicker/MonthPicker';

const Header = ({
	value,
	state,
	setState,
	disableYearPicker,
	disableMonthPicker,
	buttons,
	renderButton,
	handleMonthChange,
	disabled,
	hideMonth,
	onChange,
	hideYear,
	monthAndYears: [months, years],
}) => {
	let style = {},
		{
			date,
			onlyMonthPicker,
			onlyYearPicker,
			mustShowYearPicker,
			minDate,
			maxDate,
			year,
			today,
		} = state,
		isPreviousDisable =
			minDate && date.year <= minDate.year && minDate.monthIndex > date.monthIndex - 1,
		isNextDisable =
			maxDate && date.year >= maxDate.year && maxDate.monthIndex < date.monthIndex + 1;

	let maxYear = today.year + 7;

	maxYear = maxYear - 12 * Math.floor((maxYear - year) / 12);


	// if (mustShowYearPicker) {
	// 	let minYear = maxYear - 11;

	// 	isPreviousDisable = minDate && minDate.year > minYear;
	// 	isNextDisable = maxDate && maxDate.year < maxYear;
	// }

	// if (disabled) {
	// 	isPreviousDisable = true;
	// 	isNextDisable = true;
	// }

	return (
		// rmdp-header
		<div className='flex h-10 w-full items-center justify-between text-14 font-bold'>
			<div className='relative flex w-full justify-between'>
				{months.map((month, index) => (
					<div
						key={index}
						// className='rmdp-header-values flex items-center justify-between pl-1'
						className='flex w-full items-center justify-between'
						style={style}>
						{getButton('left')}
						{/* <span className={`flex w-32 cursor-pointer items-center justify-between`}>
							{month}
						</span> */}
						<MonthPicker state={state} onChange={onChange} />
						<YearPicker state={state} onChange={onChange} />
						{getButton('right')}
					</div>
				))}
			</div>
		</div>
	);

	function getButton(direction) {
		let handleClick = () => increaseValue(direction === 'right' ? 1 : -1),
			disabled =
				(direction === 'left' && isPreviousDisable) ||
				(direction === 'right' && isNextDisable);

		return <Arrow direction={direction} onClick={handleClick} disabled={disabled} />;
	}

	function increaseValue(value) {
		if (disabled || (value < 0 && isPreviousDisable) || (value > 0 && isNextDisable)) return;

		if (!mustShowYearPicker && !onlyYearPicker) {
			date.toFirstOfMonth();

			if (onlyMonthPicker) {
				date.year += value;
			} else {
				date.month += value;

				handleMonthChange(date);
			}
		} else {
			year = year + value * 12;

			if (value < 0 && minDate && year < minDate.year) year = minDate.year;
			if (value > 0 && maxDate && year > maxDate.year) year = maxDate.year;
		}

		// if (fullYear) {
		// 	date.year += value;
		// } else if (!mustShowYearPicker && !onlyYearPicker) {
		// 	date.toFirstOfMonth();

		// 	if (onlyMonthPicker) {
		// 		date.year += value;
		// 	} else {
		// 		date.month += value;

		// 		handleMonthChange(date);
		// 	}
		// } else {
		// 	year = year + value * 12;

		// 	if (value < 0 && minDate && year < minDate.year) year = minDate.year;
		// 	if (value > 0 && maxDate && year > maxDate.year) year = maxDate.year;
		// }

		setState({
			...state,
			date,
			year,
		});
	}

	function toggle(picker) {
		if (disabled) return;

		let object = {
			mustShowMonthPicker: false,
			mustShowYearPicker: false,
		};

		object[picker] = !state[picker];

		setState({
			...state,
			...object,
		});
	}
};

export default Header;
