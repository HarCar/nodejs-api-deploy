import { useState, useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client';
import { useTranslation } from 'react-i18next';

const container = document.getElementById('alertInfo');
const root = createRoot(container);


const InfoAlert = (props) => {
    const openDangerAlertRef = useRef(null);
    const { t } = useTranslation()
    const [isVisible, setIsVisible] = useState(props.visible);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDangerAlertRef.current && !openDangerAlertRef.current.contains(event.target)
            ) {
                setIsVisible(false);
            }
        };

        // Agrega el evento de clic al documento
        document.addEventListener('mousedown', handleClickOutside);

        // Limpia el evento cuando el componente se desmonta
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);



    useEffect(() => {
        setIsVisible(props.visible);
    }, [counter]);

    return (
        <>
            {isVisible && (
                <div
                    ref={openDangerAlertRef}
                    className="fixed top-0.5 left-1/2 z-50 translate-x-[-50%] p-4 mb-4 text-blue-800 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:border-blue-800" role="alert"
                >
                    <div className="flex items-center">
                        <svg className="flex-shrink-0 w-4 h-4 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                        </svg>
                        <span className="sr-only">Info</span>
                        <h3 className="text-lg font-medium">{props.error === '' ? t('security.thisIsAInfoAlert') : props.error}</h3>
                    </div>
                    <div className="mt-2 mb-4 text-sm">{props.errorDetail}</div>
                    <div className="flex">
                        <button
                            onClick={() => { setIsVisible(false) }}
                            type="button"
                            className="text-white bg-blue-800 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            {t('actions.close')}
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

let counter = 0;

const ShowInfoAlert = ({ error, errorDetail, visible = true }) => {
    counter++;
    root.render(<InfoAlert visible={visible} error={error} errorDetail={errorDetail} counter={counter} />);
}
ShowInfoAlert({ error: '', errorDetail: '', visible: false })

export default ShowInfoAlert