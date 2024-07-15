import MenuLanguage from './CustomComponents/MenuLanguage.jsx';
import MenuTheme from './CustomComponents/MenuTheme.jsx';

const HeaderAuthentication = () => {
    document.documentElement.lang = localStorage.i18nextLng;
    console.log('HeaderAuthentication')

    return (
        <header className="flex fixed justify-between items-center w-full sm:px-4 lg:max-w-7xl h-20 backdrop-blur-md z-10" >
            <div className='flex items-center gap-20'>
                <img width={110} src='/logo.png' alt='ISAV' />
            </div>

            <div className="flex items-center gap-3">
                <MenuLanguage />
                <MenuTheme />
            </div>
        </header >
    )
}


export default HeaderAuthentication