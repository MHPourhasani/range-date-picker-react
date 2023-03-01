import { useState, useEffect, forwardRef, useRef } from 'react';
import DayPicker from '../DayPicker/DayPicker';
import Header from '../Header/Header';
import DateObject from 'react-date-object';
import getFormat from '../../utils/getFormat';
import toDateObject from '../../utils/toDateObject';
import isArray from '../../utils/isArray';
import check from '../../utils/check';
import toLocaleDigits from '../../common/toLocaleDigits';
import './Calendar.css';

// icons
import { ReactComponent as CalendarIcon } from '../../assets/svg/calendar.svg';

function Calendar(
	{
		value,
		calendar,
		locale,
		format,
		range = false,
		className,
		months,
		children,
		onChange,
		minDate,
		maxDate,
		mapDays,
		onReady,
		onlyShowInRangeDates = true,
		sort,
		dayStyles,
		todayStyle,
		calendarStyle,
		rangeDateStyle,
		currentDate,
		digits,
		onPropsChange,
		onMonthChange,
		onFocusedDateChange,
		disabled,
		hideWeekDays,
		weekPicker,
		rangeHover,
		oneDaySelectStyle,
		allDayStyles,
		startRangeDayStyle,
		endRangeDayStyle,
	},
	outerRef
) {
	const weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
	const weekStartDayIndex = 0;
	const numberOfMonths = 2;

	if (currentDate && !(currentDate instanceof DateObject)) {
		currentDate = undefined;
	}

	[calendar, locale] = check(calendar, locale);

	format = getFormat(format);
	mapDays = [].concat(mapDays).filter(Boolean);
	/**
	 * Each plugin can return several different plugins.
	 * So in the first place, plugins might look like this:
	 * [plugin1, [plugin2, plugin3], plugin4]
	 * For this reason, we remove the extra arrays inside the plugins.
	 */

	let [state, setState] = useState({}),
		listeners = {},
		ref = useRef({ mustCallOnReady: true, currentDate });

	useEffect(() => {
		setState((state) => {
			let { currentDate } = ref.current;
			let { date, selectedDate, initialValue, focused, mustSortDates } = state;

			function checkDate(date) {
				if (!date) return;
				if (date.calendar.name !== calendar.name) date.setCalendar(calendar);
				if (date.locale.name !== locale.name) date.setLocale(locale);
				if (date._format !== format) date.setFormat(format);

				date.digits = digits;

				return date;
			}

			function getDate(value) {
				return new DateObject(currentDate || value);
			}

			if (!value) {
				if (!date) date = getDate({ calendar, locale, format });
				if (initialValue) selectedDate = undefined;
			} else {
				selectedDate = getSelectedDate(value, calendar, locale, format);

				if (isArray(selectedDate)) {
					if (!date) date = getDate(selectedDate[0]);
				} else {
					if (!date || numberOfMonths === 1) {
						date = getDate(selectedDate);
					} else {
						let min = new DateObject(date).toFirstOfMonth();
						let max = new DateObject(date)
							.add(numberOfMonths - 1, 'months')
							.toLastOfMonth();

						if (selectedDate < min || selectedDate > max) {
							date = new DateObject(selectedDate);
						}
					}
				}
			}

			[].concat(selectedDate).forEach(checkDate);

			checkDate(date);

			if (range || isArray(value)) {
				if (!selectedDate) selectedDate = [];
				if (!isArray(selectedDate)) selectedDate = [selectedDate];

				if (range && selectedDate.length > 2) {
					let lastItem = selectedDate[selectedDate.length - 1];

					selectedDate = [selectedDate[0], lastItem];
					focused = lastItem;
				}

				if (range) {
					selectedDate.sort((a, b) => a - b);
				}
			} else if (isArray(selectedDate)) {
				selectedDate = selectedDate[selectedDate.length - 1];
			}

			delete ref.current.currentDate;

			return {
				...state,
				date,
				selectedDate,
				range,
				initialValue: state.initialValue || value,
				value,
				focused,
				calendar,
				locale,
				format,
				dayStyles,
				allDayStyles,
				todayStyle,
				calendarStyle,
				oneDaySelectStyle,
				mustSortDates,
				rangeDateStyle,
				year: date.year,
				today: state.today || new DateObject({ calendar }),
				weekPicker,
				startRangeDayStyle,
				endRangeDayStyle,
			};
		});
	}, [
		value,
		calendar,
		locale,
		format,
		range,
		sort,
		numberOfMonths,
		digits,
		calendarStyle,
		oneDaySelectStyle,
		weekPicker,
		todayStyle,
		dayStyles,
		allDayStyles,
		rangeDateStyle,
		startRangeDayStyle,
		endRangeDayStyle,
	]);

	useEffect(() => {
		if (!minDate && !maxDate) return;

		setState((state) => {
			let { calendar, locale, format } = state;

			let [selectedDate, $minDate, $maxDate] = getDateInRangeOfMinAndMaxDate(
				getSelectedDate(value, calendar, locale, format),
				minDate,
				maxDate,
				calendar
			);

			return {
				...state,
				inRangeDates: onlyShowInRangeDates ? selectedDate : state.selectedDate,
				minDate: $minDate,
				maxDate: $maxDate,
			};
		});
	}, [minDate, maxDate, onlyShowInRangeDates, value]);

	if (state.today && !ref.current.isReady) ref.current.isReady = true;

	useEffect(() => {
		if (ref.current.isReady && ref.current.mustCallOnReady && onReady instanceof Function) {
			ref.current.mustCallOnReady = false;

			onReady();
		}
	}, [ref.current.isReady, onReady]);

	let globalProps = {
			value,
			state,
			setState,
			onChange: handleChange,
			sort,
			handleFocusedDate,
			monthAndYears: getMonthsAndYears(),
			rangeHover,
		},
		{ datePickerProps, DatePicker, ...calendarProps } = (...args) => args[0];

	return (
		state.today && (
			<section className='flex flex-col justify-center'>
				<div
					// rmdp-wrapper
					ref={setRef}
					className={`${calendarStyle} rmdp-calendar flex h-auto w-full flex-col p-1`}>
					<section>
						<CalendarIcon />
					</section>

					<Header {...globalProps} />

					<DayPicker
						{...globalProps}
						mapDays={mapDays}
						onlyShowInRangeDates={onlyShowInRangeDates}
						customWeekDays={weekDays}
						numberOfMonths={numberOfMonths}
						weekStartDayIndex={weekStartDayIndex}
						hideWeekDays={hideWeekDays}
						oneDaySelectStyle={oneDaySelectStyle}
						// dayStyles={dayStyles}
						allDayStyles={allDayStyles}
						todayStyle={todayStyle}
						rangeDateStyle={rangeDateStyle}
						startRangeDayStyle={startRangeDayStyle}
						endRangeDayStyle={endRangeDayStyle}
					/>
					{children}
				</div>
			</section>
		)
	);

	function handleChange(selectedDate, state) {
		if (disabled) return;
		//This one must be done before setState
		if (selectedDate || selectedDate === null) {
			if (listeners.change) listeners.change.forEach((callback) => callback(selectedDate));
		}

		if (state) setState(state);
		if (selectedDate || selectedDate === null) onChange?.(selectedDate);

		handlePropsChange({ value: selectedDate });
	}

	function handlePropsChange(props = {}) {
		if (disabled) return;

		let allProps = {
			...calendarProps,
			...datePickerProps,
			...props,
			value: props.value ?? state.selectedDate,
		};

		delete allProps.onPropsChange;

		onPropsChange?.(allProps);
	}

	function handleFocusedDate(focused, clicked) {
		if (disabled) return;

		onFocusedDateChange?.(focused, clicked);
	}

	function handleMonthChange(date) {
		onMonthChange?.(date);
	}

	function registerListener(event, callback) {
		if (!listeners[event]) listeners[event] = [];

		listeners[event].push(callback);
	}

	function setRef(element) {
		if (element) {
			element.date = state.date;

			element.set = function (key, value) {
				if (disabled) return;

				setState({
					...state,
					date: new DateObject(state.date.set(key, value)),
				});
			};
		}

		ref.current.Calendar = element;

		if (outerRef instanceof Function) return outerRef(element);
		if (outerRef) outerRef.current = element;
	}

	function getMonthsAndYears() {
		let date = state.date;

		if (!date) return [];

		let monthNames = [],
			years = [],
			digits = date.digits;

		for (let monthIndex = 0; monthIndex < numberOfMonths; monthIndex++) {
			let monthName,
				year = date.year,
				index = date.monthIndex + monthIndex;

			if (index > 11) {
				index -= 12;
				year++;
			}

			if (isArray(months) && months.length >= 12) {
				let month = months[index];

				monthName = isArray(month) ? month[0] : month;
			} else {
				monthName = date.months[index].name;
			}

			year = toLocaleDigits(year.toString(), digits);

			monthNames.push(monthName);
			years.push(year);
		}

		return [monthNames, years];
	}
}

export default forwardRef(Calendar);

function getDateInRangeOfMinAndMaxDate(date, minDate, maxDate, calendar) {
	if (minDate)
		minDate = toDateObject(minDate, calendar).set({
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0,
		});
	if (maxDate)
		maxDate = toDateObject(maxDate, calendar).set({
			hour: 23,
			minute: 59,
			second: 59,
			millisecond: 999,
		});

	if (isArray(date)) {
		date = date.filter((dateObject) => {
			if (minDate && dateObject < minDate) return false;
			if (maxDate && dateObject > maxDate) return false;

			return true;
		});
	}

	return [date, minDate, maxDate];
}

function getSelectedDate(value, calendar, locale, format) {
	let selectedDate = []
		.concat(value)
		.map((date) => {
			if (!date) return {};
			if (date instanceof DateObject) return date;

			return new DateObject({ date, calendar, locale, format });
		})
		.filter((date) => date.isValid);

	return isArray(value) ? selectedDate : selectedDate[0];
}
