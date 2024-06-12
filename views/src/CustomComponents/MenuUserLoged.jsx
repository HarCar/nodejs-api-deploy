import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import FetchPOST from '../FetchPOST.jsx'
import { SvgIconsSignOut, SvgIconsChangeCircleOutline, SvgIconsPhUser } from './SvgIcons'

const MenuUserLoged = (props) => {
  const sessionData = props.sessionData
  const { t } = useTranslation();
  const [isVisibleMenuUser, setIsVisibleMenuUser] = useState(false);
  const menuUserRef = useRef(null);
  const buttonOpenMenuUserRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuUserRef.current && !menuUserRef.current.contains(event.target) &&
        buttonOpenMenuUserRef.current && !buttonOpenMenuUserRef.current.contains(event.target)
      ) {
        setIsVisibleMenuUser(false); // Oculta el nav
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
      <button
        ref={buttonOpenMenuUserRef}
        onClick={() => { setIsVisibleMenuUser(!isVisibleMenuUser); }}
        className="flex items-center justify-between gap-1.5 w-full py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent">

        <SvgIconsPhUser />

        {sessionData.email}
        <svg className="w-2.5 mt-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
      {isVisibleMenuUser && (
        <div ref={menuUserRef}
          className="w-full absolute inset-x-auto translate-y-1 z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
            <li>
              <a href="/Authentication/SelectUsersGroups" className="flex items-center gap-x-1.5 block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                <SvgIconsChangeCircleOutline />
                {t('security.changeUserGroup')}
              </a>
            </li>
          </ul>
          <div className="py-1">
            <button onClick={async () => {
              await FetchPOST({
                screen: 'SignOut',
                urlParameters: ''
              });
            }} className="flex w-full items-center gap-x-1.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
              <SvgIconsSignOut />
              {t('security.signOut')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuUserLoged