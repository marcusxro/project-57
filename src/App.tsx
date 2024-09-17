import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  
  return (
       <Router>
        <div className="App">
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        </div>
       </Router>
  )
}

export default App
