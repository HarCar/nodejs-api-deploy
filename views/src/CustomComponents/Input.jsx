import PropTypes from 'prop-types'
import { useState } from 'react';

const Input = ({ properties }) => {
  const [checked, setChecked] = new useState(properties.Type === 'checkbox' ? properties.Value === 'true' : undefined)
  return (
    <div className='col-span-3 sm:col-span-2 lg:col-span-1'>
      <label className="block text-sm font-medium text-gray-900 dark:text-white">{properties.Caption}</label>
      <input
        name={`${properties.Name}`}
        className="mh-input p-2.5 w-full text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        type={`${properties.Type}`}
        placeholder={`${properties.Placeholder === undefined ? '' : properties.Placeholder}`}
        onChange={(event) => {
          if (properties.Type === 'checkbox')
            setChecked(event.target.checked)
          if (typeof properties.handleChange === 'function')
            properties.handleChange(properties.Type === 'checkbox' ? event.target.checked.toString() : event.target.value)
        }}
        checked={checked}
        defaultValue={properties.Type !== 'checkbox' ? properties.Value : undefined}

        required />
    </div>
  );
};

Input.propTypes = {
  properties: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Type: PropTypes.string.isRequired,
    Caption: PropTypes.string.isRequired,
    Placeholder: PropTypes.string,
    Value: PropTypes.string,
    handleChange: PropTypes.func,
  }).isRequired
}

export default Input