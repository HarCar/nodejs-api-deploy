import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import global from './Global.jsx'
import DivideY from './CustomComponents/DivideY.jsx';
import Save from './Save.jsx';
import FormFields from './CustomComponents/FormFields.jsx';
import { SelectSvgIcon } from './CustomComponents/SelectSvgIcon.jsx'
import { useData } from './DataContext';
import { Link } from 'react-router-dom' // Importa Link

const Create = () => {
  const dataScreen = useData()
  const params = useParams();
  global.setScreen(params["*"] ? params["*"].split('/')[0] : null)

  if (dataScreen) {
    const actions = dataScreen.actions.filter(item => item.Name === screen);

    if (actions.length != 0) {
      global.setAction(actions[0])
    }
  }


  const { t } = useTranslation();

  return (
    <>
      {dataScreen && (
        <>
          <div
            className="flex flex-col relative gap-1 w-full sm:px-4 lg:max-w-7xl mt-20"
          >
            <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-gray-400 sm:truncate sm:text-3xl sm:tracking-tight">
              {
                global.getAction() === null ? global.getScreen() : global.getAction().Caption
              }
            </h2>

            <div className='flex relative gap-1 items-center w-full'>
              <button onClick={Save}
                className="flex items-center gap-1 py-1.5 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <SelectSvgIcon name="Save" />
                {t('actions.save')}
              </button>
              <Link to={`/${global.getScreen()}`}
                className="flex items-center gap-1 py-1.5 px-3 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                <SelectSvgIcon name="List" />
                {t('actions.list')}
              </Link>
            </div>
          </div>

          <DivideY />

          <FormFields formFields={dataScreen.formFields} />

        </>

      )}
    </>
  )
}

export default Create