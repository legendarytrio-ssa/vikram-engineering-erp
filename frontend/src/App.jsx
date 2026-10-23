import { useState } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import VikramLandingPage from "./pages/VikramLandingPage"
import { AddTenderPage, HomePage } from './components/landing/MinimalLandingPage'
import AllClientsForm from './pages/AllClientsForm'

function App() {

  return (
    <>
      <Routes>
        {/* <Route path='/' element={<VikramLandingPage/>} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/tenders/new" element={<AddTenderPage />} />
        <Route path="/clients/new" element={<AllClientsForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
