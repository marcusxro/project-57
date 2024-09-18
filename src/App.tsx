import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/AuthPages/Signup';
import LogIn from './pages/AuthPages/LogIn';
import TestingPage from './pages/TestingPage';
import System from './pages/IsLoggedIn/System';

function App() {
  
  return (
       <Router>
        <div className="App">
          <Routes>
            <Route path='/' element={<Home />} />

            <Route path='/sign-up' element={<Signup />} />
            <Route path='/sign-in' element={<LogIn />} />
            <Route path='/test' element={<TestingPage />} />

            <Route path='/system' element={<System />} />
          </Routes>
        </div>
       </Router>
  )
}

export default App
