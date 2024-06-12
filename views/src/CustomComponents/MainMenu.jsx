import { useState, useEffect, useRef } from 'react'
import { SelectSvgIcon } from './SelectSvgIcon.jsx'
import { Link } from 'react-router-dom' // Importa Link

const MainMenu = (props) => {
  const { actions } = props

  const [openSectionID, setOpenSectionID] = useState('');
  const [openModuleID, setOpenModuleID] = useState('');
  const openSectionRef = useRef(null);
  const openModuleRef = useRef(null);


  const uniqueSections = new Set();
  const sections = actions.reduce((acc, section) => {
    if (!uniqueSections.has(section.SectionName)) {
      uniqueSections.add(section.SectionName);

      const uniqueModules = new Set();
      const modules = []
      props.actions.map((action) => {
        if (action.SectionID === section.SectionID && !uniqueModules.has(action.ModuleID)) {
          uniqueModules.add(action.ModuleID)
          modules.push({ ModuleID: action.ModuleID, ModuleName: action.ModuleName })
        }
      })

      acc.push({ SectionID: section.SectionID, SectionName: section.SectionName, Icon: section.Icon, modules });
    }
    return acc;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openSectionRef.current && !openSectionRef.current.contains(event.target)
        //&& buttonOpenopenSectionRef.current && !buttonOpenopenSectionRef.current.contains(event.target)
      ) {
        setOpenSectionID('');
        setOpenModuleID('')
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
    <nav>
      <ul
        ref={openSectionRef}
        className='flex gap-3'>
        {sections.map((section) => {
          return (
            <li key={section.SectionID} className='relative'>
              <button
                type="button"
                className="inline-flex flex-col items-center justify-center  group"
                onClick={() => {
                  if (openSectionID === section.SectionID)
                    setOpenSectionID('')
                  else
                    setOpenSectionID(section.SectionID)
                }}
              >
                <SelectSvgIcon name={section.Icon} />

                <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-500">{section.SectionName}</span>
              </button>
              {openSectionID === section.SectionID && section.modules.map((module) => {
                return (
                  <div
                    key={module.ModuleID}
                    className='w-auto min-w-[210px] absolute inset-x-auto translate-y-1 z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600'
                  >
                    <button
                      type="button"
                      className="flex items-center justify-between w-full px-4 py-2 font-medium rtl:text-right text-gray-500 rounded-t-xl dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                      onClick={() => {
                        if (openModuleID === module.ModuleID)
                          setOpenModuleID('')
                        else
                          setOpenModuleID(module.ModuleID)
                      }}
                    >
                      <span className="flex items-center">
                        {module.ModuleName}
                      </span>
                      <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" ariahidde="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                      </svg>
                    </button>
                    <div className='flex flex-col'>
                      {openModuleID === module.ModuleID && props.actions.map((action) => {
                        if (action.SectionID === section.SectionID && action.ModuleID === module.ModuleID)
                          return (

                            <Link to={`/${action.Name}`} // Cambia 'a' por 'Link'
                              key={action._id}
                              onClick={() => {
                                setOpenSectionID('')
                                setOpenModuleID('')
                              }}
                              className="cursor-pointer px-4 py-2 dark:bg-gray-900 text-gray-500 dark:text-gray-400 hover:text-blue-700">
                              {action.Caption}
                            </Link>
                          )
                      })}
                    </div>
                  </div>
                )
              })}
            </li>
          )
        })}

      </ul>
    </nav>
  );
};

export default MainMenu