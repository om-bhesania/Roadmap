import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Nav from './components/nav';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ContactUs from './pages/ContactUs';
import Tracker from './pages/Mapper.jsx';
function App() {

  return (

    <>  
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/contact" element={<ContactUs/>} />
          <Route path="/tracker" element={<Tracker/>} />
          {/* <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} /> */}
        </Routes>
      </BrowserRouter>
      </>
  )
}

export default App
