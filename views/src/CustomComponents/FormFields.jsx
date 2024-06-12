import DropdownSearch from './DropdownSearch';
import Tabs from './Tabs';
import Input from './Input';
import SimpleSelect from './SimpleSelect';
const FormFields = (props) => {
    const { formFields } = props

    return (
        <>
            <form
                name='header'
                className="grid relative gap-1 justify-between items-center w-full sm:px-4 lg:max-w-7xl grid-cols-6 auto-rows-[64px] gap-4 my-4"
            >
                {formFields && (
                    formFields.map((fieldProperty) => {
                        if (fieldProperty.CustomComponent === 'ListSelect') {
                            return null; // Excluir este componente
                        }
                        switch (fieldProperty.CustomComponent) {
                            case 'Input':
                                return (
                                    <Input key={fieldProperty._id} properties={{ ...fieldProperty }} />
                                );
                            case 'DropdownSearch':
                                return (
                                    <DropdownSearch key={fieldProperty._id} properties={{ ...fieldProperty }} />
                                );
                            case 'SimpleSelect':
                                return (
                                    <SimpleSelect key={fieldProperty._id} properties={{ ...fieldProperty }} />
                                );
                            default:
                                return null; // Manejo por defecto para otros tipos
                        }
                    })
                )}
            </form>
            {formFields && formFields.some(field => field.CustomComponent === 'ListSelect') && (

                <Tabs
                    tabsFieldsProperties={formFields.filter(field => field.CustomComponent === 'ListSelect')}
                    firstTab={formFields.find(field => field.CustomComponent === 'ListSelect')}
                />

            )}

        </>
    );
};

export default FormFields;
