import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const MenuLanguage = () => {
  const { t, i18n } = useTranslation();

  const [isVisibleMenuLanguage, setIsVisibleMenuLanguage] = useState(false);
  const menuLanguageChangeRef = useRef(null);
  const buttonOpenMenuLanguageChangeRef = useRef(null);

  const languageChange = (language) => {
    i18n.changeLanguage(language);
    setIsVisibleMenuLanguage(false);
    document.documentElement.lang = language;
    location.reload(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuLanguageChangeRef.current && !menuLanguageChangeRef.current.contains(event.target) &&
        buttonOpenMenuLanguageChangeRef.current && !buttonOpenMenuLanguageChangeRef.current.contains(event.target)) {
        setIsVisibleMenuLanguage(false);
      }
    };

    // Agrega el evento de clic al documento
    document.addEventListener('mousedown', handleClickOutside);

    // Limpia el evento cuando el componente se desmonta
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <svg
        ref={buttonOpenMenuLanguageChangeRef}
        onClick={() => { setIsVisibleMenuLanguage(!isVisibleMenuLanguage) }}
        className="cursor-pointer fill-none stroke-current h-7 w-7 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">
        <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802"></path>
      </svg>
      {isVisibleMenuLanguage && (
        <nav className="translate-x--21-px w-20 absolute inset-x-auto font-normal bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" ref={menuLanguageChangeRef}>
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-400" aria-labelledby="dropdownLargeButton">
            <li onClick={() => languageChange('es')}>
              <span href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{t('languages.spanish')}</span>
            </li>
            <li onClick={() => languageChange('en')}>
              <span href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{t('languages.english')}</span>
            </li>
          </ul>
        </nav>
      )}

    </div>
  );
};

export default MenuLanguage