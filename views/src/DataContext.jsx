import React, { createContext, useContext, useEffect, useState } from 'react';
import FetchGET from './FetchGET.jsx';
import { useParams } from 'react-router-dom';
const DataContext = createContext();

export const DataProvider = ({ children }) => {
    console.log('DataProvider')
    const params = useParams();
    const screen = params["*"] ? params["*"].split('/')[0] : null;
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await FetchGET({
                screen,
                urlParameters: '/DataScreen',
                useApi: false
            });

            setData(response)
        };

        fetchData();
    }, [screen]);


    return (
        <DataContext.Provider value={data}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    return useContext(DataContext);
};