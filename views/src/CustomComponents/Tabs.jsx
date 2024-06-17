import { useState } from 'react';
import Input from './Input'

const Tabs = ({ tabsFieldsProperties, firstTab }) => {
    const [activeTab, setActiveTab] = useState(firstTab.Name);
    const [formValues, setFormValues] = useState({});

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <>
            <div
                className="w-full sm:px-4 lg:max-w-7xl mb-4 border-b border-gray-200 dark:border-gray-700"
            >
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                    {
                        tabsFieldsProperties.map((fieldProperty) => {
                            return (
                                <li key={fieldProperty._id} className="me-2">
                                    <button
                                        className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === fieldProperty.Name ? 'text-blue-600 border-blue-600' : 'text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                                        onClick={() => handleTabClick(fieldProperty.Name)}
                                    >
                                        {fieldProperty.Caption}
                                    </button>
                                </li>
                            )
                        })
                    }


                    <li className="me-2" role="presentation">
                        <button
                            className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'Dashboard' ? 'text-blue-600 border-blue-600' : 'text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`}
                            onClick={() => handleTabClick('Dashboard')}
                        >
                            Dashboard
                        </button>
                    </li>

                </ul>
            </div>

            <div
                className="w-full sm:px-4 lg:max-w-7xl grid-cols-6 auto-rows-[64px] gap-4 my-4"
            >
                {tabsFieldsProperties.map((fieldProperty) => {
                    if (activeTab !== fieldProperty.Name)
                        return null

                    if (fieldProperty.Type === 'stringList') {
                        return (
                            <form
                                type={fieldProperty.Type}
                                name={fieldProperty.Name}
                                key={fieldProperty.Name}
                                className="grid relative gap-1 justify-between items-center w-full sm:px-4 lg:max-w-7xl grid-cols-6 auto-rows-[64px] gap-4 my-4"
                            >
                                {
                                    fieldProperty.DataSource.map((item, index) => {
                                        let value = item.Selected
                                        if (formValues[fieldProperty.Name]?.[item.Name]) {
                                            value = formValues[fieldProperty.Name]?.[item.Name]
                                        }

                                        const inputProperties = {
                                            Name: item.Name,
                                            Type: 'checkbox',
                                            Caption: item.Caption,
                                            Placeholder: '',
                                            Value: value.toString(),
                                            handleChange: (value) => {
                                                setFormValues(prevValues => ({
                                                    ...prevValues,
                                                    [fieldProperty.Name]: {
                                                        ...prevValues[fieldProperty.Name],
                                                        [item.Name]: value
                                                    }
                                                }));
                                            },
                                        }
                                        return (
                                            <Input key={index} properties={inputProperties} />
                                        )
                                    })
                                }
                            </form>

                        )
                    }
                })
                }

                {activeTab === 'Dashboard' && (
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            This is some placeholder content the <strong className="font-medium text-gray-800 dark:text-white">Dashboard tab's associated content</strong>.
                        </p>
                    </div>
                )}

            </div>

        </>
    );
};

export default Tabs;
