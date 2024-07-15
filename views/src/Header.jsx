import MenuTheme from './CustomComponents/MenuTheme';
import MenuLanguage from './CustomComponents/MenuLanguage';
import MenuUserLoged from './CustomComponents/MenuUserLoged';
import MainMenu from './CustomComponents/MainMenu'
import { useData } from './DataContext';

const Header = () => {
    console.log('Header')
    const dataScreen = useData()
    document.documentElement.lang = localStorage.i18nextLng;

    return (

        <>{dataScreen && (
            <header className="flex fixed justify-between items-center w-full sm:px-4 lg:max-w-7xl h-20 backdrop-blur-md z-10" >
                <div className='flex items-center gap-20'>
                    <img width={110} src='/logo.png' alt='ISAV' />
                    {dataScreen?.actions && (
                        <MainMenu actions={dataScreen.actions} />
                    )}
                </div>

                <div className="flex items-center gap-3">

                    {dataScreen?.sessionData && (
                        <MenuUserLoged sessionData={{ ...dataScreen.sessionData }} />
                    )}

                    <MenuLanguage />

                    <MenuTheme />

                </div>
            </header >
        )}</>

    )
}


export default Header