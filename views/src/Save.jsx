import global from './Global.jsx'
import Load from './CustomComponents/Load.jsx'
import FetchPOST from './FetchPOST.jsx'
import { refFromURL } from 'firebase/database'

const Save = async (event) => {
    event.preventDefault()
    Load(true)

    const headerForm = document.getElementsByName('header')[0]
    const header = {};

    headerForm.querySelectorAll('input, select, textarea').forEach((input) => {
        if (input.type === 'checkbox') {
            header[input.name] = input.checked;
        } else if (input.type === 'number') {
            const value = parseFloat(input.value);
            header[input.name] = isNaN(value) ? 0 : value;
        }
        else if (input.getAttribute('toview') !== 'true') {
            header[input.name] = input.value;
        }
    });

    const otherForms = document.querySelectorAll('form:not([name="header"])');
    otherForms.forEach((form) => {
        let currentListObjet = []
        const type = form.getAttribute('type');
        form.querySelectorAll('input, select, textarea').forEach((input) => {
            if (type == 'stringList') {
                if (input.checked) {
                    currentListObjet.push(input.name)
                }
            }
        });
        const name = form.getAttribute('name');
        if (currentListObjet.length != 0)
            header[name] = currentListObjet

    })

    const data = await FetchPOST({
        screen: global.getScreen(),
        body: JSON.stringify(header),
        urlParameters: ''
    })

    Load(false)
}

export default Save