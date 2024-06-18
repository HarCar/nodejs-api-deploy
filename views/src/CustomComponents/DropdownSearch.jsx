import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react';

const DropdownSearch = ({ properties }) => {
  const [visibleDropdownList, setVisibleDropdownList] = useState(false)
  const [dropdownItems, setDropdownItems] = useState(properties.DataSource); // Estado para almacenar los elementos de la lista
  const [textValue, setTextValue] = useState(properties.textValue ?? '')
  const [value, setValue] = useState(properties.Value ?? '')

  const buttonDropdownSearchRef = useRef(null);
  const dropdownListRef = useRef(null);

  const handledItemSelected = (value, text) => {
    setTextValue(text)
    setValue(value)
    setVisibleDropdownList(false)
  }

  const handledDropdownSearch = (event) => {
    event.preventDefault()
    setVisibleDropdownList(!visibleDropdownList)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonDropdownSearchRef.current && !buttonDropdownSearchRef.current.contains(event.target) &&
        dropdownListRef.current && !dropdownListRef.current.contains(event.target)) {
        setVisibleDropdownList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [buttonDropdownSearchRef, dropdownListRef]);

  const fetchDropdownItems = async (searchText) => {
    try {
      const filtereddata = properties.DataSource.filter(map => map.Caption_en.toLowerCase().includes(searchText.toLowerCase()) || map.Caption_es.toLowerCase().includes(searchText.toLowerCase()));
      setDropdownItems(filtereddata)
    } catch (error) {
      console.error('Error fetching dropdown items:', error);
    }
  };


  return (

    <div className='relative col-span-3 sm:col-span-2 lg:col-span-1'>
      <label className="block cursor-pointer text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-500"><a target="_blank" href={`/${properties.Source}`}>{properties.Caption}</a></label>
      <div className='relative'>
        <input hidden name={`${properties.Name}`} defaultValue={value}></input>
        <input
          toview={'true'}
          name={`${properties.Name.replace('ID', 'Name')}`}
          className="mh-input p-2.5 pr-8 w-full text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          type="text"
          placeholder={`${properties.Placeholder === undefined ? '' : properties.Placeholder}`}
          onChange={(event) => {
            setTextValue(event.target.value);
            fetchDropdownItems(event.target.value)
          }}
          value={textValue}
          onFocusCapture={handledDropdownSearch}
          ref={buttonDropdownSearchRef}
          required />
        <svg className="w-3 absolute right-3	top-0	translate-y-3.5"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"
        >
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>

      </div>

      {visibleDropdownList && (
        <div
          ref={dropdownListRef}
          className="absolute inset-x-auto translate-y-1.5 w-full	z-10 bg-white rounded-lg shadow w-60 dark:bg-gray-700 absolute ">
          <ul className="h-48 overflow-y-auto py-2 text-sm text-gray-700 dark:text-gray-400">
            {dropdownItems.map(item => (
              <li
                key={item._id}
                onClick={() => {
                  const name = item.Caption !== undefined ? item.Caption : item.Name
                  handledItemSelected(item._id, name)
                }}
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                {item.Caption !== undefined ? item.Caption : item.Name}
              </li>
            ))}
          </ul>
        </div>
      )
      }
    </div >

  );
};

DropdownSearch.propTypes = {
  properties: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Type: PropTypes.string.isRequired,
    Caption: PropTypes.string.isRequired,
    Placeholder: PropTypes.string,
    Value: PropTypes.string,
    TextValue: PropTypes.string,
    handleChange: PropTypes.func,
    Source: PropTypes.string.isRequired,
  }).isRequired
}

export default DropdownSearch