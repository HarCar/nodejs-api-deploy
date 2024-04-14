import 'tailwindcss/tailwind.css';
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App'
import './index.css'
import Nav from './nav/Nav.jsx'
import {Create} from './cards/security/pages/create.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <Nav />
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<>Hola Home</>} />
      <Route path='/pages' element={ <Create />} />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
