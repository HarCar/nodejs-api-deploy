import config from "./config";
import ShowDangerAlert from "./CustomComponents/ShowDangerAlert.jsx";
import ShowInfoAlert from "./CustomComponents/ShowInfoAlert.jsx";
import Load from './CustomComponents/Load.jsx'

const FetchPOST = async ({ screen, body, urlParameters }) => {
    Load(true)
    try {
        const response = await fetch(`${config.baseApiURL}${screen}${urlParameters}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': localStorage.i18nextLng
            },
            body: body
        });

        if (!response.ok) {
            const customResponse = await response.json()
            throw new Error(customResponse.message);
        }

        Load(false)
        const customResponse = await response.json();
        if (screen === 'SignIn') {
            localStorage.token = customResponse.token
        }
        if (customResponse.message !== undefined && customResponse.message.length !== 0) {
            ShowInfoAlert({ error: '', errorDetail: customResponse.message })
        }
        if (customResponse.redirect) {
            location.href = customResponse.url
        }
        return customResponse.data
    } catch (error) {
        Load(false)

        let errorMessage = 'Ha ocurrido un error';
        let errorDetail = '';

        // Manejo de errores de red
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
            errorMessage = 'Error de red';
            errorDetail = 'No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.';
        } else if (error.message) {
            // Manejo de errores HTTP o errores personalizados
            errorMessage = 'Error en la solicitud';
            errorDetail = error.message;
        }

        ShowDangerAlert({ error: errorMessage, errorDetail })
        return null
    }
}

export default FetchPOST