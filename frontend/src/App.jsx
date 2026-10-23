import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import VikramLandingPage from "./pages/VikramLandingPage"

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<VikramLandingPage/>} />
      </Routes>
    </>
  )
}

export default App
