import { useState } from 'react';

import DatePicker from './components/DatePicker/DatePicker';
import Calendar from './components/Calendar/Calendar';
import Modal from './Modal';

const App = () => {
	const [value, setValue] = useState({
		startDate: new Date(),
		endDate: new Date(),
	});

	const buttons = [
		'5 دقیقه اخیر',
		'15 دقیقه اخیر',
		'نیم ساعت اخیر',
		'یک ساعت اخیر',
		'دو ساعت اخیر',
		'یک روز اخیر',
		'بازه دلخواه',
	];

	return (
		<div
			dir='rtl'
			className='flex h-screen w-full flex-col items-center justify-center bg- font-iranyekan'>
			<section className='rounded-xl bg-white px-6 py-2'>
				<Modal value={value} setValue={setValue} />

				<section className='flex items-start justify-between gap-5'>
					<div className='flex flex-col'>
						{/* <Calendar
							value={value}
							onChange={setValue}
							range
							rangeHover
							numberOfMonths={2}
							calendar={persian}
							locale={persian_fa}
							maxDate={new Date()}
							calendarStyle='w-auto h-auto flex justify-between items-center rounded-md text-center'
							allDayStyles='w-12 h-12 flex justify-center items-center cursor-pointer text-black'
							todayStyle='text-primary'
							oneDaySelectStyle='text-black bg- rounde '
							rangeDateStyle='bg-sky-200'
							startRangeDayStyle='bg-primary text- rounded-r-md'
							// startRangeDayStyle='rounded-r-md'
							endRangeDayStyle='bg-primary '
							// endRangeDayStyle='rounded-l-md'
							// endRangeDayStyle='bg-primary'
						/> */}
					</div>

				</section>
			</section>
		</div>
	);
};

export default App;
