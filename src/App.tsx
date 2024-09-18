import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/AuthPages/Signup';
import LogIn from './pages/AuthPages/LogIn';

function App() {
  
  return (
       <Router>
        <div className="App">
          <Routes>
            <Route path='/' element={<Home />} />

            <Route path='/sign-up' element={<Signup />} />
            <Route path='/sign-in' element={<LogIn />} />
          </Routes>
        </div>
       </Router>
  )
}

export default App
