import React from 'react'
import {Routes,Route} from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  return (
    <>
    <ToastContainer/>

   
    <Routes>
       {/* main route */}
      <Route path='/' element={<LandingPage/>}/>

      {/* other routes */}
    </Routes>
    </>
  )
}

export default App