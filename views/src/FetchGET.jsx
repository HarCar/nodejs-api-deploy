import config from "./config";
import ShowDangerAlert from "./CustomComponents/ShowDangerAlert.jsx";
import Load from './CustomComponents/Load.jsx'

const FetchGET = async ({ screen, urlParameters, useApi = true }) => {
    Load(true)

    try {
        const baseUrl = useApi ? config.baseApiURL : config.baseFrontendURL
        const header = {
            'Content-Type': 'application/json',
            'Accept-Language': localStorage.i18nextLng,
        }
        if (localStorage.token !== undefined && localStorage.token !== null) {
            header['Authorization'] = `Bearer ${localStorage.token}`
        }

        const response = await fetch(`${baseUrl}${screen}${urlParameters}`, {
            method: 'GET',
            headers: header
        });

        if (!response.ok) {
            const customResponse = await response.json()
            throw new Error(customResponse.message);
        }

        const customResponse = await response.json()
        if (customResponse.redirect) {
            location.href = customResponse.url
        }

        Load(false)
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

export default FetchGET