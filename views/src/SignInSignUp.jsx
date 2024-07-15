import { useState, useEffect } from "react"
import { useTranslation } from 'react-i18next';
import FetchPOST from "./FetchPOST.jsx";

const SignInSignUp = () => {
    const [visibleWelcome, setVisibleWelcome] = new useState(true)
    const { t } = useTranslation();

    useEffect(() => {
        document.title = `${t('ISAV.list')} ${t('security.authentication')}`;
    }, [])

    return (

        <div className="w-full h-full flex flex-col justify-center items-center font-montserrat mb-8">
            <div className="bg-white rounded-[10px] shadow-[0_14px_28px_rgba(0,0,0,0.25),0_10px_10px_rgba(0,0,0,0.22)] relative overflow-hidden w-[768px] max-w-full min-h-[480px]">

                {/* Registrarse */}
                <div className={`absolute left-0 w-2/4 z-10 top-0 h-full transition ease-in-out delay-150 duration-[0.6s] ${!visibleWelcome ? 'translate-x-full' : ''}`}>
                    <form
                        id="form-sign-up"
                        className="bg-white flex items-center justify-center flex-col p-0 px-[50px] h-full text-center"
                    >
                        <h1 className="block text-3xl my-[0.67em] mx-0 font-bold isolate text-neutral-950">
                            {t('security.createAccount')}
                        </h1>
                        <input className="bg-gray-200 border-none p-3 mb-2 w-full py-1 px-2 text-neutral-800" name="name" type="text" placeholder={`${t('security.name')}`} />
                        <input className="bg-gray-200 border-none p-3 mb-2 w-full py-1 px-2 text-neutral-800" name="email" type="email" placeholder={`${t('security.email')}`} />
                        <input className="bg-gray-200 border-none p-3 mb-2 w-full py-1 px-2 text-neutral-800" name="password" type="password" placeholder={`${t('security.password')}`} />
                        <button
                            onClick={
                                async (e) => {
                                    e.preventDefault()

                                    const parameters = {}
                                    const formulario = document.getElementById("form-sign-up")
                                    const datosFormulario = new FormData(formulario)

                                    datosFormulario.forEach((valor, clave) => {
                                        parameters[clave] = valor
                                    })

                                    var response = await FetchPOST({ screen: 'SignUp', body: JSON.stringify(parameters), urlParameters: '' })
                                    if (response) {
                                        formulario.reset()
                                        setVisibleWelcome(true)
                                    }
                                }}
                            className="rounded-2xl border border-[#FF4B2B] bg-[#FF4B2B] text-white text-xs font-bold py-3 px-11 tracking-widest uppercase transition-transform duration-75 ease-in"
                        >
                            {`${t('security.signUp')}`}
                        </button>
                    </form>
                </div>

                {/* Ingresar */}

                <div className={`absolute left-0 w-2/4 ${!visibleWelcome ? 'z-11' : 'z-10'} top-0 h-full transition ease-in-out delay-150 duration-[0.6s] ${!visibleWelcome ? 'translate-x-full' : ''}`}>
                    <form
                        id="form-sign-in"
                        className="bg-white flex items-center justify-center flex-col p-0 px-[50px] h-full text-center"
                    >
                        <h1 className="block text-3xl my-[0.67em] mx-0 font-bold isolate text-neutral-950">{t('security.signIn')}</h1>
                        <input className="bg-gray-200 border-none p-3 mb-2 w-full py-1 px-2 text-neutral-800" name="email" type="email" placeholder={`${t('security.email')}`} />
                        <input className="bg-gray-200 border-none p-3 mb-2 w-full py-1 px-2 text-neutral-800" name="password" type="password" placeholder={`${t('security.password')}`} />
                        <a
                            className="cursor-pointer text-gray-800 text-base no-underline my-4"
                            onClick={
                                async (e) => {
                                    e.preventDefault()

                                    const parameters = {}
                                    const formulario = document.getElementById("form-sign-in")
                                    const datosFormulario = new FormData(formulario)

                                    datosFormulario.forEach((valor, clave) => {
                                        parameters[clave] = valor
                                    })

                                    var response = await FetchPOST({ screen: 'PasswordReset', body: JSON.stringify(parameters), urlParameters: '' })
                                    console.log(response)
                                }}
                        >
                            {`${t('security.forgotYourPassword')}`}
                        </a>
                        <button
                            className="rounded-2xl border border-[#FF4B2B] bg-[#FF4B2B] text-white text-xs font-bold py-3 px-11 tracking-widest uppercase transition-transform duration-75 ease-in"
                            onClick={
                                async (e) => {
                                    e.preventDefault()

                                    const parameters = {}
                                    const formulario = document.getElementById("form-sign-in")
                                    const datosFormulario = new FormData(formulario)

                                    datosFormulario.forEach((valor, clave) => {
                                        parameters[clave] = valor
                                    })

                                    var response = await FetchPOST({ screen: 'SignIn', body: JSON.stringify(parameters), urlParameters: '' })
                                    console.log(response)
                                }}
                        >
                            {t('security.signIn')}
                        </button>
                    </form>
                </div>

                <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-[0.6s] ease-in-out z-[100] ${!visibleWelcome ? 'translate-x-[-100%]' : ''}`}>
                    <div
                        className="h-full w-full bg-gradient-to-r from-[#FF4B2B] to-[#FF416C] bg-no-repeat bg-cover bg-[0_0] text-white relative"
                    >
                        {!visibleWelcome && (
                            <div className={`absolute top-0 right-0 transform translate-x-0 flex items-center justify-center flex-col px-10 text-center h-full w-full`}>
                                <h1 className="font-bold mb-0 block text-3xl leading-[1.67]">{t('security.welcomeBack')}</h1>
                                <p className="text-base font-thin leading-5 tracking-wide my-5">{t('security.personalInfo')}</p>
                                <button
                                    onClick={() => { setVisibleWelcome(!visibleWelcome) }}
                                    className="cursor-pointer bg-transparent border-[#FFFFFF] rounded-[20px] border-solid border-[1px] text-white font-bold text-[12px] uppercase tracking-[1px] transition-transform duration-[80ms] ease-in appearance-auto text-rendering-auto word-spacing-normal line-height-normal text-indent-[0px] text-shadow-none inline-block text-center align-items-flex-start cursor-default m-[0em] py-[12px] px-[45px]"
                                >
                                    {t('security.signIn')}
                                </button>
                            </div>
                        )}

                        {visibleWelcome && (
                            <div className={`absolute top-0 right-0 transform translate-x-0 flex items-center justify-center flex-col px-10 text-center h-full w-full`}>
                                <h1 className="font-bold mb-0 block text-3xl leading-[1.67]">{t('security.helloFriend')}</h1>
                                <p className="text-base font-thin leading-5 tracking-wide my-5">{t('security.startJourneyWithUs')}</p>
                                <button
                                    onClick={() => { setVisibleWelcome(!visibleWelcome) }}
                                    className="cursor-pointer bg-transparent border-[#FFFFFF] rounded-[20px] border-solid border-[1px] text-white font-bold text-[12px] uppercase tracking-[1px] transition-transform duration-[80ms] ease-in appearance-auto text-rendering-auto word-spacing-normal line-height-normal text-indent-[0px] text-shadow-none inline-block text-center align-items-flex-start cursor-default m-[0em] py-[12px] px-[45px]"
                                >
                                    {t('security.signUp')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <footer className="bg-zinc-900 text-white text-base fixed bottom-0 left-0 right-0 text-center z-[999] block">
                <p className="my-2.5 text-base font-thin leading-5 tracking-wide block">
                    © Copyright 2024
                    <a className="text-[#3c97bf] no-underline text-base my-4 cursor-pointer font-thin leading-5 tracking-wide" target="_blank" href="#"> ISAV solutions</a>
                </p>
            </footer>
        </div >
    )
}


export default SignInSignUp