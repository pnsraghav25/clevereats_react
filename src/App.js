import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import Search from './components/Search';
import ImagePickerExample from './components/ImagePickerExample';
import Chatbot from './components/Chatbot';

const App = () => (
  <Router>
    <Routes>
      {/* Define routes for each screen */}
      <Route path="/" element={<HomeScreen />} />
      <Route path="/search" element={<Search />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/ocr" element={<ImagePickerExample />} />
    </Routes>
  </Router>
);

export default App;
