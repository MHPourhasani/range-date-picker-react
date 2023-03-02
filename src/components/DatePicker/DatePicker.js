import {
	useState,
	useEffect,
	useRef,
	useCallback,
	forwardRef,
	isValidElement,
	cloneElement,
} from 'react';
import ElementPopper from 'react-element-popper';
import DateObject from 'react-date-object';
import Calendar from '../Calendar/Calendar';
import getFormat from '../../utils/getFormat';
import isArray from '../../utils/isArray';
import check from '../../utils/check';
import toLocaleDigits from '../../common/toLocaleDigits';
import './DatePicker.css';

import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

function DatePicker(
	{
		value,
		format,
		onChange,
		name,
		required,
		className = '',
		inputClass,
		disabled,
		render,
		weekDays,
		months,
		children,
		inputMode,
		hideOnScroll,
		minDate,
		maxDate,
		containerClassName = '',
		calendarPosition = 'bottom-left',
		editable = true,
		onOpen,
		onClose,
		zIndex = 100,
		arrow = true,
		fixMainPosition,
		onPropsChange,
		digits,
		onFocusedDateChange,
		type,
		onOpenPickNewDate = true,
		...otherProps
	},
	outerRef
) {
	let [date, setDate] = useState(),
		[temporaryDate, setTemporaryDate] = useState(),
		[stringDate, setStringDate] = useState(''),
		[isVisible, setIsVisible] = useState(false),
		[isCalendarReady, setIsCalendarReady] = useState(false),
		datePickerRef = useRef(),
		inputRef = useRef(),
		calendarRef = useRef(),
		ref = useRef({}),
		datePickerProps = arguments[0],
		closeCalendar = useCallback(() => {
			if (onClose?.() === false) return;

			let input = getInput(inputRef);

			if (input) input.blur();

			if (ref.current.mobile) {
				let popper = calendarRef.current.parentNode.parentNode;

				popper.classList.remove('rmdp-calendar-container-mobile');
				popper.style.position = 'absolute';
				popper.style.visibility = 'hidden';
			}

			setIsVisible(false);
			setIsCalendarReady(false);
		}, [onClose]),
		range = true,
		buttons = [
			{
				onClick: () => {
					setTemporaryDate(undefined);
					closeCalendar();
				},
			},
			{
				onClick: () => {
					if (temporaryDate) {
						handleChange(temporaryDate, true);
						setTemporaryDate(undefined);
					}

					closeCalendar();
				},
			},
		],
		calendar = persian,
		locale = persian_fa;

	format = getFormat(format);

	[calendar, locale] = check(calendar, locale);

	useEffect(() => {
		function handleClickOutside(event) {
			if (!isVisible || ref.current.mobile) return;
			/**
			 * Due to the fact that by activating the portal mode,
			 * the calendar element is moved out of the date picker container,
			 * it is not possible to detect external clicks using the datePickerRef.
			 * Therefore, inputRef and calendarRef can be checked separately.
			 *
			 * If the clicked area is outside of both the input and calendar elements,
			 * the calendar should be closed.
			 */
			let outsideList = [];

			[inputRef.current, calendarRef.current].forEach((element) => {
				if (
					element &&
					!element.contains(event.target) &&
					!event.target.classList.contains('b-deselect')
				) {
					outsideList.push(element);
				}
			});

			if (outsideList.length === 2) return closeCalendar();

			if (calendarRef.current && calendarRef.current.contains(event.target)) {
				datePickerRef.current.removeTransition();
				datePickerRef.current.refreshPosition();
			}
		}

		function handleScroll() {
			if (hideOnScroll && isVisible) closeCalendar();
		}

		document.addEventListener('click', handleClickOutside, false);
		document.addEventListener('scroll', handleScroll, true);

		return () => {
			document.removeEventListener('click', handleClickOutside, false);
			document.removeEventListener('scroll', handleScroll, true);
		};
	}, [closeCalendar, outerRef, isVisible, hideOnScroll]);

	useEffect(() => {
		let date = value,
			{ date: refDate, initialValue } = ref.current,
			getLastDate = () => date[date.length - 1];

		function checkDate(date) {
			if (!date) return;
			if (!(date instanceof DateObject))
				date = new DateObject({ date, calendar, locale, format });

			if (date.calendar !== calendar) date.setCalendar(calendar);

			date.set({
				weekDays,
				months,
				digits,
				locale,
				format,
			});

			return date;
		}

		if (!value && !initialValue && refDate) {
			date = refDate;
		} else if (initialValue && !value) {
			initialValue = undefined;
		}

		if (range || isArray(date)) {
			if (!isArray(date)) date = [date];

			date = date.map(checkDate).filter((value) => value !== undefined);

			if (range && date.length > 2) date = [date[0], getLastDate()];

			setStringDate(getStringDate(date));
		} else {
			if (isArray(date)) date = getLastDate();

			date = checkDate(date);

			if (document.activeElement !== getInput(inputRef)) {
				setStringDate(date ? date.format() : '');
			}
		}

		ref.current = {
			...ref.current,
			date,
			initialValue: initialValue || value,
		};

		if (ref.current.mobile && datePickerRef.current.isOpen) {
			setTemporaryDate(date);
		} else {
			setDate(date);
		}
	}, [value, calendar, locale, format, range, weekDays, months, digits]);

	useEffect(() => {
		/**
		 * If the locale is non-English, after manually changing the input value,
		 * the caret position jumps to the end of the input.
		 * To solve this issue, we save the previous position of caret in the ref,
		 * and in this effect, we recover it.
		 */
		let { selection } = ref.current;

		if (!selection) return;
		/**
		 * If the caret position is undefined, there is no reason to get the input.
		 * So we only get the input if the caret position is available.
		 */
		let input = getInput(inputRef);

		if (!input) return;

		input.setSelectionRange(selection, selection);
		ref.current.selection = undefined;
		/**
		 * after manually changing the month by typing in the input,
		 * if the calendar position is in top of the input
		 * and the number of days in the new month is greater than the number of days in the previous month,
		 * the calendar will cover the input due to its larger size.
		 * To resolve this issue, we refresh the calendar position here.
		 */
		datePickerRef.current.refreshPosition();
	}, [stringDate]);

	if (range || isArray(date) || !editable) inputMode = 'none';

	return (
		<ElementPopper
			ref={setRef}
			element={renderInput()}
			popper={isVisible && renderCalendar()}
			active={isCalendarReady}
			position={calendarPosition}
			arrow={arrow}
			zIndex={zIndex}
			containerClassName={`rmdp-container ${containerClassName}`}
			className='w-[395px]'
			{...otherProps}
		/>
	);

	function setRef(element) {
		if (element) {
			element.openCalendar = () => setTimeout(() => openCalendar(), 10);
			element.closeCalendar = closeCalendar;
			element.isOpen = isVisible && isCalendarReady;
		}

		datePickerRef.current = element;

		// if (outerRef instanceof Function) return outerRef(element);
		// if (outerRef) outerRef.current = element;
	}

	function renderInput() {
		if (render) {
			let strDate = isArray(date) || range ? getStringDate(date) : stringDate;

			return (
				<div ref={inputRef}>
					{isValidElement(render)
						? cloneElement(render, {
								[range ? 'stringDates' : 'stringDate']: strDate,
								value: strDate,
								openCalendar,
								handleValueChange,
								locale,
						  })
						: render instanceof Function
						? render(strDate, openCalendar, handleValueChange, locale)
						: null}
				</div>
			);
		} else {
			return (
				<input
					ref={inputRef}
					type='text'
					name={name}
					required={required}
					onFocus={openCalendar}
					className={inputClass || 'rmdp-input'}
					value={stringDate}
					onChange={handleValueChange}
					disabled={disabled ? true : false}
					inputMode={inputMode}
				/>
			);
		}
	}

	function renderCalendar() {
		return (
			<Calendar
				ref={calendarRef}
				value={temporaryDate || date}
				onChange={handleChange}
				range={range}
				calendar={calendar}
				locale={locale}
				format={format}
				className={className}
				weekDays={weekDays}
				months={months}
				digits={digits}
				minDate={minDate}
				maxDate={maxDate}
				onReady={setCalendarReady}
				DatePicker={datePickerRef.current}
				datePickerProps={datePickerProps}
				onFocusedDateChange={handleFocusedDate}
				{...otherProps}>
				{children}
			</Calendar>
		);
	}

	function openCalendar() {
		if (disabled || onOpen?.() === false) return;

		if (mustPickNewDate()) {
			let date = new DateObject({
				calendar,
				locale,
				format,
				months,
				weekDays,
				digits,
			});

			if ((!minDate || date > minDate) && (!maxDate || date < maxDate)) {
				handleChange(date);
				onPropsChange?.({ ...datePickerProps, value: date });

				ref.current.date = date;
			}
		}

		let input = getInput(inputRef);

		if (input) input.blur();

		if (input || !isVisible) {
			setIsVisible(true);
		} else {
			closeCalendar();
		}
	}

	function mustPickNewDate() {
		return onOpenPickNewDate && !value && !ref.current.date && !range;
	}

	function handleChange(date, force) {
		if (!force) return setTemporaryDate(date);

		setDate(date);

		ref.current = { ...ref.current, date };

		onChange?.(date);

		if (date) setStringDate(getStringDate(date));
	}

	function handleValueChange(e) {
		if (isArray(date) || !editable) return;

		ref.current.selection = e.target.selectionStart;

		let value = e.target.value,
			object = {
				calendar,
				locale,
				format,
			};

		digits = isArray(digits) ? digits : locale.digits;

		if (!value) {
			setStringDate('');

			return handleChange(null);
		}

		if (!digits) return;
		//converting value to english digits
		for (let digit of digits) {
			value = value.replace(new RegExp(digit, 'g'), digits.indexOf(digit));
		}

		let newDate;
		/**
		 * Given that the only valid date is the date that has all three values ​​of the day, month, and year.
		 * To generate a new date, we must check whether the day, month, and year
		 * are defined in the format or not.
		 */
		if (/(?=.*Y)(?=.*M)(?=.*D)/.test(format)) {
			/**
			 * If the above condition is true,
			 * we generate a new date from the input value.
			 */
			newDate = new DateObject({
				...object,
				date: value,
			});
		} else {
			/**
			 * Otherwise, we generate today's date and replace the input value ​​with today's values.
			 * For example, if we are only using the TimePicker and the input value follows the format "HH:mm",
			 * if we generate a new date from the format "HH:mm", given that the values ​​of the day, month, and year
			 * do not exist in the input value, an invalid date will be generated.
			 * Therefore, it is better to generate today's date and replace only the hour and minute with today's values.
			 */
			newDate = new DateObject(object).parse(value);
		}

		handleChange(newDate.isValid ? newDate : null);
		setStringDate(toLocaleDigits(value, digits));
	}

	function setCalendarReady() {
		setIsCalendarReady(true);

		let popper = calendarRef.current.parentNode.parentNode;

		popper.className = 'rmdp-calendar-container-mobile';
		popper.style.position = 'fixed';
		popper.style.transform = '';

		setTimeout(() => {
			popper.style.visibility = 'visible';
		}, 50);
	}

	function handleFocusedDate(focusedDate, clickedDate) {
		if (!isArray(ref.current.date) && clickedDate) {
			closeCalendar();
		}

		onFocusedDateChange?.(focusedDate, clickedDate);
	}
}

export default forwardRef(DatePicker);

function getStringDate(date, separator) {
	let dates = [].concat(date).map(toString);

	dates.toString = function () {
		return this.filter(Boolean).join(separator);
	};

	return dates;

	function toString(date) {
		return date?.isValid ? date.format() : '';
	}
}

function getInput(inputRef) {
	if (!inputRef.current) return;

	return inputRef.current.tagName === 'INPUT'
		? inputRef.current
		: inputRef.current.querySelector('input');
}
