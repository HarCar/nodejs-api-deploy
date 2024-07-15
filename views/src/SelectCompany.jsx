import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react'
import FetchGET from './FetchGET.jsx';
import FetchPOST from './FetchPOST.jsx';
import DivideY from './CustomComponents/DivideY.jsx';

const Company = ({ id, name, country }) => {
  return (
    <button
      onClick={async () => {
        await FetchPOST({
          screen: `/SelectCompany/${id}`,
          urlParameters: ''
        });
      }}
      className="cursor-pointer flex flex-col p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 row-span-1 col-span-6 sm:col-span-3 lg:col-span-2 hover:bg-gray-100 hover:text-blue-700 dark:hover:text-white dark:hover:bg-gray-700">
      <svg viewBox="0 0 1024 1024" className="w-8 h-8 text-gray-500 dark:text-gray-400 mb-3" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path className='dark:fill-gray-400' d="M531.8 385v483.3h0.1V385h-0.1z" fill="#343535" />
        <path className='dark:fill-gray-400' d="M670.9 497.1h86v16h-86zM670.9 625.1h86v16h-86zM233.9 241.1h86v16h-86zM384 241.1h86v16h-86zM233.9 369h86v16h-86zM384 369h86v16h-86zM234 497.5h86v16h-86zM384 497.2h86v16h-86z" fill="#39393A" />
        <path d="M398.3 704.4c-11.9-11.9-28.4-19.3-46.5-19.3-36.2 0-65.8 29.6-65.8 65.8v117.4h20V750.9c0-12.2 4.8-23.6 13.5-32.3 8.7-8.7 20.2-13.5 32.3-13.5 12.2 0 23.6 4.8 32.3 13.5 8.7 8.7 13.5 20.2 13.5 32.3v117.4h20V750.9c0-18.1-7.4-34.5-19.3-46.5z" fill="#E73B37" />
        <path className='dark:fill-gray-400' d="M575.8 429v437.9h0.1V429h-0.1zM286.2 868.3h131.6-131.6z" fill="#343535" />
        <path className='dark:fill-gray-400' d="M896 868.3V385H575.9V111.6H128v756.7H64v44h896v-44h-64z m-364.1 0H172V155.6h359.9v712.7z m320.1-1.5H575.8V429H852v437.8z" fill="#39393A" />
      </svg>
      <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{name}</h5>
      <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">{country}</p>
    </button>
  );
};

const SelectCompany = () => {
  const { t } = useTranslation();

  const [fieldsProperties, setFieldsProperties] = useState(null);

  let loadingFieldsProperties = false
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await FetchGET({
          screen: 'Companies',
          urlParameters: ''
        });
        setFieldsProperties(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (!loadingFieldsProperties)
      fetchData()

    loadingFieldsProperties = true

  }, []);

  return (
    <>
      <div
        className="flex relative gap-1 items-center w-full sm:px-4 lg:max-w-7xl mt-20">
        <a href='/Companies/Create'
          className="py-1.5 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
          {t('actions.create')}
        </a>
      </div>

      <DivideY />

      <div
        className="grid relative gap-1 justify-between items-center w-full sm:px-4 lg:max-w-7xl grid-cols-6 auto-rows-[172px] gap-4">
        {fieldsProperties && (
          fieldsProperties.map((company) => (
            <Company key={company._id} id={company.CompanyID} name={company.CompanyName} country={company.CountryName} />
          ))
        )}
      </div>
    </>
  )
}

export default SelectCompany