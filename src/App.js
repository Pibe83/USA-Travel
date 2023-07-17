import React from 'react';
import './App.css';
import Hero from './components/Hero';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Show from './components/Show';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/Show.jsx" element={<Show />} />
          
          {/* ...altri percorsi... */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

