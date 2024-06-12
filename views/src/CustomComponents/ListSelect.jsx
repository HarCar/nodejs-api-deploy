import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import global from '../Global.jsx'
import DivideY from './DivideY.jsx';
import Save from '../Save.jsx';
import FetchGET from '../FetchGET.jsx';

const ListSelect = () => {
  const { screen, ID } = useParams();

  global.setScreen(screen)
  const { t } = useTranslation();

  const [fieldsProperties, setFieldsProperties] = useState(null);

  let loadingFieldsProperties = false
  useEffect(() => {
    const fetchData = async () => {
      loadingFieldsProperties = true
      try {
        const data = await FetchGET({
          screen: 'FieldsProperties',
          urlParameters: `?Screen=${global.getScreen()}`
        });
        setFieldsProperties(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (!loadingFieldsProperties)
      fetchData()

  }, []);

  return (
    <>
      <div
        className="flex relative gap-1 items-center w-full sm:px-4 lg:max-w-7xl mt-20">
        <button onClick={Save}
          className="py-1.5 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
          {t('actions.save')}
        </button>
      </div>

      <DivideY />
      <input type='text'></input>

    </>
  )
}

export default ListSelect