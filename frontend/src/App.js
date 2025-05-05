import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="text-center mt-20 text-2xl font-semibold">Welcome to Blueprint App</div>} />
      </Routes>
    </Router>
  );
}

export default App;
