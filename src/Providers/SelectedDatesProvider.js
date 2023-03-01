import { useState } from 'react';
import { useReducer, createContext, useContext, useEffect } from 'react';

const DatesContext = createContext();
const DatesContextDispatcher = createContext();

const initialState = {
	dates: { startDate: new Date(), endDate: new Date() },
};

const DatesProvider = ({ children }) => {
	// const [dates, dispatch] = useReducer(CardReducer, initialState);
	const [dates, setDates] = useState(initialState.dates);

	// useEffect(() => {
	// 	const userCart = JSON.parse(localStorage.getItem('cart')) || [];
	// 	setDates(userCart);
	// }, []);

	// useEffect(() => {
	// 	localStorage.setItem('cart', JSON.stringify(dates));
	// }, [dates]);

	return (
		<DatesContext.Provider value={dates}>
			<DatesContextDispatcher.Provider value={setDates}>
				{children}
			</DatesContextDispatcher.Provider>
		</DatesContext.Provider>
	);
};

export default DatesProvider;

export const useDates = () => useContext(DatesContext);
export const useCardActions = () => useContext(DatesContextDispatcher);
