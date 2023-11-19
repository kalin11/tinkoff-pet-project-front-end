import { BrowserRouter, Routes, Route } from 'react-router-dom';

// pages
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';


function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={ <Home/> } />
          <Route exact path="/about" element={ <About/> } />
          <Route path="*" element={ <NotFound/> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
