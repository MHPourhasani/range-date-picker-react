import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

// icons
import { ReactComponent as CloseBtn } from './assets/svg/close.svg';

import Calendar from './components/Calendar/Calendar';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import DatesProvider, { useDates } from './Providers/SelectedDatesProvider';

// icons
import { ReactComponent as CalendarIcon } from './assets/svg/calendar.svg';
import { ReactComponent as ArrowDownBtn } from './assets/svg/arrow-down-button.svg';

const buttons = [
	// { title: '5 دقیقه اخیر', onClick:  },
	'15 دقیقه اخیر',
	'نیم ساعت اخیر',
	'یک ساعت اخیر',
	'دو ساعت اخیر',
	'یک روز اخیر',
	'بازه دلخواه',
];

const Modal = ({ value, setValue }) => {
	let [isOpen, setIsOpen] = useState(false),
		calendar = persian,
		locale = persian_fa;

	// const { dates } = useDates();

	const closeModal = () => {
		setIsOpen(false);
	};

	const openModal = () => {
		setIsOpen(true);
	};

	return (
		<DatesProvider>
			<div className='flex items-center justify-center'>
				<button
					type='button'
					// value={dates.startDate}
					onClick={openModal}
					className='flex h-12 w-[198px] items-center justify-center gap-2 rounded-xl border-1 text-16 font-medium focus:outline-none'>
					<CalendarIcon />
					<span>بازه دلخواه</span>
					<ArrowDownBtn />
				</button>
			</div>

			<Transition appear show={isOpen} as={Fragment}>
				<Dialog
					as='div'
					className='relative z-10 w-full font-iranyekan'
					onClose={closeModal}>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'>
						<div className='fixed inset-0 bg-secondary900 bg-opacity-60' />
					</Transition.Child>

					<div className='fixed inset-0'>
						<div className='flex items-center justify-center p-4 text-center'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-300'
								enterFrom='opacity-0 scale-95'
								enterTo='opacity-100 scale-100'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100'
								leaveTo='opacity-0 scale-95'>
								<Dialog.Panel
									dir='rtl'
									className='shadow-xl flex w-9/12 flex-col gap-14 rounded-2xl bg-white p-6 transition-all'>
									<div className='flex w-full items-center justify-between'>
										<span className='text-18 font-bold text-secondary800'>
											انتخاب بازه زمانی
										</span>
										<CloseBtn
											onClick={closeModal}
											className='cursor-pointer text-secondary400'
										/>
									</div>

									<section className='flex items-start justify-between'>
										<Calendar
											value={value}
											onChange={setValue}
											locale={locale}
											calendar={calendar}
											rangeHover
											numberOfMonths={2}
											maxDate={new Date()}
											calendarStyle='w-auto h-auto flex justify-between items-center rounded-md text-center'
											allDayStyles='w-12 h-12 flex justify-center items-center cursor-pointer text-black'
											todayStyle='text-primary'
											oneDaySelectStyle='text-black bg- rounde '
											rangeDateStyle='bg-sky-200'
											startRangeDayStyle='bg-primary text- rounded-r-md'
											endRangeDayStyle='bg-primary '
										/>

										<div>
											<span className='flex flex-col gap-3 text-14'>
												{buttons.map((button, index) => (
													<button
														key={index}
														className='w-44 rounded-[5px] border-1 border-secondary300 py-2 text-secondary800 hover:border-primary'>
														{button}
													</button>
												))}
											</span>

											<button
												onClick={closeModal}
												className='mt-7 w-44 rounded-[5px] bg-secondary800 py-3 font-medium text-white ease-in hover:bg-secondary900'>
												اعمال
											</button>
										</div>
									</section>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition>
		</DatesProvider>
	);
};

export default Modal;
