import 'tailwindcss/tailwind.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SelectCompany from './SelectCompany.jsx'
import Create from './Create.jsx'
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import Header from './Header.jsx'
import List from './List.jsx'
import SignInSignUp from './SignInSignUp.jsx'
import HeaderAuthentication from './HeaderAuthentication.jsx'
import { DataProvider } from './DataContext';
import './fetch-interceptor.js'; // Importa la configuración del interceptor

const Home = () => <div>Home</div>;
const NotFound = () => <div>NotFound...</div>;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>

        <Routes>
          {/* Rutas que no necesitan DataProvider */}
          <Route path='/Authentication' element={<><HeaderAuthentication /><SignInSignUp /></>} />
          <Route path='/SelectCompany' element={<SelectCompany />} />
          <Route path='/SelectUsersGroups' element={<div>Select group</div>} />

          {/* Rutas que necesitan DataProvider */}
          <Route path='/*' element={
            <DataProvider>
              <Header />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/:screen/Create/' element={<Create />} />
                <Route path='/:screen/Create/:ID' element={<><Create /> </>} />
                <Route path='/:screen/' element={<List />} />
              </Routes>
            </DataProvider>
          } />

          {/* Ruta de fallback para manejar no encontradas */}
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </I18nextProvider>
  </React.StrictMode>
)
